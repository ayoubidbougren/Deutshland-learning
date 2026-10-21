import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  collection,
  query,
  where,
  getDoc,
  getDocs,
  getDocFromServer,
  setDoc,
  updateDoc,
  writeBatch,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export const ADMIN_EMAIL = 'recipeskristen@gmail.com';

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Validate connection to Firestore on initial boot as required by guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validation constants synchronized with firebase-blueprint.json & firestore.rules
export const VALIDATION_LIMITS = {
  ID_MAX_LENGTH: 128,
  ID_REGEX: /^[a-zA-Z0-9_\-]+$/,
  DISPLAY_NAME_MAX_LENGTH: 100,
  PHOTO_URL_MAX_LENGTH: 500,
  EMAIL_MAX_LENGTH: 254,
  GOAL_MAX_LENGTH: 100,
  CITY_MAX_LENGTH: 80,
  COMPLETED_DAYS_MAX: 30,
  COMPLETED_PAGES_MAX: 100,
  ANNOUNCEMENT_MAX_LENGTH: 250,
} as const;

export type SaasPlanTier = 'free' | 'goethe_pass' | 'ausbildung_pro';
export type AccountStatus = 'active' | 'suspended';
export type TargetGermanLevel = 'A1' | 'A2' | 'B1';

export interface SaasUserProfile {
  uid: string;
  displayName: string;
  photoURL: string;
  plan: SaasPlanTier;
  status?: AccountStatus;
  targetLevel: TargetGermanLevel;
  goal: string;
  city: string;
  currentDay?: number;
  currentLesson?: number;
  currentPage?: number;
  completedDaysCount: number;
  speakingHistoryCount?: number;
  createdAt?: Timestamp | string;
  updatedAt?: Timestamp | string;
}

export interface SaasUserPrivateInfo {
  uid: string;
  email: string;
  createdAt?: Timestamp | string;
  updatedAt?: Timestamp | string;
}

export interface CloudCourseProgressDoc {
  uid: string;
  bookId: string;
  currentLesson: number;
  currentDay: number;
  currentPage: number;
  completedDays: number[];
  completedPages: number[];
  speakingHistoryCount: number;
  createdAt?: Timestamp | string;
  updatedAt?: Timestamp | string;
}

export interface PlatformSettings {
  freeModeEnabled: boolean;
  symbolicPriceMad: number;
  proPriceMad: number;
  announcementText: string;
  allowNewSignups: boolean;
  updatedAt?: Timestamp | string;
}

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  freeModeEnabled: true,
  symbolicPriceMad: 49,
  proPriceMad: 99,
  announcementText: '🎉 المنصة مفتوحة حالياً مجاناً للجميع لتجربة التعلم والتحدث بالألمانية!',
  allowNewSignups: true,
};

export interface AdminUserRecord {
  profile: SaasUserProfile;
  email: string;
  progress: CloudCourseProgressDoc | null;
}

function sanitizeString(val: string | null | undefined, fallback: string, maxLen: number): string {
  const trimmed = (val || '').trim() || fallback;
  return trimmed.slice(0, maxLen);
}

function sanitizeId(id: string): string {
  const cleaned = id.replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, VALIDATION_LIMITS.ID_MAX_LENGTH);
  return cleaned || 'default_id';
}

