import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FileText,
  Sparkles,
  Lock,
  X,
  ArrowRight,
  Search,
  Check,
  Calendar,
  Layers,
} from 'lucide-react';
import { CourseBook, UserCourseProgress } from '../../types/bookCourse';
import { isDayUnlocked } from '../../utils/bookStorage';

interface LessonsBrowserViewProps {
  book: CourseBook;
  progress: UserCourseProgress;
  onSelectDay: (dayNumber: number) => void;
}

export const LessonsBrowserView: React.FC<LessonsBrowserViewProps> = ({
  book,
  progress,
  onSelectDay,
}) => {
  const [lockedNoticeDay, setLockedNoticeDay] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'unlocked' | 'completed'>('all');

  const filteredLessons = book.lessons
    .map((lesson) => {
      const q = searchQuery.toLowerCase().trim();

      const matchingDays = lesson.days.filter((day) => {
        const isCompleted = progress.completedDays.includes(day.dayNumber);
        const isUnlocked = isDayUnlocked(day.dayNumber, progress.completedDays);

        if (filterMode === 'completed' && !isCompleted) return false;
        if (filterMode === 'unlocked' && !isUnlocked) return false;

        if (!q) return true;

        return (
          day.sectionTitleDe.toLowerCase().includes(q) ||
          day.sectionTitleAr.toLowerCase().includes(q) ||
          day.lessonTitleDe.toLowerCase().includes(q) ||
          day.lessonTitleAr.toLowerCase().includes(q) ||
          `day ${day.dayNumber}`.includes(q) ||
          `d${day.dayNumber}`.includes(q) ||
          `lektion ${day.lessonNumber}`.includes(q)
        );
      });

      return {
        ...lesson,
        filteredDays: matchingDays,
      };
    })
    .filter((lesson) => lesson.filteredDays.length > 0 || !searchQuery.trim());

  const totalLessons = book.lessons.length;
  const totalDays = book.lessons.reduce((acc, l) => acc + l.days.length, 0);
  const completedDaysCount = progress.completedDays.length;

  return (
    <div className="space-y-6">
      {/* Header & Overview Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-800">
              <Layers className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              فهرس دروس ومنهاج الكتاب (Inhaltsverzeichnis)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            جميع وحدات ودروس كتاب {book.title} ({book.level}) مرتبة صفحة بصفحة
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 font-semibold text-slate-700">
            {totalLessons} وحدات (Lektionen)
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-100 font-bold text-amber-900">
            {completedDaysCount} / {totalDays} أيام مكتملة
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن وحدة، موضوع، أو رقم اليوم..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-slate-50/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'جميع الدروس' },
            { id: 'unlocked', label: 'المتاحة حالياً 🔓' },
            { id: 'completed', label: 'المكتملة ✓' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterMode(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterMode === tab.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-5">
        {filteredLessons.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-dashed border-slate-200 bg-white p-8">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">لا توجد دروس تطابق بحثك</p>
            <p className="text-xs text-slate-400 mt-1">جرب مسح كلمات البحث للعودة للفهرس الكامل</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterMode('all');
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
            >
              عرض جميع الدروس
            </button>
          </div>
        ) : (
          filteredLessons.map((lesson) => {
            const completedDaysInLesson = lesson.days.filter((d) =>
              progress.completedDays.includes(d.dayNumber)
            ).length;
            const isLessonComplete =
              completedDaysInLesson === lesson.days.length && lesson.days.length > 0;

            const startPage =
              lesson.kursbuchPages?.start ?? lesson.days[0]?.pages[0] ?? 1;
            const endPage =
              lesson.kursbuchPages?.end ??
              lesson.days[lesson.days.length - 1]?.pages.slice(-1)[0] ??
              1;

            return (
              <div
                key={lesson.lessonNumber}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:border-slate-300 transition-all"
              >
                {/* Lesson Header */}
                <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-slate-900 text-amber-400 font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
                      L{lesson.lessonNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-700">
                          Lektion {lesson.lessonNumber}
                        </span>
                        <span className="text-slate-300">•</span>
                        <h3 className="text-base font-black text-slate-900">
                          {lesson.titleDe}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{lesson.titleAr}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      Kursbuch Seiten {startPage}–{endPage}
                    </span>

                    {lesson.arbeitsbuchPages && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                        Übungsbuch {lesson.arbeitsbuchPages.start}–{lesson.arbeitsbuchPages.end}
                      </span>
                    )}

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                        isLessonComplete
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {isLessonComplete && <Check className="w-3.5 h-3.5" />}
                      <span>
                        {completedDaysInLesson} / {lesson.days.length} أيام مكتملة
                      </span>
                    </span>
                  </div>
                </div>

                {/* Lesson Section Topics (A, B, C, D) */}
                {lesson.sections && lesson.sections.length > 0 && (
                  <div className="px-4 sm:px-5 py-2.5 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-slate-500 text-[11px]">محاور الوحدة:</span>
                    {lesson.sections.map((sec) => (
                      <span
                        key={sec.letter}
                        className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-medium"
                      >
                        <strong className="text-amber-700 font-bold">{sec.letter}:</strong> {sec.titleDe} ({sec.titleAr})
                      </span>
                    ))}
                  </div>
                )}

                {/* Lesson Days Grid */}
                <div className="p-4 sm:p-5 grid gap-3 sm:grid-cols-2">
                  {lesson.filteredDays.map((day) => {
                    const isDayComplete = progress.completedDays.includes(day.dayNumber);
                    const isCurrent = progress.currentDay === day.dayNumber;
                    const isUnlocked = isDayUnlocked(day.dayNumber, progress.completedDays);
                    const testScore = progress.testScores[day.dayNumber];

                    return (
                      <div
                        key={day.dayNumber}
                        onClick={() => {
                          if (isUnlocked) {
                            onSelectDay(day.dayNumber);
                          } else {
                            setLockedNoticeDay(day.dayNumber);
                          }
                        }}
                        className={`p-4 rounded-xl border transition-all text-right flex flex-col justify-between ${
                          !isUnlocked
                            ? 'border-dashed border-slate-300 bg-slate-100/70 opacity-60 backdrop-blur-xs cursor-not-allowed select-none'
                            : isCurrent
                            ? 'border-amber-400 bg-amber-50/60 shadow-xs cursor-pointer'
                            : isDayComplete
                            ? 'border-emerald-200 bg-emerald-50/30 hover:border-emerald-300 cursor-pointer'
                            : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-slate-50 cursor-pointer'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                                  !isUnlocked
                                    ? 'bg-slate-200 text-slate-500'
                                    : isDayComplete
                                    ? 'bg-emerald-600 text-white'
                                    : isCurrent
                                    ? 'bg-amber-500 text-slate-950 shadow-2xs'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {!isUnlocked ? (
                                  <Lock className="w-3.5 h-3.5" />
                                ) : isDayComplete ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                  day.dayNumber
                                )}
                              </span>
                              <span
                                className={`text-xs font-black ${
                                  !isUnlocked ? 'text-slate-500' : 'text-slate-900'
                                }`}
                              >
                                Day {day.dayNumber}
                              </span>
                              {isCurrent && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                                  أنت هنا
                                </span>
                              )}
                            </div>

                            <span className="text-[11px] font-medium text-slate-500">
                              {!isUnlocked ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-600">
                                  <Lock className="w-3 h-3" /> مقفل
                                </span>
                              ) : (
                                `Seiten ${day.pages.join('–')}`
                              )}
                            </span>
                          </div>

                          <h4
                            className={`text-xs sm:text-sm font-bold mt-2 ${
                              !isUnlocked ? 'text-slate-500' : 'text-slate-900'
                            }`}
                          >
                            {day.sectionTitleDe}
                          </h4>

                          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                            {!isUnlocked
                              ? `🔒 مقفل: خاصك تكمل Day ${day.dayNumber - 1} وتنجح فالاختبار عاد يتفتح.`
                              : day.sectionTitleAr}
                          </p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                          <div className="flex items-center gap-2">
                            <span>{day.vocabulary?.length || 0} كلمات</span>
                            <span>•</span>
                            <span>{day.bookExercises?.length || 0} تمارين</span>
                            {testScore !== undefined && (
                              <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                {testScore}%
                              </span>
                            )}
                          </div>

                          {!isUnlocked ? (
                            <span className="text-[10px] font-semibold text-slate-400">غير متاح</span>
                          ) : (
                            <div className="flex items-center gap-1 text-amber-700 font-bold hover:text-amber-800">
                              <span>{isDayComplete ? 'مراجعة' : isCurrent ? 'ابدأ الآن' : 'عرض'}</span>
                              <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Locked Day Modal */}
      {lockedNoticeDay !== null && (() => {
        const lockedDayPlan = book.lessons
          .flatMap((l) => l.days)
          .find((d) => d.dayNumber === lockedNoticeDay);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="w-full max-w-lg rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] text-right">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                  <span>هذا الدرس مقفل حالياً! 🔒</span>
                </div>
                <button
                  onClick={() => setLockedNoticeDay(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                  aria-label="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed overflow-y-auto pr-1 py-2 flex-1">
                <p className="font-semibold text-slate-900">
                  ما تقدرش تدخل لـ <span className="text-amber-700 font-bold">Day {lockedNoticeDay}</span> دابا لأنك مازال ما كملتيش الدروس اللي قبلو.
                </p>

                {/* تفاصيل صفحات الدرس في الكتاب والموقع بالضبط */}
                {lockedDayPlan && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                        <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                        <span>معلومات الدرس في الكتاب ({book.title || 'DaF kompakt neu A1'}):</span>
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                        Lektion {lockedDayPlan.lessonNumber}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-right">
                      {/* شحال من صفحة */}
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-semibold">شحال من صفحة:</span>
                        <span className="text-sm font-black text-slate-900 block mt-0.5">
                          {lockedDayPlan.pages.length}{' '}
                          {lockedDayPlan.pages.length === 2 ? 'صفحات (صفحتين)' : 'صفحات'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono font-semibold">
                          {lockedDayPlan.pages.length} {lockedDayPlan.pages.length === 1 ? 'Seite' : 'Seiten'}
                        </span>
                      </div>

                      {/* أرقام الصفحات في الكتاب بالضبط */}
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-semibold">أرقام الصفحات بالضبط:</span>
                        <span className="text-sm font-black text-amber-700 block mt-0.5">
                          {lockedDayPlan.pages.length === 1
                            ? `الصفحة ${lockedDayPlan.pages[0]}`
                            : `الصفحة ${lockedDayPlan.pages.join(' و ')}`}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono font-bold">
                          {lockedDayPlan.pages.length === 1
                            ? `Seite ${lockedDayPlan.pages[0]}`
                            : `Seiten ${lockedDayPlan.pages.join('–')}`}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 bg-white/80 px-2.5 py-1.5 rounded-lg border border-slate-200/60 flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-700 shrink-0">عنوان الدرس:</span>
                      <span className="font-bold text-slate-900 truncate">
                        {lockedDayPlan.sectionTitleAr || lockedDayPlan.sectionTitleDe}
                      </span>
                    </div>
                  </div>
                )}

                {/* قواعد هذا الدرس / Grammatik im Fokus */}
                {lockedDayPlan && (
                  <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-slate-800 space-y-2.5 text-right">
                    <div className="flex items-center justify-between border-b border-blue-200/60 pb-2">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>قواعد هذا الدرس (Grammatik):</span>
                      </span>
                      {lockedDayPlan.grammar && lockedDayPlan.grammar.length > 0 ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                          {lockedDayPlan.grammar.length} قواعد ({lockedDayPlan.grammar.length} Themen)
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
                                <span>🎥 فيديو الشرح في التيليجرام:</span>
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
                        <span>تركيز هذا الدرس منصب على النطق، المفردات، والمحادثات الشفهية والتمارين التطبيقية.</span>
                      </div>
                    )}
                  </div>
                )}

                {/* شرط فتح هذا اليوم */}
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1 text-xs">
                  <p className="font-bold text-amber-900 flex items-center gap-1.5">
                    <span>💡 شرط فتح هذا اليوم:</span>
                  </p>
                  <p className="leading-relaxed">
                    خاصك تكمل <span className="font-bold">Day {lockedNoticeDay - 1}</span> وتدوز الاختبار اليومي (Daily Test) وتجيب فيه <span className="font-bold text-amber-900">80% على الأقل</span> باش يتفتح ليك Day {lockedNoticeDay} تلقائياً.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2 justify-end shrink-0">
                <button
                  onClick={() => setLockedNoticeDay(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  فهمت، شكراً
                </button>
                <button
                  onClick={() => {
                    const targetDay = progress.currentDay;
                    setLockedNoticeDay(null);
                    onSelectDay(targetDay);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-transform"
                >
                  <span>الانتقال لليوم المتاح (Day {progress.currentDay})</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
