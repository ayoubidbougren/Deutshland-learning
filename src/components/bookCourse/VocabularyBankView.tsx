import React, { useState } from 'react';
import { Search, Volume2, Filter, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { CourseBook, UserCourseProgress, VocabularyStatus, BookVocabularyItem } from '../../types/bookCourse';
import { updateVocabularyStatus } from '../../utils/bookStorage';

interface VocabularyBankViewProps {
  book: CourseBook;
  progress: UserCourseProgress;
  onProgressUpdate: (updated: UserCourseProgress) => void;
}

export const VocabularyBankView: React.FC<VocabularyBankViewProps> = ({
  book,
  progress,
  onProgressUpdate,
}) => {
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | VocabularyStatus>('all');

  // Collect all vocabulary from the whole book
  const allVocab: BookVocabularyItem[] = [];
  const seenIds = new Set<string>();

  book.lessons.forEach((lesson) => {
    lesson.days.forEach((day) => {
      day.vocabulary.forEach((item) => {
        if (!seenIds.has(item.id)) {
          seenIds.add(item.id);
          allVocab.push(item);
        }
      });
    });
  });

  // Calculate status counts
  const counts = {
    all: allVocab.length,
    new: 0,
    learning: 0,
    learned: 0,
    needs_review: 0,
  };

  allVocab.forEach((item) => {
    const status = progress.vocabularyBank[item.id]?.status || item.status || 'new';
    counts[status] = (counts[status] || 0) + 1;
  });

  const filtered = allVocab.filter((item) => {
    const status = progress.vocabularyBank[item.id]?.status || item.status || 'new';
    if (selectedFilter !== 'all' && status !== selectedFilter) return false;

    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return (
      item.word.toLowerCase().includes(query) ||
      item.meaningAr.toLowerCase().includes(query) ||
      (item.exampleSentence && item.exampleSentence.toLowerCase().includes(query))
    );
  });

  const playSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">بنك المفردات (Wortschatz-Bank)</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            جميع مفردات كتاب {book.title} مسجلة مع جمل سياقية وترجمة عربية وحالة الحفظ
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: `الكل (${counts.all})` },
            { id: 'new', label: `🆕 جديد (${counts.new})` },
            { id: 'learning', label: `🔄 قيد التعلم (${counts.learning})` },
            { id: 'learned', label: `✅ مكتمل (${counts.learned})` },
            { id: 'needs_review', label: `⚠️ يحتاج مراجعة (${counts.needs_review})` },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === f.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن كلمة بالألمانية أو العربية أو بجملة..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 shadow-2xs"
        />
      </div>

      {/* Vocabulary Cards Grid */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => {
          const currentStatus = progress.vocabularyBank[item.id]?.status || item.status || 'new';

          return (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 p-4 bg-white shadow-xs space-y-2.5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900">
                      {item.article && (
                        <span
                          className={`text-[11px] font-semibold px-1.5 py-0.5 rounded mr-1.5 ${
                            item.article === 'der'
                              ? 'bg-blue-100 text-blue-700'
                              : item.article === 'die'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {item.article}
                        </span>
                      )}
                      {item.word}
                    </span>
                    <button
                      onClick={() => playSpeech(item.word)}
                      className="p-1 rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                      title="استمع للنطق"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <select
                    value={currentStatus}
                    onChange={(e) => {
                      const updated = updateVocabularyStatus(
                        progress,
                        item.id,
                        e.target.value as any,
                        item
                      );
                      onProgressUpdate(updated);
                    }}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none"
                  >
                    <option value="new">🆕 New</option>
                    <option value="learning">🔄 Learning</option>
                    <option value="learned">✅ Learned</option>
                    <option value="needs_review">⚠️ Needs Review</option>
                  </select>
                </div>

                <p className="text-xs font-semibold text-amber-900">{item.meaningAr}</p>

                {item.exampleSentence && (
                  <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100 text-xs space-y-1">
                    <div className="flex items-start justify-between gap-1.5">
                      <p className="text-slate-800 font-medium">{item.exampleSentence}</p>
                      <button
                        onClick={() => playSpeech(item.exampleSentence)}
                        className="text-slate-400 hover:text-amber-600 shrink-0"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {item.sentenceTranslationAr && (
                      <p className="text-[11px] text-slate-500">{item.sentenceTranslationAr}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>Seite {item.pageNumber}</span>
                <span>Lektion {item.lessonNumber}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