export async function signInWithGooglePopup(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Ensures the signed-in Google user has a valid UserProfile at `/users/{uid}`
 * and isolated PII at `/users/{uid}/private/info`.
 */
export async function ensureUserProfileInFirestore(
  user: User,
  defaults?: {
    plan?: SaasPlanTier;
    targetLevel?: TargetGermanLevel;
    goal?: string;
    city?: string;
    currentDay?: number;
    currentLesson?: number;
    currentPage?: number;
    completedDaysCount?: number;
    speakingHistoryCount?: number;
  }
): Promise<{ profile: SaasUserProfile; privateInfo: SaasUserPrivateInfo }> {
  const uid = sanitizeId(user.uid);
  const userPath = `users/${uid}`;
  const privatePath = `users/${uid}/private/info`;

  const userRef = doc(db, 'users', uid);
  const privateRef = doc(db, 'users', uid, 'private', 'info');

  let existingSnap;
  try {
    existingSnap = await getDoc(userRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, userPath);
  }

  const safeDisplayName = sanitizeString(
    user.displayName || user.email?.split('@')[0],
    'طالب ألمانية',
    VALIDATION_LIMITS.DISPLAY_NAME_MAX_LENGTH
  );
  const safePhotoURL = (user.photoURL || '').slice(0, VALIDATION_LIMITS.PHOTO_URL_MAX_LENGTH);
  const safeEmail = sanitizeString(
    user.email,
    'student@example.com',
    VALIDATION_LIMITS.EMAIL_MAX_LENGTH
  );

  if (existingSnap && existingSnap.exists()) {
    const profileData = existingSnap.data() as SaasUserProfile;
    let privateData: SaasUserPrivateInfo = {
      uid,
      email: safeEmail,
    };
    try {
      const privSnap = await getDoc(privateRef);
      if (privSnap.exists()) {
        privateData = privSnap.data() as SaasUserPrivateInfo;
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, privatePath);
    }
    return { profile: profileData, privateInfo: privateData };
  }

  // Create both UserProfile and isolated PII atomically in a batch
  const newProfilePayload = {
    uid,
    displayName: safeDisplayName,
    photoURL: safePhotoURL,
    plan: defaults?.plan || ('free' as SaasPlanTier),
    status: 'active' as AccountStatus,
    targetLevel: defaults?.targetLevel || ('A1' as TargetGermanLevel),
    goal: sanitizeString(
      defaults?.goal,
      'التحضير لامتحان Goethe A1 & Ausbildung',
      VALIDATION_LIMITS.GOAL_MAX_LENGTH
    ),
    city: sanitizeString(defaults?.city, 'الدار البيضاء / الرباط', VALIDATION_LIMITS.CITY_MAX_LENGTH),
    currentDay: Math.max(1, Math.min(30, Math.floor(defaults?.currentDay ?? 1))),
    currentLesson: Math.max(1, Math.min(30, Math.floor(defaults?.currentLesson ?? 1))),
    currentPage: Math.max(1, Math.min(250, Math.floor(defaults?.currentPage ?? 8))),
    completedDaysCount: Math.max(
      0,
      Math.min(30, Math.floor(defaults?.completedDaysCount ?? 0))
    ),
    speakingHistoryCount: Math.max(
      0,
      Math.min(100000, Math.floor(defaults?.speakingHistoryCount ?? 0))
    ),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const newPrivatePayload = {
    uid,
    email: safeEmail,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    const batch = writeBatch(db);
    batch.set(userRef, newProfilePayload);
    batch.set(privateRef, newPrivatePayload);
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, userPath);
  }

  return {
    profile: {
      uid: newProfilePayload.uid,
      displayName: newProfilePayload.displayName,
      photoURL: newProfilePayload.photoURL,
      plan: newProfilePayload.plan,
      status: newProfilePayload.status,
      targetLevel: newProfilePayload.targetLevel,
      goal: newProfilePayload.goal,
      city: newProfilePayload.city,
      currentDay: newProfilePayload.currentDay,
      currentLesson: newProfilePayload.currentLesson,
      currentPage: newProfilePayload.currentPage,
      completedDaysCount: newProfilePayload.completedDaysCount,
      speakingHistoryCount: newProfilePayload.speakingHistoryCount,
    },
    privateInfo: {
      uid,
      email: safeEmail,
    },
  };
}

export async function updateSaasUserProfile(
  uid: string,
  updates: Partial<{
    displayName: string;
    photoURL: string;
    plan: SaasPlanTier;
    status: AccountStatus;
    targetLevel: TargetGermanLevel;
    goal: string;
    city: string;
    currentDay: number;
    currentLesson: number;
    currentPage: number;
    completedDaysCount: number;
    speakingHistoryCount: number;
  }>
): Promise<void> {
  const safeUid = sanitizeId(uid);
  const userPath = `users/${safeUid}`;
  const userRef = doc(db, 'users', safeUid);

  const sanitizedUpdates: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };

  if (updates.displayName !== undefined) {
    sanitizedUpdates.displayName = sanitizeString(
      updates.displayName,
      'طالب ألمانية',
      VALIDATION_LIMITS.DISPLAY_NAME_MAX_LENGTH
    );
  }
  if (updates.photoURL !== undefined) {
    sanitizedUpdates.photoURL = updates.photoURL.slice(0, VALIDATION_LIMITS.PHOTO_URL_MAX_LENGTH);
  }
  if (updates.plan !== undefined && ['free', 'goethe_pass', 'ausbildung_pro'].includes(updates.plan)) {
    sanitizedUpdates.plan = updates.plan;
  }
  if (updates.status !== undefined && ['active', 'suspended'].includes(updates.status)) {
    sanitizedUpdates.status = updates.status;
  }
  if (updates.targetLevel !== undefined && ['A1', 'A2', 'B1'].includes(updates.targetLevel)) {
    sanitizedUpdates.targetLevel = updates.targetLevel;
  }
  if (updates.goal !== undefined) {
    sanitizedUpdates.goal = sanitizeString(
      updates.goal,
      'التحضير لامتحان Goethe A1 & Ausbildung',
      VALIDATION_LIMITS.GOAL_MAX_LENGTH
    );
  }
  if (updates.city !== undefined) {
    sanitizedUpdates.city = sanitizeString(
      updates.city,
      'الدار البيضاء',
      VALIDATION_LIMITS.CITY_MAX_LENGTH
    );
  }
  if (updates.currentDay !== undefined) {
    sanitizedUpdates.currentDay = Math.max(1, Math.min(30, Math.floor(updates.currentDay)));
  }
  if (updates.currentLesson !== undefined) {
    sanitizedUpdates.currentLesson = Math.max(1, Math.min(30, Math.floor(updates.currentLesson)));
  }
  if (updates.currentPage !== undefined) {
    sanitizedUpdates.currentPage = Math.max(1, Math.min(250, Math.floor(updates.currentPage)));
  }
  if (updates.completedDaysCount !== undefined) {
    sanitizedUpdates.completedDaysCount = Math.max(
      0,
      Math.min(30, Math.floor(updates.completedDaysCount))
    );
  }
  if (updates.speakingHistoryCount !== undefined) {
    sanitizedUpdates.speakingHistoryCount = Math.max(
      0,
      Math.min(100000, Math.floor(updates.speakingHistoryCount))
    );
  }

  try {
    await updateDoc(userRef, sanitizedUpdates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, userPath);
  }
}

