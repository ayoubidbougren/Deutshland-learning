import React, { useState } from 'react';
import {
  BookOpen,
  Play,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  Layers,
  FileText,
  Clock,
  ArrowRight,
  Lock,
  X,
} from 'lucide-react';
import { CourseBook, UserCourseProgress } from '../../types/bookCourse';
import { calculateOverallProgress, getWeakAreas, isDayUnlocked } from '../../utils/bookStorage';

interface BookOverviewViewProps {
  book: CourseBook;
  progress: UserCourseProgress;
  onNavigateToDay: (dayNumber: number) => void;
  onSelectTab: (tab: any) => void;
}

export const BookOverviewView: React.FC<BookOverviewViewProps> = ({
  book,
  progress,
  onNavigateToDay,
  onSelectTab,
}) => {
  const overallPercent = calculateOverallProgress(book, progress);
  const weakAreas = getWeakAreas(progress);

  // Find active day
  let activeDayPlan = book.lessons
    .flatMap((l) => l.days)
    .find((d) => d.dayNumber === progress.currentDay);

  if (!activeDayPlan && book.lessons[0]?.days[0]) {
    activeDayPlan = book.lessons[0].days[0];
  }

  const completedCount = progress.completedDays.length;
  const totalDays = book.lessons.reduce((acc, l) => acc + l.days.length, 0);

  // State for showing the locked day modal
  const [lockedNoticeDay, setLockedNoticeDay] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Hero Continue Learning Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-amber-950 p-6 sm:p-8 text-white shadow-xl text-left">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold tracking-wide border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Offizieller Lehrplan • Täglicher Lernpfad</span>
              <span className="text-[10px] text-amber-200/70 font-normal">منهج الكتاب المعتمد • مسار التعلم الذكي</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-amber-400 shrink-0" />
              <span>{book.title}</span>
            </h2>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              Lerne Deutsch systematisch Seite für Seite mit deinem persönlichen KI-Sprachtrainer. Echte Buchübungen, adaptives Feedback, freies Sprechen, Schreibkorrektur und täglicher Test.
            </p>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              تعلم الألمانية صفحة بصفحة مع أستاذك الذكي. تمارين حقيقية من الكتاب، محادثة شفوية، تصحيح كتابي، واختبار يومي.
            </p>

            {/* Current day indicator */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs sm:text-sm text-slate-200">
              <span className="px-3 py-1 rounded-lg bg-white/10 font-semibold text-amber-300 border border-white/10">
                🇩🇪 Aktueller Tag: Day {progress.currentDay}
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 font-medium border border-white/10">
                {activeDayPlan
                  ? `Lektion ${activeDayPlan.lessonNumber} • Seiten ${activeDayPlan.pages.join('–')}`
                  : `Lektion 1 • Seiten 8–9`}
              </span>
              <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
                {completedCount} von {totalDays} Tagen abgeschlossen ({completedCount} أيام مكتملة)
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 min-w-[220px]">
            <button
              onClick={() => onNavigateToDay(progress.currentDay)}
              className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm sm:text-base shadow-lg hover:shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-left cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current shrink-0" />
              <div>
                <span className="block font-black">Lektion fortsetzen ▶</span>
                <span className="block text-[11px] font-normal opacity-90">
                  Tag {progress.currentDay} • {activeDayPlan?.sectionTitleDe || 'Lektion 1'}
                </span>
                <span className="block text-[10px] text-slate-900/80 font-normal">متابعة الدرس الحالي</span>
              </div>
            </button>

            <button
              onClick={() => onSelectTab('lessons')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-medium border border-white/10 transition-colors text-left cursor-pointer"
            >
              <Layers className="w-4 h-4 text-slate-300 shrink-0" />
              <div>
                <span className="block font-bold">Inhaltsverzeichnis &amp; Seiten</span>
                <span className="block text-[10px] text-slate-300">تصفح كل الدروس والصفحات</span>
              </div>
            </button>
          </div>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 text-xs font-medium">
            <span className="font-bold">Buchfortschritt</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-[10px] text-slate-400">نسبة إنجاز الكتاب</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{overallPercent}%</span>
            <span className="text-xs text-slate-400">Gesamt</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 text-xs font-medium">
            <span className="font-bold">Abgeschlossene Seiten</span>
            <FileText className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-[10px] text-slate-400">الصفحات المكتملة</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {progress.completedPages.length}
            </span>
            <span className="text-xs text-slate-400">von {book.totalPages}</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">Strukturierter Seitenplan (منهج بالصفحات)</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 text-xs font-medium">
            <span className="font-bold">Gelernter Wortschatz</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-[10px] text-slate-400">المفردات المكتسبة</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {Object.keys(progress.vocabularyBank).length}
            </span>
            <span className="text-xs text-slate-400">Wörter</span>
          </div>
          <p className="mt-2 text-[11px] text-emerald-600 font-medium">Im Kontext &amp; Darija (مع الشرح)</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 text-xs font-medium">
            <span className="font-bold">Erledigte Übungen</span>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-[10px] text-slate-400">التمارين المنجزة</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {Object.keys(progress.completedExercises).length}
            </span>
            <span className="text-xs text-slate-400">Übungen</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">Buch &amp; KI-Praxis (تمارين وتمارين ذكية)</p>
        </div>
      </div>

      {/* Adaptive Learning / Weak Areas Alert */}
      {weakAreas.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-950">
                Adaptives Lernen: Wiederholungsbedarf
              </h3>
              <p className="text-[11px] text-amber-800">التعلم التكيفي: نقاط تحتاج مراجعة إضافية</p>
              <p className="text-xs text-amber-900/90 mt-1">
                Der KI-Sprachtrainer hat Schwächen erkannt bei:{' '}
                <span className="font-semibold text-amber-950">
                  {weakAreas.map((w) => `${w.category} (${w.mistakes} Fehler)`).join(' • ')}
                </span>
                . Gezielte Übungen sind im täglichen Lernplan integriert.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectTab('exercises')}
            className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Gezielte Übungen</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Available Curriculum Days List */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Täglicher Lernpfad (Daily Curriculum)
            </h3>
            <p className="text-xs text-slate-500">
              Strukturiert nach dem Lehrbuch {book.title} (مرتب صفحة بصفحة وفقاً لفهرس الكتاب)
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {totalDays} Lerneinheiten / Tage ({totalDays} أيام)
          </span>
        </div>

        <div className="space-y-2.5">
          {book.lessons.flatMap((lesson) =>
            lesson.days.map((day) => {
              const isCompleted = progress.completedDays.includes(day.dayNumber);
              const isCurrent = progress.currentDay === day.dayNumber;
              const isUnlocked = isDayUnlocked(day.dayNumber, progress.completedDays);
              const testScore = progress.testScores[day.dayNumber];

              return (
                <div
                  key={`day-${day.dayNumber}`}
                  onClick={() => {
                    if (!isUnlocked) {
                      setLockedNoticeDay(day.dayNumber);
                    }
                  }}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all ${
                    !isUnlocked
                      ? 'border-dashed border-slate-300 bg-slate-100/70 opacity-60 backdrop-blur-xs cursor-not-allowed hover:border-slate-400 select-none'
                      : isCurrent
                      ? 'border-amber-400 bg-amber-50/40 shadow-xs'
                      : isCompleted
                      ? 'border-emerald-200 bg-emerald-50/20 hover:border-emerald-300 cursor-pointer'
                      : 'border-slate-200 bg-white hover:border-amber-300 cursor-pointer'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        !isUnlocked
                          ? 'bg-slate-200 text-slate-500'
                          : isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {!isUnlocked ? (
                        <Lock className="w-4 h-4 text-slate-500" />
                      ) : isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        `D${day.dayNumber}`
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-bold text-sm ${
                            !isUnlocked ? 'text-slate-500' : 'text-slate-900'
                          }`}
                        >
                          Tag {day.dayNumber}: {day.sectionTitleDe}
                        </span>
                        {!isUnlocked && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-600 inline-flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Gesperrt / مقفل
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                            Aktuell / أنت هنا
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {!isUnlocked ? (
                          <span className="text-slate-500">
                            🔒 Gesperrt: Schließe Tag {day.dayNumber - 1} ab und bestehe den Test (80%+). (خاصك تكمل اليوم السابق أولاً)
                          </span>
                        ) : (
                          <>
                            <span>Lektion {day.lessonNumber} • Seiten {day.pages.join('–')}</span>
                            <span className="text-slate-400 mx-1.5">•</span>
                            <span className="text-slate-500">{day.sectionTitleAr}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-3 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 justify-between sm:justify-end">
                    {testScore !== undefined && (
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                          testScore >= 80
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        Ergebnis: {testScore}%
                      </span>
                    )}

                    {isUnlocked ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToDay(day.dayNumber);
                        }}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isCurrent
                            ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <span>{isCompleted ? 'Wiederholen' : isCurrent ? 'Jetzt starten' : 'Ansehen'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLockedNoticeDay(day.dayNumber);
                        }}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-200 text-slate-500 hover:bg-slate-300 transition-colors flex items-center gap-1.5 cursor-not-allowed"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Gesperrt 🔒</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Locked Day Notice Modal */}
      {lockedNoticeDay !== null && (() => {
        const lockedDayPlan = book.lessons
          .flatMap((l) => l.days)
          .find((d) => d.dayNumber === lockedNoticeDay);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150 text-left">
            <div className="w-full max-w-lg rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block leading-tight">Dieser Tag ist noch gesperrt 🔒</span>
                    <span className="block text-[11px] text-slate-500 font-normal">هذا الدرس مقفل حالياً</span>
                  </div>
                </div>
                <button
                  onClick={() => setLockedNoticeDay(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                  aria-label="Schließen"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed overflow-y-auto pr-1 py-2 flex-1">
                <div>
                  <p className="font-semibold text-slate-900">
                    Du kannst <span className="text-amber-700 font-bold">Tag {lockedNoticeDay}</span> noch nicht starten.
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ما تقدرش تدخل لـ Day {lockedNoticeDay} دابا لأنك مازال ما كملتيش الدروس اللي قبلو.
                  </p>
                </div>

                {/* تفاصيل صفحات الدرس في الكتاب والموقع بالضبط */}
                {lockedDayPlan && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                        <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                        <span>Lektionsdetails im Lehrbuch ({book.title}):</span>
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                        Lektion {lockedDayPlan.lessonNumber}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-left">
                      {/* Seitenanzahl */}
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-semibold">Seitenanzahl:</span>
                        <span className="text-sm font-bold text-slate-900 block mt-0.5">
                          {lockedDayPlan.pages.length} {lockedDayPlan.pages.length === 1 ? 'Seite' : 'Seiten'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {lockedDayPlan.pages.length} {lockedDayPlan.pages.length === 2 ? 'صفحتين' : 'صفحات'}
                        </span>
                      </div>

                      {/* Exakte Buchseiten */}
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-semibold">Buchseiten:</span>
                        <span className="text-sm font-bold text-amber-700 block mt-0.5">
                          {lockedDayPlan.pages.length === 1
                            ? `Seite ${lockedDayPlan.pages[0]}`
                            : `Seiten ${lockedDayPlan.pages.join('–')}`}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          الصفحة {lockedDayPlan.pages.join(' و ')}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 bg-white/80 px-2.5 py-1.5 rounded-lg border border-slate-200/60">
                      <span className="font-bold text-slate-900 block">
                        {lockedDayPlan.sectionTitleDe}
                      </span>
                      <span className="text-slate-500 text-[10px] block">
                        {lockedDayPlan.sectionTitleAr}
                      </span>
                    </div>
                  </div>
                )}

                {/* قواعد هذا الدرس / Grammatik im Fokus */}
                {lockedDayPlan && (
                  <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-blue-200/60 pb-2">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>Grammatik im Fokus (قواعد هذا الدرس):</span>
                      </span>
                      {lockedDayPlan.grammar && lockedDayPlan.grammar.length > 0 ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                          {lockedDayPlan.grammar.length} {lockedDayPlan.grammar.length === 1 ? 'Regel' : 'Regeln'} ({lockedDayPlan.grammar.length} قواعد)
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400">لا توجد قواعد جديدة</span>
                      )}
                    </div>

                    {lockedDayPlan.grammar && lockedDayPlan.grammar.length > 0 ? (
                      <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                        {lockedDayPlan.grammar.map((g, idx) => (
                          <div
                            key={g.id || idx}
                            className="bg-white p-2.5 rounded-xl border border-blue-100/90 shadow-2xs space-y-1 hover:border-blue-300 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-bold text-slate-900 text-xs leading-snug">
                                {idx + 1}. {g.titleDe}
                              </span>
                              {g.pageNumber && (
                                <span className="text-[10px] font-mono text-slate-500 shrink-0 bg-slate-100 px-1.5 py-0.5 rounded font-semibold">
                                  S. {g.pageNumber}
                                </span>
                              )}
                            </div>
                            {g.titleAr && (
                              <p className="text-[11px] text-blue-900 font-medium leading-tight">
                                {g.titleAr}
                              </p>
                            )}
                            {(g.summaryAr || g.summaryDe) && (
                              <p className="text-[10px] text-slate-600 leading-relaxed bg-slate-50/80 p-1.5 rounded-lg border border-slate-100 mt-1">
                                {g.summaryAr || g.summaryDe}
                              </p>
                            )}
                            {g.telegramVideo && (
                              <div className="flex items-center gap-1.5 pt-0.5 text-[10px] text-blue-700 font-semibold">
                                <span>🎥 شرح فيديو مخصص:</span>
                                <span className="text-slate-600 font-normal truncate">
                                  {g.telegramVideo.lessonTitle}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white/80 p-2.5 rounded-lg border border-blue-100 text-[11px] text-slate-600">
                        <span>تركيز هذا اليوم منصب على النطق، المفردات، والمحادثات الشفهية والتمارين التطبيقية.</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Voraussetzung */}
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1 text-xs">
                  <p className="font-bold text-amber-900 flex items-center gap-1.5">
                    <span>💡 Freischaltbedingung:</span>
                  </p>
                  <p className="leading-relaxed">
                    Schließe <span className="font-bold">Tag {lockedNoticeDay - 1}</span> ab und bestehe den täglichen Abschlusstest mit mindestens <span className="font-bold text-amber-900">80%</span>.
                  </p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    خاصك تكمل Day {lockedNoticeDay - 1} وتدوز الاختبار اليومي وتجيب فيه 80%+ باش يتفتح ليك تلقائياً.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2 justify-end shrink-0">
                <button
                  onClick={() => setLockedNoticeDay(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  Verstanden (إغلاق)
                </button>
                <button
                  onClick={() => {
                    const targetDay = progress.currentDay;
                    setLockedNoticeDay(null);
                    onNavigateToDay(targetDay);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-transform"
                >
                  <span>Zu aktuellem Tag (Tag {progress.currentDay})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
