import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  BarChart2,
  FileText,
  UploadCloud,
  CheckCircle2,
  Brain,
  MessageSquare,
  Edit3,
  Lock,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { CourseBook, UserCourseProgress } from '../../types/bookCourse';
import { DAF_KOMPAKT_A1_BOOK } from '../../data/dafKompaktBookData';
import {
  loadCourseBook,
  saveCourseBook,
  loadUserProgress,
  saveUserProgress,
  isDayUnlocked,
} from '../../utils/bookStorage';
import { BookOverviewView } from './BookOverviewView';
import { TodayLessonView } from './TodayLessonView';
import { LessonsBrowserView } from './LessonsBrowserView';
import { VocabularyBankView } from './VocabularyBankView';
import { GrammarHandbookView } from './GrammarHandbookView';
import { ExercisesBankView } from './ExercisesBankView';
import { ProgressDashboardView } from './ProgressDashboardView';
import { BookUploadModal } from './BookUploadModal';
import { DailyImmersionChecklistView } from './DailyImmersionChecklistView';

export type BookTab =
  | 'overview'
  | 'today'
  | 'lessons'
  | 'vocabulary'
  | 'grammar'
  | 'exercises'
  | 'progress'
  | 'immersion';

interface BookCourseViewProps {
  onBookTitleChange?: (newTitle: string) => void;
}

