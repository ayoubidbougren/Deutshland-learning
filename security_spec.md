# Security Specification (`security_spec.md`)

## 1. Data Invariants

1. **Global Default Deny**: Any path not explicitly matched is strictly denied (`allow read, write: if false;`).
2. **Verified Identity Enforcement**: All writes require an authenticated user (`request.auth != null`) with a verified email (`request.auth.token.email_verified == true`).
3. **Path-to-Payload Identity Binding**:
   - A `UserProfile` at `/users/{userId}` can only be read, created, or updated when `request.auth.uid == userId` and `incoming().uid == request.auth.uid`.
   - `UserPrivateInfo` at `/users/{userId}/private/{docId}` is strictly isolated PII (`email`), readable and writable only by `request.auth.uid == userId`, with `docId == 'info'` and `incoming().uid == request.auth.uid`.
   - `CourseProgressDoc` at `/users/{userId}/progress/{bookId}` requires the parent `/users/{userId}` document to exist and belong to `request.auth.uid` (Master Gate relational check), and enforces `incoming().uid == request.auth.uid` and `incoming().bookId == bookId`.
4. **Immutable Fields**: `uid`, `createdAt`, and `bookId` cannot be mutated after document creation.
5. **Temporal Integrity**: `createdAt` on create and `updatedAt` on create/update must equal `request.time`.
6. **Strict Schema & Bounded Sizes**: Every string has explicit `.size()` bounds and regex validation where applicable; arrays (`completedDays`, `completedPages`) have strict `.size()` upper bounds and element type checks.

---

## 2. The "Dirty Dozen" Payloads

1. **Unauthenticated Write**: `auth = null` attempting to create `/users/user_1`.
2. **Unverified Email Spoof**: `auth = { uid: 'user_1', token: { email_verified: false } }` attempting to create `/users/user_1`.
3. **Cross-User Profile Hijack (Identity Spoofing)**: `auth.uid = 'attacker_1'` attempting to create `/users/victim_1` or set `uid: 'victim_1'`.
4. **Shadow Field Injection on Create**: Creating `/users/user_1` with an undeclared field `isAdmin: true`.
5. **Shadow Field Injection on Update**: Updating `/users/user_1` with an extra key `role: 'superadmin'` not in `affectedKeys().hasOnly(...)`.
6. **Value Poisoning on Whitelisted Key**: Updating `/users/user_1` `displayName` with a 5,000-character string or a boolean.
7. **PII Leak (Cross-User Read on Private Subcollection)**: `auth.uid = 'user_2'` attempting `get` on `/users/user_1/private/info`.
8. **Immutable Field Mutation**: Updating `/users/user_1` while changing `createdAt` or `uid`.
9. **Client Timestamp Forgery**: Creating or updating `/users/user_1` with a forged past/future `updatedAt` timestamp instead of `request.time`.
10. **ID Poisoning Attack**: Creating `/users/user_1/progress/invalid$id!with spaces` that violates `^[a-zA-Z0-9_\-]+$`.
11. **Orphaned Subcollection Write (Master Gate Bypass)**: Attempting to create `/users/user_1/progress/daf-kompakt-neu-a1` when parent `/users/user_1` does not exist.
12. **Unbounded Array Exhaustion**: Updating `/users/user_1/progress/daf-kompakt-neu-a1` with `completedDays` containing 500 elements (exceeding max 30).

---

## 3. Test Runner Specification (`firestore.rules.test.ts`)

See `/firestore.rules.test.ts` for the complete test suite verifying that all 12 Dirty Dozen payloads return `PERMISSION_DENIED`.
