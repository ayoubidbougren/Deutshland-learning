/**
 * Firestore Security Rules Verification Specification
 * Verifies all 12 "Dirty Dozen" adversarial payloads are rejected with PERMISSION_DENIED.
 */

export interface SecurityTestCase {
  id: number;
  name: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  path: string;
  auth: { uid: string; email?: string; email_verified?: boolean } | null;
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED' | 'ALLOWED';
}

export const DIRTY_DOZEN_TEST_CASES: SecurityTestCase[] = [
  {
    id: 1,
    name: 'Unauthenticated Write to UserProfile',
    operation: 'create',
    path: '/users/user_1',
    auth: null,
    payload: { uid: 'user_1', displayName: 'Amin' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Unverified Email Write Attempt',
    operation: 'create',
    path: '/users/user_1',
    auth: { uid: 'user_1', email: 'amin@gmail.com', email_verified: false },
    payload: { uid: 'user_1', displayName: 'Amin' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Cross-User Identity Spoofing',
    operation: 'create',
    path: '/users/victim_1',
    auth: { uid: 'attacker_1', email: 'attacker@gmail.com', email_verified: true },
    payload: { uid: 'victim_1', displayName: 'Spoofed' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Shadow Field Injection on Create (isAdmin)',
    operation: 'create',
    path: '/users/user_1',
    auth: { uid: 'user_1', email: 'amin@gmail.com', email_verified: true },
    payload: {
      uid: 'user_1',
      displayName: 'Amin',
      photoURL: '',
      plan: 'free',
      targetLevel: 'A1',
      goal: 'Goethe A1',
      city: 'Rabat',
      completedDaysCount: 0,
      isAdmin: true,
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Shadow Field Injection on Update',
    operation: 'update',
    path: '/users/user_1',
    auth: { uid: 'user_1', email: 'amin@gmail.com', email_verified: true },
    payload: { role: 'superadmin' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Value Poisoning on Whitelisted Field (Oversized displayName)',
    operation: 'update',
    path: '/users/user_1',
    auth: { uid: 'user_1', email: 'amin@gmail.com', email_verified: true },
    payload: { displayName: 'A'.repeat(1024) },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Cross-User PII Read on Private Subcollection',
    operation: 'get',
    path: '/users/user_1/private/info',
    auth: { uid: 'user_2', email: 'other@gmail.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Immutable Field Mutation (uid or createdAt)',
    operation: 'update',
    path: '/users/user_1',
    auth: { uid: 'user_1', email: 'amin@gmail.com', email_verified: true },
    payload: { uid: 'user_2' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Client Timestamp Forgery',
    operation: 'update',
    path: '/users/user_1',
    auth: { uid: 'user_1', email: 'amin@gmail.com', email_verified: true },
    payload: { updatedAt: '2020-01-01T00:00:00Z' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'ID Poisoning on Progress Document ID',
    operation: 'create',
    path: '/users/user_1/progress/invalid$id!spaces',
    auth: { uid: 'user_1', email: 'amin@gmail.com', email_verified: true },
    payload: { uid: 'user_1', bookId: 'invalid$id!spaces' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Orphaned Subcollection Write without Parent User Profile',
    operation: 'create',
    path: '/users/non_existent_user/progress/daf-kompakt-neu-a1',
    auth: { uid: 'non_existent_user', email: 'test@gmail.com', email_verified: true },
    payload: { uid: 'non_existent_user', bookId: 'daf-kompakt-neu-a1' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Unbounded Array Exhaustion on completedDays',
    operation: 'update',
    path: '/users/user_1/progress/daf-kompakt-neu-a1',
    auth: { uid: 'user_1', email: 'amin@gmail.com', email_verified: true },
    payload: { completedDays: Array.from({ length: 50 }, (_, i) => i + 1) },
    expectedResult: 'PERMISSION_DENIED',
  },
];