export const BookCourseView: React.FC<BookCourseViewProps> = ({ onBookTitleChange }) => {
  const [book, setBook] = useState<CourseBook>(() => loadCourseBook());
  const [progress, setProgress] = useState<UserCourseProgress>(() =>
    loadUserProgress(book.id)
  );

  const [activeTab, setActiveTab] = useState<BookTab>('overview');
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(progress.currentDay);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Sync book title callback for sidebar
  useEffect(() => {
    if (onBookTitleChange && book.title) {
      onBookTitleChange(book.title);
    }
  }, [book.title, onBookTitleChange]);

  const handleBookLoaded = (newBook: CourseBook) => {
    setBook(newBook);
    saveCourseBook(newBook);
    const newProgress = loadUserProgress(newBook.id);
    setProgress(newProgress);
    setSelectedDayNumber(1);
    setActiveTab('overview');
    if (onBookTitleChange) {
      onBookTitleChange(newBook.title);
    }
  };

  const handleProgressUpdate = (updatedProgress: UserCourseProgress) => {
    setProgress(updatedProgress);
    saveUserProgress(updatedProgress);
  };

  const handleNavigateToDay = (dayNum: number) => {
    setSelectedDayNumber(dayNum);
    setActiveTab('today');
  };

  // Find the DayLessonPlan for the selected day number
  const currentDayPlan =
    book.lessons.flatMap((l) => l.days).find((d) => d.dayNumber === selectedDayNumber) ||
    book.lessons[0]?.days[0];

  return (
    <div className="space-y-6">
      {/* Top Header Card with Dynamic Book Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0 border border-amber-500/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-400 font-mono">
                {book.level} • Lehrbuch
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {book.title}
              </h1>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {book.subtitle} • {book.publisher} • {book.totalPages} Seiten
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              الكتاب المعتمد • مسار دراسي يومي منظم مع الذكاء الاصطناعي والشرح بالدارجة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-slate-700 text-left transition-all shadow-2xs cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="text-xs font-bold text-slate-800 block leading-tight">Buch wechseln / PDF</span>
              <span className="text-[10px] text-slate-400 block leading-tight">رفع أو تغيير الكتاب</span>
            </div>
          </button>
        </div>
      </div>

      {/* Sub Tabs Navigation - German Primary with subtle Arabic subtext */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        {[
          { id: 'overview', labelDe: 'Übersicht', labelAr: 'نظرة عامة', icon: Sparkles },
          { id: 'today', labelDe: `Heutige Lektion (Tag ${selectedDayNumber})`, labelAr: 'درس اليوم', icon: Calendar },
          { id: 'immersion', labelDe: 'Tägliche Routine', labelAr: 'روتين ما بعد الدرس', icon: Clock },
          { id: 'lessons', labelDe: 'Inhaltsverzeichnis', labelAr: 'فهرس الدروس', icon: Layers },
          { id: 'vocabulary', labelDe: 'Wortschatz', labelAr: 'المفردات', icon: BookOpen },
          { id: 'grammar', labelDe: 'Grammatik', labelAr: 'القواعد', icon: FileText },
          { id: 'exercises', labelDe: 'Übungsbank', labelAr: 'بنك التمارين', icon: Brain },
          { id: 'progress', labelDe: 'Lernfortschritt', labelAr: 'لوحة التقدم', icon: BarChart2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as BookTab)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200/80 text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <div className="flex flex-col">
                <span className="text-xs font-bold whitespace-nowrap leading-tight">{tab.labelDe}</span>
                <span className={`text-[10px] whitespace-nowrap leading-tight ${isActive ? 'text-amber-300/80' : 'text-slate-400'}`}>
                  {tab.labelAr}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Sub View Content */}
      {activeTab === 'overview' && (
        <BookOverviewView
          book={book}
          progress={progress}
          onNavigateToDay={handleNavigateToDay}
          onSelectTab={setActiveTab}
        />
      )}

      {activeTab === 'today' && currentDayPlan && (
        !isDayUnlocked(currentDayPlan.dayNumber, progress.completedDays) ? (
          <div className="rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/40 p-8 sm:p-12 text-center space-y-5 max-w-xl mx-auto my-6 shadow-xs backdrop-blur-xs">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-800 flex items-center justify-center mx-auto border border-amber-300 shadow-xs">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                <Lock className="w-3.5 h-3.5" />
                Day {currentDayPlan.dayNumber} مقفل حالياً
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {currentDayPlan.sectionTitleDe}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                ما تقدرش تدخل لـ <span className="font-bold text-amber-900">Day {currentDayPlan.dayNumber}</span> دابا حتى تكمل{' '}
                <span className="font-bold text-amber-900">Day {currentDayPlan.dayNumber - 1}</span> كاملاً: (الدرس، الاختبار اليومي بنسبة 80% على الأقل، وروتين ما بعد الدرس مع تشيك ليست الإتقان وفيديو Easy German بنسبة 100%).
              </p>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button
                onClick={() => {
                  setSelectedDayNumber(currentDayPlan.dayNumber - 1);
                  setActiveTab('today');
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                <span>الرجوع لإكمال Day {currentDayPlan.dayNumber - 1} وروتين الإتقان</span>
              </button>
              <button
                onClick={() => setActiveTab('overview')}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all"
              >
                العودة لنظرة عامة
              </button>
            </div>
          </div>
        ) : (
          <TodayLessonView
            dayPlan={currentDayPlan}
            progress={progress}
            onProgressUpdate={handleProgressUpdate}
            onCompleteDaySuccess={() => {
              // Day completed successfully
            }}
            onNavigateToDay={handleNavigateToDay}
            totalDaysInBook={book.lessons.reduce((acc, l) => acc + l.days.length, 0)}
          />
        )
      )}

      {activeTab === 'lessons' && (
        <LessonsBrowserView
          book={book}
          progress={progress}
          onSelectDay={handleNavigateToDay}
        />
      )}

      {activeTab === 'vocabulary' && (
        <VocabularyBankView
          book={book}
          progress={progress}
          onProgressUpdate={handleProgressUpdate}
        />
      )}

      {activeTab === 'grammar' && <GrammarHandbookView book={book} />}

      {activeTab === 'exercises' && (
        <ExercisesBankView
          book={book}
          progress={progress}
          onProgressUpdate={handleProgressUpdate}
        />
      )}

      {activeTab === 'progress' && (
        <ProgressDashboardView
          book={book}
          progress={progress}
          onNavigateToDay={handleNavigateToDay}
        />
      )}

      {activeTab === 'immersion' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>اختر اليوم الذي تريد ممارسة روتينه وانغماسه (فيديو + قراءة + كتابة + كرونو):</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">اليوم المختار:</span>
              <select
                value={selectedDayNumber}
                onChange={(e) => {
                  const targetDay = Number(e.target.value);
                  if (isDayUnlocked(targetDay, progress.completedDays)) {
                    setSelectedDayNumber(targetDay);
                  }
                }}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 outline-none focus:border-amber-500 cursor-pointer"
              >
                {Array.from({ length: 24 }, (_, i) => i + 1).map((d) => {
                  const isCompleted = progress.completedDays.includes(d);
                  const isUnlocked = isDayUnlocked(d, progress.completedDays);
                  return (
                    <option
                      key={d}
                      value={d}
                      disabled={!isUnlocked}
                      className={!isUnlocked ? 'text-slate-400 bg-slate-100 font-normal' : 'font-bold text-slate-900'}
                    >
                      Day {d} {isCompleted ? '✅ (مكتمل)' : isUnlocked ? '🔓 (متاح)' : '🔒 (مقفول)'}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {!isDayUnlocked(selectedDayNumber, progress.completedDays) ? (
            <div className="rounded-3xl border-2 border-dashed border-amber-200 bg-amber-50/50 p-8 sm:p-12 text-center space-y-5 max-w-xl mx-auto my-6 shadow-xs backdrop-blur-xs">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-800 flex items-center justify-center mx-auto border border-amber-300 shadow-xs">
                <Lock className="w-8 h-8 text-amber-700" />
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                  <Lock className="w-3.5 h-3.5" />
                  روتين Day {selectedDayNumber} مقفل حالياً 🔒
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  لا يمكنك الدخول إلى روتين Day {selectedDayNumber}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                  هذا اليوم مقفول حتى تكمل <span className="font-bold text-amber-900">Day {selectedDayNumber - 1}</span> كاملاً: (درس اليوم، الاختبار بنسبة 80%+، وجميع مهام روتين الإتقان بما فيها فيديو Easy German بنسبة 100%).
                </p>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button
                  onClick={() => {
                    const firstLocked = Array.from({ length: 24 }, (_, i) => i + 1).find(
                      (d) => !isDayUnlocked(d, progress.completedDays)
                    );
                    const safeDay = Math.max(1, (firstLocked || 2) - 1);
                    setSelectedDayNumber(safeDay);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Clock className="w-4 h-4" />
                  <span>الذهاب إلى اليوم الحالي المفتوح</span>
                </button>
                <button
                  onClick={() => setActiveTab('today')}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  العودة للدرس ↩️
                </button>
              </div>
            </div>
          ) : (
            <DailyImmersionChecklistView
              dayNumber={selectedDayNumber}
              vocabularyList={currentDayPlan?.vocabulary}
              onFinishRoutine={() => setActiveTab('today')}
              onNavigateToNextDay={() => handleNavigateToDay(selectedDayNumber + 1)}
              nextDayAvailable={selectedDayNumber < 24}
            />
          )}
        </div>
      )}

      {/* Upload Modal */}
      <BookUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onBookLoaded={handleBookLoaded}
        currentBook={book}
      />
    </div>
  );
};
