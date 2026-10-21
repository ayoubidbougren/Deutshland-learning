import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import {
  auth,
  db,
  signInWithGooglePopup,
  signOutUser,
  ensureUserProfileInFirestore,
  updateSaasUserProfile,
  syncCourseProgressToCloud,
  fetchCourseProgressFromCloud,
  fetchPlatformSettings,
  DEFAULT_PLATFORM_SETTINGS,
  PlatformSettings,
  handleFirestoreError,
  OperationType,
  SaasUserProfile,
  SaasUserPrivateInfo,
  SaasPlanTier,
  TargetGermanLevel,
  ADMIN_EMAIL,
} from '../firebase';
import { getUserProgress, saveUserProgress } from '../utils/bookStorage';

export type AuthModalTab = 'signin' | 'signup' | 'account' | 'upgrade';

interface AuthContextValue {
  user: User | null;
  profile: SaasUserProfile | null;
  privateInfo: SaasUserPrivateInfo | null;
  platformSettings: PlatformSettings;
  isAdminUser: boolean;
  isSuspended: boolean;
  authReady: boolean;
  isSigningIn: boolean;
  authError: string | null;
  isAuthModalOpen: boolean;
  authModalTab: AuthModalTab;
  pendingPlanSelection: SaasPlanTier | null;
  openAuthModal: (tab?: AuthModalTab, plan?: SaasPlanTier) => void;
  closeAuthModal: () => void;
  signInWithGoogle: (options?: {
    plan?: SaasPlanTier;
    targetLevel?: TargetGermanLevel;
    goal?: string;
    city?: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  updatePreferences: (updates: {
    displayName?: string;
    targetLevel?: TargetGermanLevel;
    goal?: string;
    city?: string;
  }) => Promise<void>;
  activateSaasPlan: (plan: SaasPlanTier) => Promise<void>;
  syncNowToCloud: () => Promise<void>;
  refreshPlatformSettings: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<SaasUserProfile | null>(null);
  const [privateInfo, setPrivateInfo] = useState<SaasUserPrivateInfo | null>(null);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(
    DEFAULT_PLATFORM_SETTINGS
  );
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<AuthModalTab>('signin');
  const [pendingPlanSelection, setPendingPlanSelection] = useState<SaasPlanTier | null>(null);

  const refreshPlatformSettings = useCallback(async () => {
    const settings = await fetchPlatformSettings();
    setPlatformSettings(settings);
  }, []);

  useEffect(() => {
    refreshPlatformSettings();
  }, [refreshPlatformSettings]);

  const openAuthModal = useCallback((tab: AuthModalTab = 'signin', plan?: SaasPlanTier) => {
    setAuthError(null);
    if (plan) {
      setPendingPlanSelection(plan);
    }
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthError(null);
  }, []);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setProfile(null);
        setPrivateInfo(null);
        setAuthReady(true);
        return;
      }

      try {
        const localProgress = getUserProgress('daf-kompakt-neu-a1');
        const { profile: ensuredProfile, privateInfo: ensuredPrivate } =
          await ensureUserProfileInFirestore(currentUser, {
            currentDay: localProgress.currentDay || 1,
            currentLesson: localProgress.currentLesson || 1,
            currentPage: localProgress.currentPage || 8,
            completedDaysCount: localProgress.completedDays.length,
            speakingHistoryCount: localProgress.speakingHistoryCount || 0,
          });
        setProfile(ensuredProfile);
        setPrivateInfo(ensuredPrivate);

        // Merge cloud progress with local progress
        const cloudProg = await fetchCourseProgressFromCloud(
          currentUser.uid,
          'daf-kompakt-neu-a1'
        );
        if (cloudProg) {
          const mergedCompletedDays = Array.from(
            new Set([...(localProgress.completedDays || []), ...(cloudProg.completedDays || [])])
          );
          const mergedCompletedPages = Array.from(
            new Set([...(localProgress.completedPages || []), ...(cloudProg.completedPages || [])])
          );
          const mergedCurrentDay = Math.max(
            localProgress.currentDay || 1,
            cloudProg.currentDay || 1
          );
          const mergedCurrentLesson = Math.max(
            localProgress.currentLesson || 1,
            cloudProg.currentLesson || 1
          );
          const mergedProgress = {
            ...localProgress,
            currentDay: mergedCurrentDay,
            currentLesson: mergedCurrentLesson,
            currentPage: Math.max(localProgress.currentPage || 8, cloudProg.currentPage || 8),
            completedDays: mergedCompletedDays,
            completedPages: mergedCompletedPages,
            speakingHistoryCount: Math.max(
              localProgress.speakingHistoryCount || 0,
              cloudProg.speakingHistoryCount || 0
            ),
          };
          saveUserProgress(mergedProgress);
        } else {
          // Upload initial local progress to cloud
          await syncCourseProgressToCloud(currentUser.uid, localProgress);
        }
      } catch (err) {
        console.error('Error initializing user profile in Firestore:', err);
      } finally {
        setAuthReady(true);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Attach real-time listener to `/users/{uid}` ONLY when authReady and user is authenticated
  useEffect(() => {
    if (!authReady || !user) return;

    const uid = user.uid.replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 128);
    const userPath = `users/${uid}`;
    const userRef = doc(db, 'users', uid);

    const unsubscribeSnapshot = onSnapshot(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setProfile(snapshot.data() as SaasUserProfile);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, userPath);
      }
    );

    return () => unsubscribeSnapshot();
  }, [authReady, user]);

  const signInWithGoogle = useCallback(
    async (options?: {
      plan?: SaasPlanTier;
      targetLevel?: TargetGermanLevel;
      goal?: string;
      city?: string;
    }): Promise<boolean> => {
      setIsSigningIn(true);
      setAuthError(null);
      try {
        const signedInUser = await signInWithGooglePopup();
        const localProgress = getUserProgress('daf-kompakt-neu-a1');
        const chosenPlan = options?.plan || pendingPlanSelection || 'free';

        const { profile: ensuredProfile, privateInfo: ensuredPrivate } =
          await ensureUserProfileInFirestore(signedInUser, {
            plan: chosenPlan,
            targetLevel: options?.targetLevel || 'A1',
            goal: options?.goal || 'التحضير لامتحان Goethe A1 & Ausbildung',
            city: options?.city || 'الدار البيضاء / الرباط',
            currentDay: localProgress.currentDay || 1,
            currentLesson: localProgress.currentLesson || 1,
            currentPage: localProgress.currentPage || 8,
            completedDaysCount: localProgress.completedDays.length,
            speakingHistoryCount: localProgress.speakingHistoryCount || 0,
          });

        if (options?.plan || pendingPlanSelection || options?.city || options?.goal || options?.targetLevel) {
          await updateSaasUserProfile(signedInUser.uid, {
            ...(chosenPlan !== 'free' ? { plan: chosenPlan } : {}),
            ...(options?.targetLevel ? { targetLevel: options.targetLevel } : {}),
            ...(options?.goal ? { goal: options.goal } : {}),
            ...(options?.city ? { city: options.city } : {}),
          });
        }

        setProfile(ensuredProfile);
        setPrivateInfo(ensuredPrivate);
        setPendingPlanSelection(null);
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes('popup-closed-by-user')) {
          setAuthError('تم إغلاق نافذة تسجيل الدخول بـ Google قبل إتمام العملية. حاول مرة أخرى.');
        } else {
          setAuthError('حدث خطأ أثناء الاتصال بحساب Gmail. يرجى المحاولة مرة أخرى.');
        }
        return false;
      } finally {
        setIsSigningIn(false);
      }
    },
    [pendingPlanSelection]
  );

  const logout = useCallback(async () => {
    await signOutUser();
    setProfile(null);
    setPrivateInfo(null);
    setIsAuthModalOpen(false);
  }, []);

  const updatePreferences = useCallback(
    async (updates: {
      displayName?: string;
      targetLevel?: TargetGermanLevel;
      goal?: string;
      city?: string;
    }) => {
      if (!user) return;
      await updateSaasUserProfile(user.uid, updates);
    },
    [user]
  );

  const activateSaasPlan = useCallback(
    async (plan: SaasPlanTier) => {
      if (!user) {
        openAuthModal('signup', plan);
        return;
      }
      await updateSaasUserProfile(user.uid, { plan });
    },
    [user, openAuthModal]
  );

  const syncNowToCloud = useCallback(async () => {
    if (!user) return;
    const localProgress = getUserProgress('daf-kompakt-neu-a1');
    await syncCourseProgressToCloud(user.uid, localProgress);
  }, [user]);

  const isAdminUser = Boolean(
    user && user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  );
  const isSuspended = Boolean(profile && profile.status === 'suspended' && !isAdminUser);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        privateInfo,
        platformSettings,
        isAdminUser,
        isSuspended,
        authReady,
        isSigningIn,
        authError,
        isAuthModalOpen,
        authModalTab,
        pendingPlanSelection,
        openAuthModal,
        closeAuthModal,
        signInWithGoogle,
        logout,
        updatePreferences,
        activateSaasPlan,
        syncNowToCloud,
        refreshPlatformSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
