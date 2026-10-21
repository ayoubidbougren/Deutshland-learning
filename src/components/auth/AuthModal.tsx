import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  LogOut,
  GraduationCap,
  AlertCircle,
  ArrowRight,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  onSuccessEnterApp?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccessEnterApp }) => {
  const {
    user,
    profile,
    privateInfo,
    isSigningIn,
    authError,
    isAuthModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
    signInWithGoogle,
    logout,
  } = useAuth();

  if (!isAuthModalOpen) return null;

  const handleGoogleAuthClick = async () => {
    const ok = await signInWithGoogle();
    if (ok) {
      closeAuthModal();
      if (onSuccessEnterApp) {
        onSuccessEnterApp();
      }
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        dir="rtl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl overflow-hidden"
        >
          {/* Top Accent Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-emerald-400 to-amber-500" />

          {/* Header */}
          <div className="px-6 pt-5 pb-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                {user ? <UserCheck className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-base font-black text-white">
                  {user
                    ? 'حسابي في المنصة'
                    : authModalTab === 'signup'
                    ? 'إنشاء حساب جديد (Sign Up)'
                    : 'تسجيل الدخول (Sign In)'}
                </h2>
                <p className="text-xs text-slate-400">
                  {user
                    ? 'حسابك مرتبط بـ Gmail لحفظ تقدمك تلقائياً'
                    : 'استخدم حسابك في Gmail للدخول وحفظ دروسك'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeAuthModal}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {authError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {!user ? (
              <>
                {/* Simple Sign In / Sign Up Switch */}
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => openAuthModal('signin')}
                    className={`py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      authModalTab === 'signin'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    تسجيل الدخول (Sign In)
                  </button>
                  <button
                    type="button"
                    onClick={() => openAuthModal('signup')}
                    className={`py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      authModalTab !== 'signin'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    حساب جديد (Sign Up)
                  </button>
                </div>

                {/* One-Click Google Button */}
                <button
                  type="button"
                  disabled={isSigningIn}
                  onClick={handleGoogleAuthClick}
                  className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-slate-100 active:scale-[0.99] text-slate-950 font-black text-sm sm:text-base shadow-xl flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isSigningIn ? (
                    <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-950 rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.7-2.9z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.9C3.5 20.4 7.4 23 12 23z"
                      />
                    </svg>
                  )}
                  <span>
                    {isSigningIn
                      ? 'جاري الاتصال بحساب Gmail...'
                      : authModalTab === 'signup'
                      ? 'التسجيل بضغطة واحدة عبر Gmail'
                      : 'الدخول بضغطة واحدة عبر Gmail'}
                  </span>
                </button>
              </>
            ) : (
              /* Simple Signed-In Account Card */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={profile?.displayName || 'User'}
                      className="w-12 h-12 rounded-2xl object-cover border border-emerald-500/40 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black text-lg flex items-center justify-center shrink-0">
                      {(profile?.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-sm truncate">
                        {profile?.displayName || user.displayName || 'طالب ألمانية'}
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>
                    <p className="text-xs text-slate-400 font-mono truncate">
                      {privateInfo?.email || user.email}
                    </p>
                    <p className="text-[11px] text-emerald-400 mt-1">
                      تقدمك محفوظ سحابياً ({profile?.completedDaysCount ?? 0} / 24 حصة)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      closeAuthModal();
                      if (onSuccessEnterApp) onSuccessEnterApp();
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>متابعة الدروس</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </button>

                  <button
                    type="button"
                    onClick={logout}
                    className="py-3 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
