import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Users,
  BookOpen,
  Crown,
  Ban,
  CheckCircle2,
  RefreshCw,
  Search,
  Lock,
  Unlock,
  Sparkles,
  ArrowLeft,
  Activity,
  Mic,
  AlertCircle,
  Save,
  Eye,
  EyeOff,
  LogOut,
  Sliders,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  ADMIN_EMAIL,
  AdminUserRecord,
  fetchAllUsersForAdmin,
  updateSaasUserProfile,
  savePlatformSettings,
  SaasPlanTier,
  AccountStatus,
  PlatformSettings,
  syncCourseProgressToCloud,
} from '../../firebase';

const ADMIN_SECRET_PASS = 'ayoubbou123A$';
const ADMIN_SESSION_STORAGE_KEY = 'deutsch_saas_admin_unlocked_v1';

interface AdminDashboardProps {
  onBackToApp: () => void;
}

function formatTimestampAr(ts: unknown): string {
  if (!ts) return 'غير محدد';
  try {
    if (typeof ts === 'object' && ts !== null && 'seconds' in ts) {
      const sec = (ts as { seconds: number }).seconds;
      const date = new Date(sec * 1000);
      const diffMinutes = Math.floor((Date.now() - date.getTime()) / 60000);
      if (diffMinutes < 5) return '🟢 يدرس الآن (متصل)';
      if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `منذ ${diffHours} ساعة`;
      return date.toLocaleDateString('ar-MA', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    if (typeof ts === 'string') {
      const date = new Date(ts);
      return date.toLocaleDateString('ar-MA');
    }
  } catch {
    return 'غير محدد';
  }
  return 'غير محدد';
}

function isStudyingRecently(ts: unknown): boolean {
  if (!ts || typeof ts !== 'object' || ts === null || !('seconds' in ts)) return false;
  const sec = (ts as { seconds: number }).seconds;
  const diffHours = (Date.now() - sec * 1000) / (1000 * 60 * 60);
  return diffHours <= 24;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToApp }) => {
  const {
    user,
    isAdminUser,
    signInWithGoogle,
    platformSettings,
    refreshPlatformSettings,
  } = useAuth();

  // Admin Credentials Gate State
  const [emailInput, setEmailInput] = useState<string>(() => ADMIN_EMAIL);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isPassUnlocked, setIsPassUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [loginError, setLoginError] = useState<string | null>(null);

  // Admin Data State
  const [usersList, setUsersList] = useState<AdminUserRecord[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [updatingUid, setUpdatingUid] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [planFilter, setPlanFilter] = useState<'all' | SaasPlanTier>('all');

  // Platform Settings Form State
  const [settingsForm, setSettingsForm] = useState<PlatformSettings>(platformSettings);
  const [savingSettings, setSavingSettings] = useState<boolean>(false);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState<string | null>(null);

  useEffect(() => {
    setSettingsForm(platformSettings);
  }, [platformSettings]);

  const isFullyAuthorized = isPassUnlocked && isAdminUser;

  const loadUsers = async () => {
    if (!isFullyAuthorized) return;
    setLoadingUsers(true);
    setAdminError(null);
    try {
      const records = await fetchAllUsersForAdmin();
      setUsersList(records);
    } catch (err) {
      console.error('Error loading users for admin:', err);
      setAdminError('تعذر تحميل قائمة المستخدمين. تأكد من اتصالك بحساب الأدمن recipeskristen@gmail.com.');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isFullyAuthorized) {
      loadUsers();
    }
  }, [isFullyAuthorized]);

  const handleAdminCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (
      emailInput.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase() ||
      passwordInput !== ADMIN_SECRET_PASS
    ) {
      setLoginError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      return;
    }

    try {
      sessionStorage.setItem(ADMIN_SESSION_STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
    setIsPassUnlocked(true);

    // If not yet signed in with Google as recipeskristen@gmail.com, trigger Google Sign-In
    if (!isAdminUser) {
      const ok = await signInWithGoogle();
      if (!ok) {
        setLoginError('يرجى تأكيد الدخول عبر نافذة Google بحساب recipeskristen@gmail.com لتفعيل صلاحيات قاعدة البيانات.');
      }
    }
  };

  const handleLockAdminPanel = () => {
    try {
      sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
    setIsPassUnlocked(false);
    setPasswordInput('');
  };

  const handleToggleUserStatus = async (record: AdminUserRecord) => {
    const currentStatus: AccountStatus = record.profile.status || 'active';
    const nextStatus: AccountStatus = currentStatus === 'active' ? 'suspended' : 'active';
    setUpdatingUid(record.profile.uid);
    try {
      await updateSaasUserProfile(record.profile.uid, { status: nextStatus });
      setUsersList((prev) =>
        prev.map((item) =>
          item.profile.uid === record.profile.uid
            ? { ...item, profile: { ...item.profile, status: nextStatus } }
            : item
        )
      );
    } catch (err) {
      console.error('Failed to toggle user status:', err);
    } finally {
      setUpdatingUid(null);
    }
  };

  const handleChangeUserPlan = async (record: AdminUserRecord, newPlan: SaasPlanTier) => {
    setUpdatingUid(record.profile.uid);
    try {
      await updateSaasUserProfile(record.profile.uid, { plan: newPlan });
      setUsersList((prev) =>
        prev.map((item) =>
          item.profile.uid === record.profile.uid
            ? { ...item, profile: { ...item.profile, plan: newPlan } }
            : item
        )
      );
    } catch (err) {
      console.error('Failed to update user plan:', err);
    } finally {
      setUpdatingUid(null);
    }
  };

  const handleChangeUserDay = async (record: AdminUserRecord, newDay: number) => {
    const clampedDay = Math.max(1, Math.min(24, newDay));
    const computedLesson = Math.min(8, Math.ceil(clampedDay / 3));
    const computedPage = 8 + (clampedDay - 1) * 2;
    const completedDaysArr = Array.from({ length: clampedDay - 1 }, (_, i) => i + 1);
    const completedPagesArr = Array.from({ length: (clampedDay - 1) * 2 }, (_, i) => 8 + i);

    setUpdatingUid(record.profile.uid);
    try {
      await syncCourseProgressToCloud(record.profile.uid, {
        bookId: 'daf-kompakt-neu-a1',
        currentDay: clampedDay,
        currentLesson: computedLesson,
        currentPage: computedPage,
        completedDays: completedDaysArr,
        completedPages: completedPagesArr,
        speakingHistoryCount:
          record.progress?.speakingHistoryCount ?? record.profile.speakingHistoryCount ?? 0,
      });

      setUsersList((prev) =>
        prev.map((item) =>
          item.profile.uid === record.profile.uid
            ? {
                ...item,
                profile: {
                  ...item.profile,
                  currentDay: clampedDay,
                  currentLesson: computedLesson,
                  currentPage: computedPage,
                  completedDaysCount: completedDaysArr.length,
                },
                progress: item.progress
                  ? {
                      ...item.progress,
                      currentDay: clampedDay,
                      currentLesson: computedLesson,
                      currentPage: computedPage,
                      completedDays: completedDaysArr,
                      completedPages: completedPagesArr,
                    }
                  : null,
              }
            : item
        )
      );
    } catch (err) {
      console.error('Failed to update user day:', err);
    } finally {
      setUpdatingUid(null);
    }
  };

  const handleSavePlatformSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSavedMsg(null);
    try {
      await savePlatformSettings(settingsForm);
      await refreshPlatformSettings();
      setSettingsSavedMsg('تم حفظ إعدادات المنصة والأسعار الرمزية بنجاح!');
      setTimeout(() => setSettingsSavedMsg(null), 3500);
    } catch (err) {
      console.error('Failed to save platform settings:', err);
      setAdminError('حدث خطأ أثناء حفظ إعدادات المنصة.');
    } finally {
      setSavingSettings(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return usersList.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.profile.displayName.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.profile.uid.toLowerCase().includes(q);

      const currentStatus = item.profile.status || 'active';
      const matchesStatus = statusFilter === 'all' || currentStatus === statusFilter;
      const matchesPlan = planFilter === 'all' || item.profile.plan === planFilter;

      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [usersList, searchQuery, statusFilter, planFilter]);

  const stats = useMemo(() => {
    const total = usersList.length;
    const activeAccounts = usersList.filter((u) => (u.profile.status || 'active') === 'active').length;
    const suspendedAccounts = usersList.filter((u) => u.profile.status === 'suspended').length;
    const paidPlans = usersList.filter((u) => u.profile.plan !== 'free').length;
    const studyingToday = usersList.filter((u) => isStudyingRecently(u.profile.updatedAt)).length;
    return { total, activeAccounts, suspendedAccounts, paidPlans, studyingToday };
  }, [usersList]);

  // ============================================================================
  // 1. RENDER LOGIN GATE IF NOT YET UNLOCKED OR NOT SIGNED IN AS ADMIN GMAIL
  // ============================================================================
  if (!isFullyAuthorized) {
    return (
      <div
        className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4"
        dir="rtl"
      >
        <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-emerald-400 to-amber-500" />

          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-lg font-black text-white">لوحة تحكم الأدمن (/admin)</h1>
                  <p className="text-xs text-slate-400">إدارة المشتركين، الباقات، وتفعيل المنصة</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onBackToApp}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <span>العودة</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            {loginError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            {!isPassUnlocked ? (
              <form onSubmit={handleAdminCredentialsSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    البريد الإلكتروني للأدمن (Gmail):
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                    placeholder="recipeskristen@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    كلمة المرور (Password):
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                      placeholder="••••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg transition-all cursor-pointer"
                >
                  دخول للوحة تحكم الأدمن
                </button>
              </form>
            ) : (
              /* Step 2: If password is verified, ensure Firebase Auth session is recipeskristen@gmail.com */
              <div className="space-y-4 text-center">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
                  تم التحقق من كلمة المرور بنجاح! الآن اضغط على الزر أسفله لربط جلسة{' '}
                  <span className="font-mono font-bold text-white">{ADMIN_EMAIL}</span> بقاعدة بيانات
                  Firestore.
                  {user && user.email && user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase() && (
                    <div className="mt-2 text-rose-300 font-bold">
                      أنت متصل حالياً بـ ({user.email}). يرجى اختيار حساب {ADMIN_EMAIL}.
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => signInWithGoogle()}
                  className="w-full py-4 px-5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>تأكيد جلسة الأدمن عبر Google ({ADMIN_EMAIL})</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 2. RENDER FULL ADMIN CONTROL DASHBOARD
  // ============================================================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans" dir="rtl">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black text-white">
                  لوحة تحكم الأدمن (SaaS Admin Panel)
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
                  {ADMIN_EMAIL}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                إدارة المستخدمين، تتبع الدراسة (Day &amp; Lektion)، والتحكم في مجانية أو تسعير المنصة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadUsers}
              disabled={loadingUsers}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${loadingUsers ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">تحديث البيانات</span>
            </button>

            <button
              type="button"
              onClick={onBackToApp}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer"
            >
              <span>العودة للمنصة</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleLockAdminPanel}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 cursor-pointer"
              title="قفل لوحة الأدمن"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {adminError && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{adminError}</span>
          </div>
        )}

        {/* ================================================================== */}
        {/* 1. KPI OVERVIEW CARDS                                              */}
        {/* ================================================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>إجمالي المسجلين</span>
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">{stats.total}</div>
            <div className="text-[11px] text-slate-500">طالب مسجل بـ Gmail</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>يدرسون اليوم (24h)</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">{stats.studyingToday}</div>
            <div className="text-[11px] text-slate-500">نشطون في الدروس مؤخراً</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>حسابات مفعلة</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">{stats.activeAccounts}</div>
            <div className="text-[11px] text-slate-500">مسموح لهم بالدخول</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>حسابات موقوفة</span>
              <Ban className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-rose-400">{stats.suspendedAccounts}</div>
            <div className="text-[11px] text-slate-500">تم إيقافهم من الأدمن</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>الباقات المدفوعة</span>
              <Crown className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">{stats.paidPlans}</div>
            <div className="text-[11px] text-slate-500">Goethe Pass &amp; Pro</div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* 2. GLOBAL PLATFORM MODE (FREE LAUNCH VS SYMBOLIC PRICE)            */}
        {/* ================================================================== */}
        <form
          onSubmit={handleSavePlatformSettings}
          className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-5 h-5 text-amber-400" />
              <div>
                <h2 className="text-sm sm:text-base font-black text-white">
                  وضع المنصة العام: الإطلاق المجاني (فابور للتجربة) أو الاشتراك بثمن رمزي
                </h2>
                <p className="text-xs text-slate-400">
                  تحكم بضغطة زر في فتح المنصة مجاناً للجميع أو تفعيل الثمن الرمزي بالدرهم المغربي (MAD)
                </p>
              </div>
            </div>

            {settingsSavedMsg && (
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                {settingsSavedMsg}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Mode Toggle Cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSettingsForm((s) => ({ ...s, freeModeEnabled: true }))}
                className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                  settingsForm.freeModeEnabled
                    ? 'border-emerald-500 bg-emerald-500/15 text-white ring-1 ring-emerald-500/40'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Unlock className="w-4 h-4 text-emerald-400" />
                  {settingsForm.freeModeEnabled && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 font-black">
                      مفعل الآن
                    </span>
                  )}
                </div>
                <div className="text-xs font-black text-white mt-2">
                  🟢 مفتوحة فابور للجميع
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  الكل يجرب الدروس مجاناً
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSettingsForm((s) => ({ ...s, freeModeEnabled: false }))}
                className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                  !settingsForm.freeModeEnabled
                    ? 'border-amber-500 bg-amber-500/15 text-white ring-1 ring-amber-500/40'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Lock className="w-4 h-4 text-amber-400" />
                  {!settingsForm.freeModeEnabled && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-black">
                      مفعل الآن
                    </span>
                  )}
                </div>
                <div className="text-xs font-black text-white mt-2">
                  🟡 وضع الثمن الرمزي (Paid)
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  تقييد الدروس حسب الباقة
                </div>
              </button>
            </div>

            {/* Symbolic Prices & Announcement */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  الثمن الرمزي لباقة غوته (MAD):
                </label>
                <input
                  type="number"
                  min={0}
                  max={10000}
                  value={settingsForm.symbolicPriceMad}
                  onChange={(e) =>
                    setSettingsForm((s) => ({
                      ...s,
                      symbolicPriceMad: Number(e.target.value) || 0,
                    }))
                  }
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  ثمن باقة الأوسبيلدونغ Pro (MAD):
                </label>
                <input
                  type="number"
                  min={0}
                  max={20000}
                  value={settingsForm.proPriceMad}
                  onChange={(e) =>
                    setSettingsForm((s) => ({
                      ...s,
                      proPriceMad: Number(e.target.value) || 0,
                    }))
                  }
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  رسالة الشريط الإعلاني للمستخدمين:
                </label>
                <input
                  type="text"
                  maxLength={250}
                  value={settingsForm.announcementText}
                  onChange={(e) =>
                    setSettingsForm((s) => ({ ...s, announcementText: e.target.value }))
                  }
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  placeholder="مثال: المنصة مفتوحة حالياً مجاناً للجميع..."
                />
              </div>
            </div>

            <div className="lg:col-span-2 flex items-end h-full">
              <button
                type="submit"
                disabled={savingSettings}
                className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                <span>{savingSettings ? 'جاري الحفظ...' : 'حفظ الإعدادات'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* ================================================================== */}
        {/* 3. USERS & STUDY PROGRESS TABLE                                    */}
        {/* ================================================================== */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden">
          {/* Table Header & Filters */}
          <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <span>قائمة المستخدمين وتتبع الدراسة والباقات ({filteredUsers.length})</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                راقب أين وصل كل طالب (أي Day وأي Lektion)، وقم بتفعيل أو إيقاف حسابه أو تغيير باقته فوراً
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالاسم أو Gmail..."
                  className="rounded-xl bg-slate-950 border border-slate-800 pr-8 pl-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'suspended')}
                className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="all">كل الحالات (نشط + موقوف)</option>
                <option value="active">الحسابات النشطة فقط</option>
                <option value="suspended">الحسابات الموقوفة فقط</option>
              </select>

              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value as 'all' | SaasPlanTier)}
                className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="all">جميع الباقات</option>
                <option value="free">الباقة المجانية (Free)</option>
                <option value="goethe_pass">باقة غوته (Goethe Pass)</option>
                <option value="ausbildung_pro">باقة الأوسبيلدونغ (Pro)</option>
              </select>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase">
                <tr>
                  <th className="py-3.5 px-4 font-bold">المستخدم (Gmail)</th>
                  <th className="py-3.5 px-4 font-bold">واش كيقرا / آخر نشاط</th>
                  <th className="py-3.5 px-4 font-bold">فين وصل فالكتاب (Day &amp; Lektion)</th>
                  <th className="py-3.5 px-4 font-bold">المحادثات الصوتية</th>
                  <th className="py-3.5 px-4 font-bold">باقة الاشتراك (Plan)</th>
                  <th className="py-3.5 px-4 font-bold">التحكم (تفعيل / توقيف)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {loadingUsers ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin text-amber-400 mx-auto mb-2" />
                      <span>جاري تحميل بيانات المستخدمين وتقدمهم الدراسي...</span>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      لا يوجد مستخدمون مطابقون للبحث حالياً.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((record) => {
                    const { profile, email, progress } = record;
                    const currentDay = progress?.currentDay ?? profile.currentDay ?? 1;
                    const currentLesson = progress?.currentLesson ?? profile.currentLesson ?? 1;
                    const currentPage = progress?.currentPage ?? profile.currentPage ?? 8;
                    const completedCount =
                      progress?.completedDays?.length ?? profile.completedDaysCount ?? 0;
                    const speakingCount =
                      progress?.speakingHistoryCount ?? profile.speakingHistoryCount ?? 0;
                    const status: AccountStatus = profile.status || 'active';
                    const isBusy = updatingUid === profile.uid;
                    const progressPercent = Math.min(100, Math.round((completedCount / 24) * 100));

                    return (
                      <tr
                        key={profile.uid}
                        className={`hover:bg-slate-800/40 transition-colors ${
                          status === 'suspended' ? 'bg-rose-950/15 opacity-80' : ''
                        }`}
                      >
                        {/* 1. User Identity */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {profile.photoURL ? (
                              <img
                                src={profile.photoURL}
                                alt={profile.displayName}
                                className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center shrink-0">
                                {(profile.displayName || email || 'U')[0].toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="font-black text-white text-xs truncate">
                                {profile.displayName}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono truncate">
                                {email || profile.uid}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Activity Status */}
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                isStudyingRecently(profile.updatedAt)
                                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {formatTimestampAr(profile.updatedAt)}
                            </span>
                            <div className="text-[10px] text-slate-500">
                              المستوى: {profile.targetLevel || 'A1'}
                            </div>
                          </div>
                        </td>

                        {/* 3. Book Progress (Day, Lektion, Page + Quick Day Changer) */}
                        <td className="py-4 px-4">
                          <div className="space-y-1.5 min-w-[190px]">
                            <div className="flex items-center justify-between">
                              <span className="font-black text-amber-400 flex items-center gap-1">
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>وصل لـ Day {currentDay} / 24</span>
                              </span>
                              <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                                Lektion {currentLesson} • ص {currentPage}
                              </span>
                            </div>

                            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all"
                                style={{ width: `${Math.max(5, progressPercent)}%` }}
                              />
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                              <span>أكمل {completedCount} حصص ({progressPercent}%)</span>
                              <div className="flex items-center gap-1">
                                <span>تغيير Day:</span>
                                <select
                                  disabled={isBusy}
                                  value={currentDay}
                                  onChange={(e) =>
                                    handleChangeUserDay(record, Number(e.target.value))
                                  }
                                  className="bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-amber-300 font-bold cursor-pointer"
                                >
                                  {Array.from({ length: 24 }, (_, i) => i + 1).map((d) => (
                                    <option key={d} value={d}>
                                      Day {d}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 4. Speaking Sessions Count */}
                        <td className="py-4 px-4">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-bold">
                            <Mic className="w-3.5 h-3.5 text-amber-400" />
                            <span>{speakingCount} محادثة</span>
                          </div>
                        </td>

                        {/* 5. SaaS Plan Selector */}
                        <td className="py-4 px-4">
                          <select
                            disabled={isBusy}
                            value={profile.plan || 'free'}
                            onChange={(e) =>
                              handleChangeUserPlan(record, e.target.value as SaasPlanTier)
                            }
                            className={`rounded-xl border px-3 py-2 text-xs font-black cursor-pointer focus:outline-none ${
                              profile.plan === 'ausbildung_pro'
                                ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                                : profile.plan === 'goethe_pass'
                                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                                : 'bg-slate-950 border-slate-700 text-slate-300'
                            }`}
                          >
                            <option value="free" className="bg-slate-900 text-white">
                              Free (مجاني)
                            </option>
                            <option value="goethe_pass" className="bg-slate-900 text-amber-300">
                              Goethe Pass 🔥
                            </option>
                            <option value="ausbildung_pro" className="bg-slate-900 text-indigo-300">
                              Ausbildung Pro 🇩🇪
                            </option>
                          </select>
                        </td>

                        {/* 6. Activate / Suspend Platform Access */}
                        <td className="py-4 px-4">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleToggleUserStatus(record)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 ${
                              status === 'active'
                                ? 'bg-emerald-500/15 hover:bg-rose-500/20 text-emerald-300 hover:text-rose-300 border border-emerald-500/30 hover:border-rose-500/40'
                                : 'bg-rose-500 hover:bg-emerald-500 text-white hover:text-slate-950 shadow-md'
                            }`}
                          >
                            {status === 'active' ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>نشط (إيقاف المنصة)</span>
                              </>
                            ) : (
                              <>
                                <Ban className="w-3.5 h-3.5" />
                                <span>موقوف (تفعيل المنصة)</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