export async function syncCourseProgressToCloud(
  uid: string,
  progress: {
    bookId: string;
    currentLesson: number;
    currentDay: number;
    currentPage: number;
    completedDays: number[];
    completedPages: number[];
    speakingHistoryCount: number;
  }
): Promise<void> {
  const safeUid = sanitizeId(uid);
  const safeBookId = sanitizeId(progress.bookId);
  const progressPath = `users/${safeUid}/progress/${safeBookId}`;
  const progressRef = doc(db, 'users', safeUid, 'progress', safeBookId);

  const safeCurrentLesson = Math.max(1, Math.min(30, Math.floor(progress.currentLesson || 1)));
  const safeCurrentDay = Math.max(1, Math.min(30, Math.floor(progress.currentDay || 1)));
  const safeCurrentPage = Math.max(1, Math.min(250, Math.floor(progress.currentPage || 8)));
  const safeCompletedDays = (progress.completedDays || [])
    .map((d) => Math.floor(Number(d)))
    .filter((d) => !Number.isNaN(d) && d >= 1 && d <= 30)
    .slice(0, VALIDATION_LIMITS.COMPLETED_DAYS_MAX);
  const safeCompletedPages = (progress.completedPages || [])
    .map((p) => Math.floor(Number(p)))
    .filter((p) => !Number.isNaN(p) && p >= 1 && p <= 250)
    .slice(0, VALIDATION_LIMITS.COMPLETED_PAGES_MAX);
  const safeSpeakingCount = Math.max(
    0,
    Math.min(100000, Math.floor(progress.speakingHistoryCount || 0))
  );

  let existingSnap;
  try {
    existingSnap = await getDoc(progressRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, progressPath);
  }

  if (existingSnap && existingSnap.exists()) {
    try {
      await updateDoc(progressRef, {
        currentLesson: safeCurrentLesson,
        currentDay: safeCurrentDay,
        currentPage: safeCurrentPage,
        completedDays: safeCompletedDays,
        completedPages: safeCompletedPages,
        speakingHistoryCount: safeSpeakingCount,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, progressPath);
    }
  } else {
    try {
      await setDoc(progressRef, {
        uid: safeUid,
        bookId: safeBookId,
        currentLesson: safeCurrentLesson,
        currentDay: safeCurrentDay,
        currentPage: safeCurrentPage,
        completedDays: safeCompletedDays,
        completedPages: safeCompletedPages,
        speakingHistoryCount: safeSpeakingCount,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, progressPath);
    }
  }

  // Keep study summary fields in sync on UserProfile for the Admin Dashboard
  await updateSaasUserProfile(safeUid, {
    currentDay: safeCurrentDay,
    currentLesson: safeCurrentLesson,
    currentPage: safeCurrentPage,
    completedDaysCount: safeCompletedDays.length,
    speakingHistoryCount: safeSpeakingCount,
  });
}

export async function fetchCourseProgressFromCloud(
  uid: string,
  bookId: string
): Promise<CloudCourseProgressDoc | null> {
  const safeUid = sanitizeId(uid);
  const safeBookId = sanitizeId(bookId);
  const progressPath = `users/${safeUid}/progress/${safeBookId}`;
  const progressRef = doc(db, 'users', safeUid, 'progress', safeBookId);

  try {
    const snap = await getDoc(progressRef);
    if (snap.exists()) {
      return snap.data() as CloudCourseProgressDoc;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, progressPath);
  }
}

/**
 * Fetches Global Platform Settings from `/settings/platform`
 */
export async function fetchPlatformSettings(): Promise<PlatformSettings> {
  const ref = doc(db, 'settings', 'platform');
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data() as PlatformSettings;
    }
    return DEFAULT_PLATFORM_SETTINGS;
  } catch {
    return DEFAULT_PLATFORM_SETTINGS;
  }
}

