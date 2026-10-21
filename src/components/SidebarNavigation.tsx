import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  FileText,
  Headphones,
  MessageSquare,
  Sparkles,
  Layers,
  GraduationCap,
  HelpCircle,
  Library,
  Menu,
  X,
  ChevronDown,
  Check,
  Home,
  ArrowRight,
  LogIn,
  Cloud,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppMode, GermanLevel } from '../types';
import { useAuth } from '../context/AuthContext';

interface SidebarNavigationProps {
  appMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  isActive: boolean;
  selectedLevel: GermanLevel;
  onSelectLevel: (lvl: GermanLevel) => void;
  bookTitle?: string;
  onGoToLanding?: () => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  appMode,
  onSelectMode,
  isActive,
  selectedLevel,
  onSelectLevel,
  bookTitle = 'DaF kompakt neu A1',
  onGoToLanding,
}) => {
  const { user, profile, openAuthModal } = useAuth();
  // 1. Lehrbuch-Pfad (مسار الكتاب المنهجي المستقل)
  const bookItems = [
    {
      id: 'book_course' as AppMode,
      titleDe: bookTitle,
      titleAr: 'مسار الكتاب المنهجي (صفحة بصفحة)',
      icon: GraduationCap,
      iconColor: 'text-amber-600',
      activeBg: 'bg-amber-50 border-amber-300 text-amber-950',
      activeIndicator: 'bg-amber-500',
      badge: 'Lehrbuch 🇩🇪',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200 font-bold',
      descDe: 'Täglicher Lernpfad, Buchübungen & KI-Tutor',
      descAr: 'مسار يومي صفحة بصفحة، تمارين وشرح بالدارجة',
    },
  ];

  // 2. Trainingsbereiche / Modi (أقسام التدريب والمحادثة العامة)
  const trainingItems = [
    {
      id: 'dialogue_practice' as AppMode,
      titleDe: 'Dialogtraining',
      titleAr: 'تدريب الحوارات والنطق',
      icon: BookOpen,
      iconColor: 'text-amber-500',
      activeBg: 'bg-amber-50 border-amber-300 text-amber-950',
      activeIndicator: 'bg-amber-500',
      badge: 'Interaktiv',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
      descDe: 'Rollenspiele, Sprechpraxis & Korrektur',
      descAr: 'لعب الأدوار، النطق والتصحيح الفوري',
    },
    {
      id: 'topic_discussion' as AppMode,
      titleDe: 'Themen & Prüfung',
      titleAr: 'المواضيع وامتحانات غوته',
      icon: FileText,
      iconColor: 'text-blue-500',
      activeBg: 'bg-blue-50 border-blue-300 text-blue-950',
      activeIndicator: 'bg-blue-500',
      badge: 'A1–B1',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      descDe: 'Alltagsthemen & Goethe-Vorbereitung',
      descAr: 'مواضيع يومية وامتحانات معهد غوته',
    },
    {
      id: 'listening_stories' as AppMode,
      titleDe: 'Hören & Geschichten',
      titleAr: 'الاستماع والفهم والقصص',
      icon: Headphones,
      iconColor: 'text-indigo-500',
      activeBg: 'bg-indigo-50 border-indigo-300 text-indigo-950',
      activeIndicator: 'bg-indigo-500',
      badge: 'Audio KI',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200 animate-pulse',
      descDe: 'Authentische Audio-Texte & Fragen',
      descAr: 'نصوص وقصص بنطق ألماني وأسئلة فهم',
    },
    {
      id: 'free_conversation' as AppMode,
      titleDe: 'Buch-Lektionstutor',
      titleAr: 'محادثة الدروس المحددة',
      icon: MessageSquare,
      iconColor: 'text-emerald-500',
      activeBg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
      activeIndicator: 'bg-emerald-500',
      badge: 'Lektion 1-30',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200 font-bold',
      descDe: 'Gezielte Konversation zu jeder Lektion',
      descAr: 'محادثة مقيدة بـ Lektion دون تجاوز مستواك',
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Close mobile menu on Escape key press and manage body overflow
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const allItems = [...bookItems, ...trainingItems];
  const activeItem = allItems.find((item) => item.id === appMode) || bookItems[0];
  const ActiveIcon = activeItem.icon;

  return (
    <>
      {/* ============================================================== */}
      {/* DESKTOP SIDEBAR (ON THE LEFT SIDE)                            */}
      {/* ============================================================== */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 space-y-4 sticky top-20">
        {/* بطاقة حساب الطالب ومزامنة Gmail السحابية */}
        {!user ? (
          <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-amber-200/90 p-3 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-950 flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5 text-amber-600" />
                <span>حفظ الدروس عبر Gmail</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-200/70 text-amber-950 font-bold">
                مجاناً
              </span>
            </div>
            <p className="text-[10px] text-slate-600 leading-relaxed">
              سجل الدخول بحساب Google لحفظ تقدمك في الكتاب والامتحانات على السحابة.
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                className="py-1.5 px-2 rounded-xl bg-white hover:bg-slate-50 border border-amber-300 text-slate-900 font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-all"
              >
                <LogIn className="w-3 h-3 text-amber-600" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => openAuthModal('signup', 'goethe_pass')}
                className="py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-all"
              >
                <span>Sign Up</span>
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => openAuthModal('account')}
            className="w-full bg-emerald-50/70 hover:bg-emerald-50 rounded-2xl border border-emerald-200/90 p-3 shadow-xs flex items-center justify-between gap-2 text-left cursor-pointer transition-all"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={profile?.displayName || 'User'}
                  className="w-8 h-8 rounded-xl object-cover border border-emerald-400 shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 font-black text-xs flex items-center justify-center shrink-0">
                  {(profile?.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {profile?.displayName || user.displayName}
                </div>
                <div className="text-[10px] text-emerald-700 font-medium truncate">
                  مزامنة سحابية نشطة ({profile?.completedDaysCount ?? 0}/24 يوماً)
                </div>
              </div>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-mono shrink-0">
              {profile?.plan === 'ausbildung_pro'
                ? 'PRO 🇩🇪'
                : profile?.plan === 'goethe_pass'
                ? 'Goethe 🔥'
                : 'Free'}
            </span>
          </button>
        )}

        {/* 1. Lehrbuch-Pfad (قسم مسار الكتاب المنهجي المستقل) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-xs">
          <div className="flex items-center justify-between px-2 py-2 mb-1 border-b border-slate-100 text-slate-800">
            <div className="flex items-center gap-2">
              <Library className="w-4 h-4 text-amber-600" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                  Lehrwerk &amp; Kursbuch
                </span>
                <span className="text-[10px] text-slate-400 font-normal block">
                  مسار الكتاب المنهجي صفحة بصفحة
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100/80 text-amber-900 border border-amber-200/70 font-mono">
              A1 Kurs
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            {bookItems.map((item) => {
              const Icon = item.icon;
              const isSelected = appMode === item.id;

              return (
                <button
                  key={item.id}
                  id={`sidebar-tab-${item.id}`}
                  type="button"
                  disabled={isActive}
                  onClick={() => onSelectMode(item.id)}
                  className={`w-full relative text-left rounded-xl p-3 border transition-all cursor-pointer flex flex-col gap-1 ${
                    isSelected
                      ? `${item.activeBg} shadow-2xs font-semibold`
                      : 'bg-slate-50/60 border-transparent hover:bg-slate-100/80 hover:border-slate-200 text-slate-700'
                  } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={isActive ? 'Stoppe zuerst das Gespräch' : item.titleDe}
                >
                  {/* Active vertical accent pill on the side */}
                  {isSelected && (
                    <span
                      className={`absolute left-1 top-2.5 bottom-2.5 w-1 rounded-full ${item.activeIndicator}`}
                    />
                  )}

                  <div className="flex items-center justify-between gap-2 pl-1.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`p-1.5 rounded-lg shrink-0 ${
                          isSelected ? 'bg-white shadow-2xs' : 'bg-white/80'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${item.iconColor}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {item.titleDe}
                        </div>
                        <div className="text-[10px] text-slate-500 font-normal truncate">
                          {item.titleAr}
                        </div>
                      </div>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border shrink-0 ${
                          item.badgeColor || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600 leading-tight pl-2 pt-0.5">
                    {item.descDe}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight pl-2">
                    {item.descAr}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Trainingsbereiche / Modi (أقسام التدريب والمحادثة العامة) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-xs">
          <div className="flex items-center gap-2 px-2 py-2 mb-1 border-b border-slate-100 text-slate-800">
            <Layers className="w-4 h-4 text-slate-600" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                Trainingsbereiche / Modi
              </span>
              <span className="text-[10px] text-slate-400 font-normal block">
                أقسام التدريب والمحادثة الشفوية
              </span>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            {trainingItems.map((item) => {
              const Icon = item.icon;
              const isSelected = appMode === item.id;

              return (
                <button
                  key={item.id}
                  id={`sidebar-tab-${item.id}`}
                  type="button"
                  disabled={isActive}
                  onClick={() => onSelectMode(item.id)}
                  className={`w-full relative text-left rounded-xl p-3 border transition-all cursor-pointer flex flex-col gap-1 ${
                    isSelected
                      ? `${item.activeBg} shadow-2xs font-semibold`
                      : 'bg-slate-50/60 border-transparent hover:bg-slate-100/80 hover:border-slate-200 text-slate-700'
                  } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={isActive ? 'Stoppe zuerst das Gespräch' : item.titleDe}
                >
                  {/* Active vertical accent pill on the side */}
                  {isSelected && (
                    <span
                      className={`absolute left-1 top-2.5 bottom-2.5 w-1 rounded-full ${item.activeIndicator}`}
                    />
                  )}

                  <div className="flex items-center justify-between gap-2 pl-1.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`p-1.5 rounded-lg shrink-0 ${
                          isSelected ? 'bg-white shadow-2xs' : 'bg-white/80'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${item.iconColor}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {item.titleDe}
                        </div>
                        <div className="text-[10px] text-slate-500 font-normal truncate">
                          {item.titleAr}
                        </div>
                      </div>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border shrink-0 ${
                          item.badgeColor || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600 leading-tight pl-2 pt-0.5">
                    {item.descDe}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight pl-2">
                    {item.descAr}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Sprachniveau wählen / Level Selector */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between text-xs px-1">
            <div>
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                <span>Sprachniveau</span>
              </span>
              <span className="text-[10px] text-slate-400 block font-normal">
                تحديد المستوى الحالي
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">GER / CEFR</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {(['A1', 'A2', 'B1'] as GermanLevel[]).map((lvl) => {
              const isLvlSelected = selectedLevel === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  disabled={isActive}
                  onClick={() => onSelectLevel(lvl)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                    isLvlSelected
                      ? lvl === 'A1'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : lvl === 'A2'
                        ? 'bg-sky-600 text-white shadow-2xs'
                        : 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-600 leading-relaxed px-1">
            {selectedLevel === 'A1' && (
              <>
                <div className="font-semibold text-slate-800">A1: Anfänger / Grundstufe</div>
                <div className="text-[10px] text-slate-400">جمل بسيطة، كلمات يومية ونطق واضح وهادئ.</div>
              </>
            )}
            {selectedLevel === 'A2' && (
              <>
                <div className="font-semibold text-slate-800">A2: Grundlegende Kenntnisse</div>
                <div className="text-[10px] text-slate-400">حوارات روتينية، ربط الجمل ومحادثة عملية.</div>
              </>
            )}
            {selectedLevel === 'B1' && (
              <>
                <div className="font-semibold text-slate-800">B1: Selbstständige Sprachverwendung</div>
                <div className="text-[10px] text-slate-400">مناقشة الآراء والتجارب والاستعداد للامتحان.</div>
              </>
            )}
          </div>
        </div>

        {/* 4. Darija-Sprachhilfe / Moroccan Darija Live Help Tip */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-2xl border border-amber-200/90 p-3 text-xs text-amber-950 space-y-1.5 shadow-2xs text-left">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <div>
              <span className="block text-xs font-bold text-amber-950">Hilfe auf Darija</span>
              <span className="block text-[10px] text-amber-800 font-normal">مساعدة فورية بالدارجة أثناء الكلام</span>
            </div>
          </div>
          <p className="text-[11px] text-amber-900/90 leading-relaxed">
            Wenn du ein deutsches Wort nicht verstehst, sage einfach per Audio:
          </p>
          <div className="bg-white/90 border border-amber-200 rounded-lg px-2.5 py-1 text-center font-bold text-amber-900 text-xs shadow-2xs">
            « شرح ليا بالدارجة »
          </div>
          <p className="text-[10px] text-amber-800/90 leading-snug">
            غادي يشرحها ليك في الحين بالدارجة المغربية ويعاود يكمل بالألمانية.
          </p>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* MOBILE / TABLET COMPACT NAVIGATION BAR & POPUP DRAWER MENÜ    */}
      {/* ============================================================== */}
      <div className="lg:hidden w-full">
        {/* Sleek Mobile Trigger Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-2.5 sm:p-3 shadow-xs flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0 flex-1 text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-200/60 flex items-center justify-center shrink-0 text-amber-700">
              <ActiveIcon className="w-5 h-5 text-amber-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
                <span>Aktueller Modus:</span>
                {activeItem.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                      activeItem.badgeColor || 'bg-amber-100 text-amber-900 border border-amber-200'
                    }`}
                  >
                    {activeItem.badge}
                  </span>
                )}
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {activeItem.titleDe}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {activeItem.titleAr}
              </div>
            </div>
          </div>

          {/* Menu Button ("مينيت كليك عليه يتلقى كلشي") */}
          <button
            id="mobile-navigation-menu-toggle"
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <Menu className="w-4 h-4 text-amber-400" />
            <span>Menü / القائمة</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Modal / Drawer Menu: When clicked ("مينيت كليك عليه") */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4">
              {/* Dimmed Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer"
              />

              {/* Menu Sheet Card: Clean, organized, vertically stacked */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] z-10 text-left"
              >
                {/* Drawer Header */}
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-200/80 flex items-center justify-center text-amber-700">
                      <Layers className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                        Menü &amp; Lernbereiche
                      </h3>
                      <p className="text-[11px] text-slate-500">قائمة الأقسام ومسارات التعلم التفاعلية</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-9 h-9 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Menü schließen"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Drawer Body - Vertically Stacked ("شي حاجة تحت شي حاجة") */}
                <div className="p-4 overflow-y-auto space-y-4">
                  {/* 1. قسم مسار الكتاب المنهجي (Lehrbuch) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-1 text-[11px] font-bold text-amber-950">
                      <span className="flex items-center gap-1.5">
                        <Library className="w-3.5 h-3.5 text-amber-700" />
                        <span>Lehrwerk &amp; Kursbuch (مسار الكتاب المنهجي)</span>
                      </span>
                      <span className="text-[10px] font-mono text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded font-bold">
                        A1 Kurs
                      </span>
                    </div>

                    {bookItems.map((item) => {
                      const Icon = item.icon;
                      const isSelected = appMode === item.id;
                      return (
                        <button
                          key={item.id}
                          id={`mobile-menu-item-${item.id}`}
                          type="button"
                          disabled={isActive}
                          onClick={() => {
                            onSelectMode(item.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-left ${
                            isSelected
                              ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/20 shadow-xs'
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                          } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200/60'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-bold text-slate-900">{item.titleDe}</span>
                                {item.badge && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-200">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5">{item.titleAr}</div>
                              <p className="text-xs text-slate-600 mt-1 leading-snug">{item.descDe}</p>
                              <p className="text-[10px] text-slate-400 leading-snug">{item.descAr}</p>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* 2. أقسام التدريب والمحادثة (Modi) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-1 text-[11px] font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-slate-600" />
                        <span>Trainingsbereiche (أقسام التدريب والمحادثة)</span>
                      </span>
                    </div>

                    <div className="space-y-2">
                      {trainingItems.map((item) => {
                        const Icon = item.icon;
                        const isSelected = appMode === item.id;
                        return (
                          <button
                            key={item.id}
                            id={`mobile-menu-item-${item.id}`}
                            type="button"
                            disabled={isActive}
                            onClick={() => {
                              onSelectMode(item.id);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`w-full p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-left ${
                              isSelected
                                ? `${item.activeBg} ring-2 ring-slate-400/20 shadow-xs`
                                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                            } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                                  isSelected ? 'bg-white shadow-xs' : 'bg-slate-100'
                                }`}
                              >
                                <Icon className={`w-5 h-5 ${item.iconColor}`} />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm font-bold text-slate-900">{item.titleDe}</span>
                                  {item.badge && (
                                    <span
                                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                                        item.badgeColor || 'bg-slate-100 text-slate-800'
                                      }`}
                                    >
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-0.5">{item.titleAr}</div>
                                <p className="text-xs text-slate-600 mt-1 leading-snug">{item.descDe}</p>
                                <p className="text-[10px] text-slate-400 leading-snug">{item.descAr}</p>
                              </div>
                            </div>

                            {isSelected && (
                              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. تحديد المستوى الحالي (Niveau) */}
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs px-1">
                      <span className="font-bold text-slate-700 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Sprachniveau wählen (تحديد المستوى)</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">GER / CEFR</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {(['A1', 'A2', 'B1'] as GermanLevel[]).map((lvl) => {
                        const isLvlSelected = selectedLevel === lvl;
                        return (
                          <button
                            key={lvl}
                            type="button"
                            disabled={isActive}
                            onClick={() => onSelectLevel(lvl)}
                            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                              isLvlSelected
                                ? lvl === 'A1'
                                  ? 'bg-emerald-600 text-white shadow-2xs'
                                  : lvl === 'A2'
                                  ? 'bg-sky-600 text-white shadow-2xs'
                                  : 'bg-indigo-600 text-white shadow-2xs'
                                : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                            } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {lvl}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. تلميح الدارجة المغربية */}
                  <div className="bg-amber-50 rounded-2xl border border-amber-200 p-3 text-xs text-amber-950 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Hilfe auf Darija (مساعدة بالدارجة أثناء المحادثة):</span>
                    </div>
                    <p className="text-[11px] text-amber-900/90 leading-relaxed">
                      Wenn du ein deutsches Wort nicht verstehst, sage einfach per Audio:{' '}
                      <span className="font-bold bg-white px-1.5 py-0.5 rounded border border-amber-300">
                        « شرح ليا بالدارجة »
                      </span>
                    </p>
                    <p className="text-[10px] text-amber-800/90">
                      غادي يشرحها ليك في الحين بالدارجة المغربية ويعاود يكمل بالألمانية.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
