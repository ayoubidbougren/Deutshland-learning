import React, { useState } from 'react';
import {
  Mic,
  BookOpen,
  Sparkles,
  Award,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Star,
  Users,
  MessageSquare,
  Volume2,
  Lock,
  Compass,
  FileCheck,
  PhoneCall,
  GraduationCap,
  LogIn,
  UserPlus,
  Crown,
} from 'lucide-react';
import { AppMode } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface LandingPageProps {
  onEnterApp: () => void;
  onSelectMode: (mode: AppMode) => void;
  onOpenAdmin?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onSelectMode,
  onOpenAdmin,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly'>('quarterly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const { user, profile, platformSettings, isAdminUser, openAuthModal } = useAuth();

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans text-right" dir="rtl">
      {/* ============================================================== */}
      {/* 1. TOP STICKY SAAS NAVBAR                                      */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
              <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white">
                  Deutsch Sprechen
                </span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  🇲🇦 المغرب Edition
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                منصة تعلم الألمانية الذكية بالدارجة ومنهج غوته
              </p>
            </div>
          </div>

          {/* Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-amber-400 transition-colors">
              المميزات
            </a>
            <a href="#curriculum" className="hover:text-amber-400 transition-colors">
              المنهج والكتاب
            </a>
            <a href="#pricing" className="hover:text-amber-400 transition-colors">
              باقات الاشتراك (MAD)
            </a>
            <a href="#testimonials" className="hover:text-amber-400 transition-colors">
              تجارب الطلاب
            </a>
            <a href="#faq" className="hover:text-amber-400 transition-colors">
              الأسئلة الشائعة
            </a>
          </nav>

          {/* CTA Action & Gmail Auth Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {!user ? (
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span>تسجيل الدخول</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('account')}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                title="إدارة حسابك واشتراكك في المنصة"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={profile?.displayName || 'User'}
                    className="w-6 h-6 rounded-lg object-cover border border-amber-400/50"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                    {(profile?.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="hidden md:inline max-w-[110px] truncate">
                  {profile?.displayName || user.displayName || 'حسابي'}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono">
                  {profile?.plan === 'ausbildung_pro'
                    ? 'PRO 🇩🇪'
                    : profile?.plan === 'goethe_pass'
                    ? 'Goethe 🔥'
                    : 'Free'}
                </span>
              </button>
            )}

            {isAdminUser && onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-black flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            )}

            <button
              onClick={onEnterApp}
              className="px-3.5 sm:px-5 py-2.5 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/25 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>دخول للمنصة</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. HERO SECTION (MOROCCO TARGETING & GOETHE PREPARATION)       */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-24 border-b border-slate-800/80 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/25 via-slate-950 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-amber-300 text-xs sm:text-sm font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>أول منصة ذكاء اصطناعي تفاعلية في المغرب لتعلم والتحدث بالألمانية</span>
              <span className="bg-amber-400/20 text-amber-300 px-2 py-0.2 rounded-full text-[10px]">A1 • A2 • B1</span>
            </div>

            {/* Main Heading for SEO Morocco */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight sm:leading-tight">
              تعلم وتحدث الألمانية بطلاقة في المغرب
              <span className="block mt-2 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                للتحضير لامتحان Goethe وعقود Ausbildung
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              تدرب على المحادثة الشفهية (<span className="text-amber-400 font-bold">Sprechen</span>) في أي وقت بصوت ألماني بشري فائق النقاء، مع مرافقة كتاب <span className="font-semibold text-white">DaF kompakt neu</span> صفحة بصفحة، وميزة سحرية حصرية: <span className="text-emerald-400 font-bold">«شرح القواعد بالدارجة المغربية»</span> لاجتياز امتحانات السفارة ومعهد غوته بنجاح.
            </p>

            {/* Hero CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={onEnterApp}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-base shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 transition-all cursor-pointer"
              >
                <Mic className="w-5 h-5 text-slate-950" />
                <span>ابدأ التدريب والمحادثة مجاناً</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>

              {!user ? (
                <button
                  type="button"
                  onClick={() => openAuthModal('signup', 'goethe_pass')}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-base shadow-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                >
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
                  <span>إنشاء حساب بـ Gmail (Sign Up)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal('account')}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Crown className="w-5 h-5 text-amber-400" />
                  <span>حسابي المفعل ({profile?.displayName || user.displayName})</span>
                </button>
              )}
            </div>

            {/* Trust Metrics Bar */}
            <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-300">
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-2xl font-black text-amber-400">+1,400</div>
                <div className="text-xs text-slate-400 mt-0.5">طالب ومترشح بالمغرب</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-2xl font-black text-emerald-400">94%</div>
                <div className="text-xs text-slate-400 mt-0.5">نسبة نجاح امتحان غوته</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-2xl font-black text-amber-400">24 يوماً</div>
                <div className="text-xs text-slate-400 mt-0.5">منهج DaF kompakt A1 صفحة بصفحة</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-2xl font-black text-indigo-400">100%</div>
                <div className="text-xs text-slate-400 mt-0.5">دعم ومرافقة بالدارجة المغربية</div>
              </div>
            </div>
          </div>

          {/* ========================================================== */}
          {/* INTERACTIVE MOCKUP SHOWCASE (VISUAL PROOF)                 */}
          {/* ========================================================== */}
          <div className="mt-14 max-w-5xl mx-auto rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-4 sm:p-7 shadow-2xl shadow-black/80">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                <span className="text-xs font-mono text-slate-400 mr-2">live-tutor-morocco.app</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Gemini Live الصوت اللحظي نشط</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Column: Simulated Audio Exchange */}
              <div className="lg:col-span-7 space-y-4">
                {/* AI Speech Bubble */}
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-amber-400" />
                      <span>الأستاذ الافتراضي (Virtueller Prüfer)</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Deutsch &bull; C1 Muttersprachler</span>
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                    „Guten Tag! Erzählen Sie mir bitte über Ihre Pläne für die Ausbildung in Deutschland.“
                  </p>
                  <p className="text-xs text-slate-400">
                    «نهارك سعيد! عاود ليا عافاك على المخطط ديالك بخصوص التكوين المهني (Ausbildung) في ألمانيا.»
                  </p>
                </div>

                {/* Student Darija Request Bubble */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5 text-right mr-6">
                  <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-amber-400" />
                      <span>أنت (بالصوت):</span>
                    </span>
                    <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.2 rounded text-amber-200">طلب بالدارجة</span>
                  </div>
                  <p className="text-sm font-bold text-amber-100">
                    «شرح ليا بالدارجة كيفاش نقول راني باغي ندير تدريب التمريض في مدينة شتوتغارت؟»
                  </p>
                </div>

                {/* AI Darija Clarification Bubble */}
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>تفسير فوري بالدارجة المغربية:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    «باش تقولها بطريقة احترافية للأستاذ ولا في مقابلة الفيزا، استعمل الفعل <span className="text-amber-300 font-bold">machen</span> ولا <span className="text-amber-300 font-bold">absolvieren</span>:
                    <br />
                    <span className="text-emerald-300 font-bold text-sm block my-1">
                      „Ich möchte eine Ausbildung als Krankenpfleger in Stuttgart machen.“
                    </span>
                    لاحظ أن كلمة Ausbildung مؤنثة (die)، داكشي علاش استعملنا <span className="underline">eine</span> في حالة Akkusativ!»
                  </p>
                </div>
              </div>

              {/* Right Column: Daily Path Preview Card */}
              <div className="lg:col-span-5 bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>مسار DaF kompakt neu A1</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    نظام الفتح اليومي 🔒
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-[11px]">
                        ✓
                      </div>
                      <span className="font-bold text-white">Day 1: Guten Tag! (ص 8-9)</span>
                    </div>
                    <span className="font-bold text-emerald-400">100% ناجح</span>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[11px]">
                        2
                      </div>
                      <span className="font-bold text-amber-200">Day 2: Sprachen & Verben (ص 10-11)</span>
                    </div>
                    <span className="font-bold text-amber-400">متاح دابا 🔥</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs opacity-60">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-400">Day 3: Buchstaben & Zahlen (ص 12-13)</span>
                    </div>
                    <span className="text-[10px] text-slate-500">مقفل (خاص 80% في Day 2)</span>
                  </div>
                </div>

                <button
                  onClick={onEnterApp}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>جرب اليوم الأول الآن فابور</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. CORE SAAS FEATURES (POURQUOI CETTE PLATEFORME ?)            */}
      {/* ============================================================== */}
      <section id="features" className="py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              المميزات الحصرية لطلاب المغرب
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              علاش هاد المنصة هي الحل الأفضل للنجاح في غوته وتأشيرة ألمانيا؟
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              تم تصميم كل خاصية في المنصة لمعالجة الصعوبات الحقيقية التي يواجهها المغاربة عند تعلم الألمانية والاستعداد للامتحانات الرسمية.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">محادثة صوتية حية 24/7 (Live Audio)</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                تخلص نهائياً من «حشمة الهضرة» والخوف من الخطأ. تدرب بالصوت مع الذكاء الاصطناعي بنبرة ألمانية ناطقة أصيلة يصحح مخارج الحروف وقواعدك بدون ملل.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">منهج DaF kompakt neu صفحة بصفحة</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                الكتاب المعتمد في معاهد غوته والمراكز الألمانية بالمغرب، مقسم إلى 24 يوماً دراسياً منظماً (صفحتين كل يوم)، مع اختبار يومي مشروط يضمن استيعابك الكامل.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">زر «شرح ليا بالدارجة» الحصري</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                ما فهمتيش قاعدة النحو المعقدة ولا تصريف الفعل؟ قول للأستاذ بصوتك «شرح ليا بالدارجة» وغادي يشرحها ليك بأمثلة من الواقع المغربي في ثوانٍ.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">محاكاة امتحان معهد غوته (Goethe Prüfung)</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                تدريب مطابق لاختبار الشفوي في غوته الرباط والدار البيضاء (بطاقات الكلمات، الأسئلة، والطلبات Bitte / Frage) لاكتساب الثقة ونيل علامة مرتفعة.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">التحضير لعقود Ausbildung والمقابلات</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                مواضيع محادثة موجهة خصيصاً لمترشحي التمريض، الفندقة، الميكانيك، والمعلوميات للتحضير لمقابلات العمل مع المشغلين الألمان والسفارة بالرباط.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">اشتغال فوري على الهاتف والحاسوب</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                لا تحتاج لتثبيت برامج معقدة. افتح المنصة من المتصفح في هاتفك (Safari / Chrome) أو حاسوبك وابدأ التحدث فوراً في أي وقت وأي مكان.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. CURRICULUM ROADMAP (A1 • A2 • B1)                            */}
      {/* ============================================================== */}
      <section id="curriculum" className="py-20 border-b border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              المسار التعليمي المنظم
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              من الصفر حتى الحصول على شهادة B1 وعقد العمل
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              خطة دراسية واضحة خطوة بخطوة متوافقة مع الإطار الأوروبي المشترك للغات (CEFR).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Level A1 */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/40 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 bg-emerald-500 text-slate-950 font-black text-[11px] px-3 py-1 rounded-br-xl">
                المسار المبرمج متاح
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black">
                A1
              </div>
              <h3 className="text-lg font-black text-white">مستوى A1: الانطلاقة الأساسية</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                تقديم النفس، التعارف، طلب الأكل في المطعم، التسوق، أفراد العائلة، والأرقام والساعة.
              </p>
              <div className="space-y-2 border-t border-slate-800 pt-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>امتحان Goethe-Zertifikat Start Deutsch 1</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>كتاب DaF kompakt neu A1 كامل (24 يوماً)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>مطلوب لفيزا التجمع العائلي (Ehegattennachzug)</span>
                </div>
              </div>
            </div>

            {/* Level A2 */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-sky-500/40 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-black">
                A2
              </div>
              <h3 className="text-lg font-black text-white">مستوى A2: التواصل اليومي المستقل</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                وصف أحداث الماضي، مواعيد الأطباء، السكن وكراء الشقق، السفر بالقطار، ووصف الروتين اليومي في العمل.
              </p>
              <div className="space-y-2 border-t border-slate-800 pt-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>امتحان Goethe-Zertifikat A2</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>حوارات وسيناريوهات تفاعلية مخصصة</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>خطوة أساسية قبل الانتقال لمستوى B1</span>
                </div>
              </div>
            </div>

            {/* Level B1 */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/50 space-y-4 relative">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black">
                B1
              </div>
              <h3 className="text-lg font-black text-white">مستوى B1: التأشيرة والتكوين المهني</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                التعبير عن الرأي، مناقشة الإيجابيات والسلبيات، المقابلات المهنية، ومواضيع العرض الشفهي (Präsentation).
              </p>
              <div className="space-y-2 border-t border-slate-800 pt-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>امتحان Goethe / telc B1 للفيزا</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>المستوى المطلوب رسمياً لعقود Ausbildung</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>فيزا بطاقة الفرص (Chancenkarte)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. SAAS PRICING PLANS IN MOROCCAN DIRHAMS (MAD)                */}
      {/* ============================================================== */}
      <section id="pricing" className="py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              باقات الاشتراك بالدرهم المغربي (MAD)
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              استثمر في مستقبلك بأثمنة مناسبة لكل طالب مغربي
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              أقل بكثير من تكلفة الساعات الخصوصية (Les cours de soutien) مع تدريب شفهي مستمر 24/7.
            </p>

            {/* Toggle Monthly vs Quarterly */}
            <div className="pt-2 flex items-center justify-center gap-2">
              <div className="bg-slate-900 p-1 rounded-2xl border border-slate-800 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    billingCycle === 'monthly'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  اشتراك شهري
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('quarterly')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    billingCycle === 'quarterly'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>عرض 3 أشهر (للتحضير للامتحان)</span>
                  <span className="bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded text-[10px] font-black">
                    توفير 35%
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
            {/* Plan 1: Free Tier */}
            <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-white">الباقة المجانية</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                    Essai Gratuit
                  </span>
                </div>
                <p className="text-xs text-slate-400">لتجربة المحادثة الصوتية واستكشاف المنهج والدروس الأولى.</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">0</span>
                  <span className="text-sm font-bold text-slate-400">درهم مغربي (MAD)</span>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>تصفح Day 1 من كتاب DaF kompakt neu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>محادثات صوتية تجريبية يومية</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>تجربة زر «شرح ليا بالدارجة»</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <span>✕ باقي أيام الكتاب مقفلة</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => openAuthModal(user ? 'account' : 'signup', 'free')}
                className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all cursor-pointer"
              >
                {user && profile?.plan === 'free'
                  ? 'باقتك المجانية مفعلة حالياً ✓'
                  : 'سجل بـ Gmail وابدأ مجاناً الآن'}
              </button>
            </div>

            {/* Plan 2: Goethe Student Pass (Most Popular) */}
            <div className="p-7 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500 flex flex-col justify-between space-y-6 relative shadow-xl shadow-amber-500/10">
              <div className="absolute -top-3.5 right-6 bg-amber-500 text-slate-950 font-black text-[11px] px-3 py-0.5 rounded-full shadow-sm">
                الأكثر اختياراً للمترشحين لغوته 🔥
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-white">باقة طالب غوته</h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                    Goethe Pass
                  </span>
                </div>
                <p className="text-xs text-slate-400">للاستعداد الكامل لاجتياز امتحانات A1 أو A2 بمعدل مرتفع.</p>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-amber-400">
                    {platformSettings.freeModeEnabled
                      ? '0'
                      : billingCycle === 'monthly'
                      ? platformSettings.symbolicPriceMad
                      : Math.round(platformSettings.symbolicPriceMad * 2.2)}
                  </span>
                  <span className="text-sm font-bold text-slate-400">
                    درهم MAD{' '}
                    {platformSettings.freeModeEnabled
                      ? '(مفتوحة مجاناً للتجربة حالياً 🎉)'
                      : billingCycle === 'quarterly'
                      ? '/ 3 أشهر كاملة'
                      : '/ شهر'}
                  </span>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-bold text-white">فتح جميع أيام ومنهج كتاب DaF kompakt كامل</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>محادثة صوتية غير محدودة مع تصحيح النطق اللحظي</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>خاصية «شرح ليا بالدارجة» مفتوحة بلا قيود</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>اختبارات يومية تفتح الدروس بنظام 80%+</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>تدريب مكثف على بطاقات امتحان الشفوي (Goethe Sprechen)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => openAuthModal(user ? 'account' : 'signup', 'goethe_pass')}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-sm shadow-md transition-all cursor-pointer"
              >
                {user && profile?.plan === 'goethe_pass'
                  ? 'باقة طالب غوته مفعلة في حسابك ✓'
                  : 'اشترك بـ Gmail وفعل الباقة الآن'}
              </button>
            </div>

            {/* Plan 3: Ausbildung & B1 Pro */}
            <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-white">باقة الأوسبيلدونغ والفيزا</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                    Ausbildung & B1 Pro
                  </span>
                </div>
                <p className="text-xs text-slate-400">للراغبين في عقود التكوين المهني ومقابلات المشغلين والسفارة.</p>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">
                    {platformSettings.freeModeEnabled ? '0' : platformSettings.proPriceMad}
                  </span>
                  <span className="text-sm font-bold text-slate-400">
                    درهم MAD{' '}
                    {platformSettings.freeModeEnabled
                      ? '(مفتوحة مجاناً للتجربة حالياً 🎉)'
                      : '/ لـ 6 أشهر'}
                  </span>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="font-bold text-white">كل مميزات باقة طالب غوته</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>تدريب مقابلات العمل مع الشركات والمستشفيات الألمانية</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>محاكاة أسئلة مقابلة السفارة الألمانية بالرباط</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>مكتبة نماذج السيرة الذاتية ورسالة التحفيز (Anschreiben)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>دعم تقني وتعليمي خاص عبر الواتساب المغربي</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => openAuthModal(user ? 'account' : 'signup', 'ausbildung_pro')}
                className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all cursor-pointer"
              >
                {user && profile?.plan === 'ausbildung_pro'
                  ? 'باقة الأوسبيلدونغ مفعلة في حسابك ✓'
                  : 'سجل بـ Gmail وانضم لباقة المحترفين'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. MOROCCAN STUDENT TESTIMONIALS (SOCIAL PROOF)                */}
      {/* ============================================================== */}
      <section id="testimonials" className="py-20 border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              شهادات وتجارب المغاربة
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              قصص نجاح شباب وممرضين مغاربة حققوا هدفهم
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              من الدار البيضاء، الرباط، طنجة، فاس، مراكش، وأكادير إلى ألمانيا.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                «كنت كنلقى مشكل كبير في قسم Sprechen في معهد غوته بالرباط، ديما كنتوثر. المنصة خلاتني نهضر كل نهار مع الـ KI ونسمع نطق صحيح. في الأخير جبت 89/100 في امتحان A1!»
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">أمين بنجلون</div>
                  <div className="text-[11px] text-slate-400">الرباط • طالب جامعي</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  Goethe A1 ناجح
                </span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                «عقد الأوسبيلدونغ ديالي في التمريض (Krankenpflege) في شتوتغارت كان كيتطلب مستوى B1 قوي. ميزة الشرح بالدارجة سهلات عليا القواعد لي كانت كتجيني معقدة في السوايع.»
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">سارة المرابط</div>
                  <div className="text-[11px] text-slate-400">الدار البيضاء • ممرضة متدربة</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  عقد Ausbildung في ألمانيا
                </span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                «كتاب DaF kompakt neu كان قاصح عليا نقراه بوحدي. ولكن ملي لقيتو هنا مقسم صفحة بصفحة مع اختبار 80% عاد يدوزك لليوم الموالي، ولات عندي خطة واضحة وممتعة بزاف.»
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">ياسين شريف</div>
                  <div className="text-[11px] text-slate-400">طنجة • تقني كهرباء</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">
                  مستوى A2 منجز
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. SEO MOROCCAN FAQ SECTION                                    */}
      {/* ============================================================== */}
      <section id="faq" className="py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              الأسئلة الشائعة في المغرب (FAQ)
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              كل ما تحتاج معرفته عن المنصة وامتحانات الألمانية
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'كيفاش كتساعدني هاد المنصة باش ننجح في امتحان Goethe-Zertifikat A1 أو B1 في المغرب؟',
                a: 'المنصة مبنية على المنهج المعتمد رسمياً في معاهد غوته بالمغرب (كتاب DaF kompakt neu). كتدربك بالصوت الحي على قسم التحدث (Mündliche Prüfung) وهو القسم لي كيخاف منو أغلب المترشحين، وكتعطيك تصحيح مباشر للأخطاء النحوية ونطق الحروف الصعبة (بحال ch, ö, ü, r).',
              },
              {
                q: 'واش نقدر نستعمل الدارجة المغربية إلى ما فهمتش شي حاجة؟',
                a: 'نعم بالتأكيد! هادي ميزة فريدة وحصرية عندنا. في أي وقت أثناء المحادثة، كتقدر تقول للأستاذ: «شرح ليا بالدارجة»، وغادي يشرح ليك القاعدة ولا الكلمة ولا تصريف الفعل بالدارجة المغربية المبسطة مع أمثلة قريبة ليك.',
              },
              {
                q: 'واش المنصة كتنفع للناس لي باغين يديرو Ausbildung أو التمريض في ألمانيا؟',
                a: 'نعم، المنصة فيها أقسام خاصة بالمصطلحات المهنية، ومحاكاة مقابلات العمل مع المشغلين الألمان، والأسئلة الشائعة لي كيطرحوها في السفارة الألمانية بالرباط (Deutsche Botschaft Rabat) عند طلب التأشيرة.',
              },
              {
                q: 'شنو هو نظام الفتح اليومي للدروس (Lektionen 🔒)؟',
                a: 'باش تضمن أنك ضابط كل درس مزيان وما كدوزش عشوائياً، كل يوم مبرمج يحتوي على صفحتين من كتاب DaF kompakt neu. باش يتفتح ليك اليوم الموالي، خاصك تدوز الاختبار اليومي (Daily Test) وتجيب فيه 80% على الأقل.',
              },
              {
                q: 'واش كاين نسخة مجانية نقدر نجربها دابا؟',
                a: 'نعم! تقدر تبدا دابا فابور وبلا ما تدخل أي بطاقة بنكية. جرب محادثات الصوت وتصفح اليوم الأول كامل مع الاختبار ديالو من خلال زر «دخول للمنصة التعليمية».',
              },
            ].map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-right font-bold text-sm sm:text-base text-white hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-amber-400 shrink-0 mr-3" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. FINAL CONVERSION BANNER                                     */}
      {/* ============================================================== */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight">
            واش مستعد تدوز امتحان غوته ولا تبدا رحلة الأوسبيلدونغ في ألمانيا؟
          </h2>
          <p className="text-sm sm:text-lg font-bold text-slate-900/90 max-w-2xl mx-auto">
            انضم لأكثر من 1,400 طالب ومترشح مغربي كيتدربو كل نهار بالصوت. جرب المنصة دابا فابور وبدا تهضر بالألمانية من أول دقيقة!
          </p>
          <div className="pt-2">
            <button
              onClick={onEnterApp}
              className="px-8 sm:px-10 py-4 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-black text-base shadow-2xl active:scale-95 transition-all inline-flex items-center gap-3 cursor-pointer"
            >
              <Mic className="w-5 h-5 text-amber-400" />
              <span>ادخل للمنصة وابدأ التحدث الآن</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 9. PROFESSIONAL SAAS FOOTER (WITH COPYRIGHT & MOROCCO CITIES) */}
      {/* ============================================================== */}
      <footer className="w-full bg-slate-950 border-t border-slate-800 pt-12 pb-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Col */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <Mic className="w-4 h-4" />
                </div>
                <span className="text-base font-black text-white">Deutsch Sprechen &bull; Morocco</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                المنصة الذكية الأولى في المغرب لتعلم والتحدث بالألمانية بالذكاء الاصطناعي (Gemini Live API) ومرافقة كتاب DaF kompakt neu للتحضير لامتحانات معهد غوته وعقود الأوسبيلدونغ.
              </p>
              <div className="text-[11px] text-slate-500 pt-1">
                خدمة موجهة لطلاب ومترشحي: الدار البيضاء • الرباط • طنجة • مراكش • فاس • أكادير • وجدة وكل مدن المغرب.
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white">أقسام المنصة</h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button
                    onClick={() => {
                      onSelectMode('book_course');
                      onEnterApp();
                    }}
                    className="hover:text-amber-400 transition-colors text-right cursor-pointer"
                  >
                    مسار كتاب DaF kompakt neu (A1)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      onSelectMode('dialogue_practice');
                      onEnterApp();
                    }}
                    className="hover:text-amber-400 transition-colors text-right cursor-pointer"
                  >
                    حوارات وسيناريوهات (Dialoge)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      onSelectMode('topic_discussion');
                      onEnterApp();
                    }}
                    className="hover:text-amber-400 transition-colors text-right cursor-pointer"
                  >
                    مواضيع امتحانات غوته (Themen A1-B1)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      onSelectMode('listening_stories');
                      onEnterApp();
                    }}
                    className="hover:text-amber-400 transition-colors text-right cursor-pointer"
                  >
                    الاستماع والقصص الصوتية (Hören)
                  </button>
                </li>
              </ul>
            </div>

            {/* Exam & Visa Links */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white">التحضير للامتحانات والفيزا</h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>Goethe-Zertifikat A1 (Start Deutsch 1)</li>
                <li>Goethe-Zertifikat A2 & B1</li>
                <li>عقود التكوين المهني Ausbildung</li>
                <li>فيزا البحث عن عمل (Chancenkarte)</li>
                <li>مقابلة السفارة الألمانية بالرباط</li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
            <div className="text-slate-400">
              <span>&copy; 2026 </span>
              <span className="font-bold text-white">Ayoub Id Bougren</span>
              <span> &bull; Deutsch Sprachtrainer A1 &bull; A2 &bull; B1 &bull; جميع الحقوق محفوظة</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              <span>Google AI Studio &bull; Gemini Live API</span>
              <span>🇲🇦 صنع بكل فخر للمغاربة</span>
              {onOpenAdmin && (
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="text-slate-600 hover:text-amber-400 font-mono transition-colors cursor-pointer"
                >
                  /admin
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