/**
 * Saves Global Platform Settings to `/settings/platform` (Admin only)
 */
export async function savePlatformSettings(settings: PlatformSettings): Promise<void> {
  const path = 'settings/platform';
  const ref = doc(db, 'settings', 'platform');

  const payload = {
    freeModeEnabled: Boolean(settings.freeModeEnabled),
    symbolicPriceMad: Math.max(0, Math.min(10000, Math.floor(Number(settings.symbolicPriceMad) || 0))),
    proPriceMad: Math.max(0, Math.min(20000, Math.floor(Number(settings.proPriceMad) || 0))),
    announcementText: (settings.announcementText || '').trim().slice(0, VALIDATION_LIMITS.ANNOUNCEMENT_MAX_LENGTH),
    allowNewSignups: Boolean(settings.allowNewSignups),
    updatedAt: serverTimestamp(),
  };

  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, payload);
    } else {
      await setDoc(ref, payload);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetches all users, their isolated email, and their book progress for the Admin Dashboard.
 */
export async function fetchAllUsersForAdmin(): Promise<AdminUserRecord[]> {
  const usersPath = 'users';
  const q = query(collection(db, 'users'), where('uid', '>=', ''));
  let snap;
  try {
    snap = await getDocs(q);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, usersPath);
  }

  const profiles = snap.docs.map((d) => d.data() as SaasUserProfile);
  const results: AdminUserRecord[] = await Promise.all(
    profiles.map(async (profile) => {
      let email = '';
      let progress: CloudCourseProgressDoc | null = null;
      try {
        const privSnap = await getDoc(doc(db, 'users', profile.uid, 'private', 'info'));
        if (privSnap.exists()) {
          email = (privSnap.data() as SaasUserPrivateInfo).email || '';
        }
      } catch {
        // Ignore if private doc missing
      }
      try {
        const progSnap = await getDoc(
          doc(db, 'users', profile.uid, 'progress', 'daf-kompakt-neu-a1')
        );
        if (progSnap.exists()) {
          progress = progSnap.data() as CloudCourseProgressDoc;
        }
      } catch {
        // Ignore if progress doc missing
      }
      return { profile, email, progress };
    })
  );

  return results;
}
