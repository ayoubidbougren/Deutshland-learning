import React, { useState } from 'react';
import { Search, CheckCircle2, XCircle, Sparkles, BookOpen } from 'lucide-react';
import { CourseBook, ExerciseItem, UserCourseProgress } from '../../types/bookCourse';
import { recordExerciseAttempt } from '../../utils/bookStorage';

interface ExercisesBankViewProps {
  book: CourseBook;
  progress: UserCourseProgress;
  onProgressUpdate: (updated: UserCourseProgress) => void;
}

export const ExercisesBankView: React.FC<ExercisesBankViewProps> = ({
  book,
  progress,
  onProgressUpdate,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'book' | 'ai'>('all');
  const [selectedEx, setSelectedEx] = useState<ExerciseItem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState<{ checked: boolean; isCorrect: boolean; hint?: string } | null>(null);

  // Collect all book exercises
  const allExercises: Array<ExerciseItem & { lessonNumber: number; dayNumber: number }> = [];
  book.lessons.forEach((l) => {
    l.days.forEach((d) => {
      d.bookExercises.forEach((ex) => {
        allExercises.push({
          ...ex,
          lessonNumber: l.lessonNumber,
          dayNumber: d.dayNumber,
        });
      });
    });
  });

  const handleCheck = (answer: string) => {
    if (!selectedEx) return;
    const ans = answer.trim().toLowerCase();
    const isCorrect =
      ans === selectedEx.correctAnswer.toLowerCase() ||
      (selectedEx.acceptableAnswers || []).some((a) => a.toLowerCase() === ans);

    setResult({
      checked: true,
      isCorrect,
      hint: isCorrect ? 'Sehr gut!' : selectedEx.hint || 'Überlege noch einmal!',
    });

    const updated = recordExerciseAttempt(progress, selectedEx.id, answer, isCorrect, selectedEx.grammarCategory);
    onProgressUpdate(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">بنك التمارين التفاعلية (Übungsbank)</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            تمارين كتاب {book.title} مرتبة بالصفحات والقواعد
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filterType === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            جميع التمارين ({allExercises.length})
          </button>
          <button
            onClick={() => setFilterType('book')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filterType === 'book' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            📖 تمارين الكتاب
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {allExercises.map((ex) => {
          const attempt = progress.completedExercises[ex.id];
          const isSolved = attempt?.isCorrect;

          return (
            <div
              key={ex.id}
              className={`rounded-xl border p-4 transition-all bg-white shadow-xs space-y-3 ${
                isSolved ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">
                  Seite {ex.pageNumber} • Lektion {ex.lessonNumber}
                </span>
                {isSolved ? (
                  <span className="flex items-center gap-1 text-emerald-700 font-bold text-[11px] bg-emerald-100 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5" /> محلول
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px]">غير مكتمل</span>
                )}
              </div>

              <div>
                <p className="text-xs font-bold text-slate-900">{ex.instructionDe}</p>
                <p className="text-[11px] text-slate-500">{ex.instructionAr}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800">
                {ex.prompt}
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                  {ex.grammarCategory || 'Grammatik'}
                </span>
                <button
                  onClick={() => {
                    setSelectedEx(ex);
                    setUserAnswer('');
                    setResult(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
                >
                  حل التمرين الآن
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Modal */}
      {selectedEx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-xs font-bold text-slate-500">
                Seite {selectedEx.pageNumber} • Aufgabe {selectedEx.exerciseNumber}
              </span>
              <button
                onClick={() => setSelectedEx(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-900">{selectedEx.instructionDe}</p>
              <p className="text-xs text-slate-500">{selectedEx.instructionAr}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900">
              {selectedEx.prompt}
            </div>

            {selectedEx.options && selectedEx.options.length > 0 ? (
              <div className="grid gap-2">
                {selectedEx.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setUserAnswer(opt);
                      handleCheck(opt);
                    }}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                      userAnswer === opt
                        ? result?.isCorrect
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                          : 'border-amber-400 bg-amber-50 text-amber-900'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="اكتب إجابتك هنا..."
                  className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none"
                />
                <button
                  onClick={() => handleCheck(userAnswer)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  تحقق
                </button>
              </div>
            )}

            {result && (
              <div
                className={`p-3 rounded-xl text-xs space-y-1 ${
                  result.isCorrect
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-amber-50 text-amber-900 border border-amber-200'
                }`}
              >
                <p className="font-bold">{result.isCorrect ? '✅ ممتاز!' : '❌ غير صحيح'}</p>
                <p>{result.hint}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
