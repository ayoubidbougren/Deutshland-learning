import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Layers,
  FileText,
  Clock,
  Sparkles,
  TrendingUp,
  Lock,
  X,
  ArrowRight,
} from 'lucide-react';
import { CourseBook, UserCourseProgress, BookVocabularyItem } from '../../types/bookCourse';
import { calculateOverallProgress, getWeakAreas, isDayUnlocked } from '../../utils/bookStorage';

interface ProgressDashboardViewProps {
  book: CourseBook;
  progress: UserCourseProgress;
  onNavigateToDay: (dayNumber: number) => void;
}

export const ProgressDashboardView: React.FC<ProgressDashboardViewProps> = ({
  book,
  progress,
  onNavigateToDay,
}) => {
  const [lockedNoticeDay, setLockedNoticeDay] = useState<number | null>(null);
  const overallPercent = calculateOverallProgress(book, progress);
  const weakAreas = getWeakAreas(progress);

  // Vocabulary stats
  const vocabValues: BookVocabularyItem[] = Object.values(progress.vocabularyBank || {});
  const learnedVocabCount = vocabValues.filter((v) => v.status === 'learned').length;
  const learningVocabCount = vocabValues.filter((v) => v.status === 'learning').length;
  const reviewVocabCount = vocabValues.filter((v) => v.status === 'needs_review').length;

  // Test scores average
  const scores: number[] = Object.values(progress.testScores || {});
  const avgScore =
    scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">لوحة المتابعة الشاملة (Progress Dashboard)</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          إحصائيات دقيقة حول تقدمك في كتاب {book.title}
        </p>
      </div>

      {/* Big Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500">اليوم الحالي (Day)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">Day {progress.currentDay}</span>
          </div>
          <p className="text-xs text-amber-700 font-medium">Lektion {book.lessons[0]?.number || 1}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500">الصفحات المكتملة</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-600">
              {progress.completedPages.length}
            </span>
            <span className="text-xs text-slate-400">من {book.totalPages}</span>
          </div>
          <p className="text-xs text-slate-500">صفحات ممارسة مباشرة</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500">المفردات المتقنة</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">{learnedVocabCount}</span>
            <span className="text-xs text-slate-400">كلمة</span>
          </div>
          <p className="text-xs text-emerald-700 font-medium">+{learningVocabCount} قيد الممارسة</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500">معدل الاختبارات اليومية</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">
              {scores.length > 0 ? `${avgScore}%` : '—'}
            </span>
          </div>
          <p className="text-xs text-slate-500">{scores.length} اختبارات مجتازة</p>
        </div>
      </div>

      {/* Weak Areas Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base text-slate-900">التعلم التكيفي & نقاط الضعف (Weak Areas)</h3>
          </div>
          <span className="text-xs font-medium text-slate-500">يتم التركيز عليها تلقائياً في التمارين اليومية</span>
        </div>

        {weakAreas.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {weakAreas.map((w, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-amber-950">{w.category}</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold text-[10px]">
                    {w.mistakes} أخطاء
                  </span>
                </div>
                <p className="text-xs text-amber-800">
                  يركز المعلم الذكي على طرح أسئلة {w.category} لتعزيز فهمك للقاعدة.
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-500">
            أداء ممتاز! لم يتم تسجيل نقاط ضعف متكررة حتى الآن. استمر في خوض التمارين.
          </div>
        )}
      </div>

      {/* Test Scores Breakdown */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-slate-900">سجل نتائج الاختبارات اليومية</h3>

        <div className="space-y-2">
          {book.lessons.flatMap((l) =>
            l.days.map((day) => {
              const score = progress.testScores[day.dayNumber];
              const isDone = progress.completedDays.includes(day.dayNumber);
              const isUnlocked = isDayUnlocked(day.dayNumber, progress.completedDays);

              return (
                <div
                  key={day.dayNumber}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                    !isUnlocked
                      ? 'border-dashed border-slate-200 bg-slate-50/60 opacity-60 backdrop-blur-xs'
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[11px] ${
                        !isUnlocked
                          ? 'bg-slate-200 text-slate-500'
                          : isDone
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {!isUnlocked ? <Lock className="w-3.5 h-3.5" /> : `D${day.dayNumber}`}
                    </span>
                    <span className={`font-semibold ${!isUnlocked ? 'text-slate-400' : 'text-slate-800'}`}>
                      {day.sectionTitleDe}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {score !== undefined ? (
                      <span
                        className={`font-bold px-2 py-0.5 rounded ${
                          score >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {score}%
                      </span>
                    ) : (
                      <span className="text-slate-400">{!isUnlocked ? 'مقفل 🔒' : 'لم يكتمل بعد'}</span>
                    )}

                    {isUnlocked ? (
                      <button
                        onClick={() => onNavigateToDay(day.dayNumber)}
                        className="text-amber-600 hover:underline font-semibold"
                      >
                        الانتقال للدرس
                      </button>
                    ) : (
                      <button
                        onClick={() => setLockedNoticeDay(day.dayNumber)}
                        className="text-slate-400 hover:text-slate-600 flex items-center gap-1 font-medium"
                      >
                        <Lock className="w-3 h-3" />
                        <span>مقفل</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Locked Notice Modal */}
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
                    onNavigateToDay(targetDay);
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
