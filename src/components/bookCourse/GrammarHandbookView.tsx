import React, { useState, useMemo } from 'react';
import { Search, Volume2, BookOpen, Filter, Hash, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { CourseBook, GrammarTopic } from '../../types/bookCourse';
import { TelegramGrammarVideoCard } from './TelegramGrammarVideoCard';

interface GrammarHandbookViewProps {
  book: CourseBook;
}

export const GrammarHandbookView: React.FC<GrammarHandbookViewProps> = ({ book }) => {
  const [search, setSearch] = useState('');
  const [selectedLektion, setSelectedLektion] = useState<number | 'all'>('all');
  const [selectedPage, setSelectedPage] = useState<number | 'all'>('all');

  // Collect all grammar topics with lesson, day, and page metadata
  const allGrammar: Array<
    GrammarTopic & {
      dayNumber: number;
      lessonNumber: number;
      dayPages: number[];
      effectivePage: number;
    }
  > = useMemo(() => {
    const list: Array<
      GrammarTopic & {
        dayNumber: number;
        lessonNumber: number;
        dayPages: number[];
        effectivePage: number;
      }
    > = [];

    book.lessons.forEach((lesson) => {
      lesson.days.forEach((day) => {
        day.grammar.forEach((g) => {
          const effectivePage = g.pageNumber || day.pages[0] || 0;
          list.push({
            ...g,
            dayNumber: day.dayNumber,
            lessonNumber: day.lessonNumber,
            dayPages: day.pages,
            effectivePage,
          });
        });
      });
    });

    return list;
  }, [book]);

  // Unique list of pages for quick jumping
  const availablePages = useMemo(() => {
    const pageSet = new Set<number>();
    allGrammar.forEach((g) => {
      if (g.effectivePage) pageSet.add(g.effectivePage);
    });
    return Array.from(pageSet).sort((a, b) => a - b);
  }, [allGrammar]);

  // Filtering
  const filtered = useMemo(() => {
    return allGrammar.filter((g) => {
      // Lektion filter
      if (selectedLektion !== 'all' && g.lessonNumber !== selectedLektion) {
        return false;
      }

      // Page filter
      if (selectedPage !== 'all') {
        const matchesDirect = g.effectivePage === selectedPage;
        const matchesDayPages = g.dayPages.includes(selectedPage);
        if (!matchesDirect && !matchesDayPages) {
          return false;
        }
      }

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesText =
          g.titleDe.toLowerCase().includes(q) ||
          g.titleAr.toLowerCase().includes(q) ||
          g.summaryDe.toLowerCase().includes(q) ||
          g.summaryAr.toLowerCase().includes(q) ||
          (g.explanationAr && g.explanationAr.toLowerCase().includes(q)) ||
          (g.telegramVideo && g.telegramVideo.lessonTitle.toLowerCase().includes(q));

        // Also check if user typed page numbers (e.g., "10", "11", "صفحة 10", "seite 11")
        const isPageMatch =
          g.effectivePage.toString() === q ||
          g.dayPages.some((p) => p.toString() === q) ||
          q.includes(g.effectivePage.toString());

        if (!matchesText && !isPageMatch) {
          return false;
        }
      }

      return true;
    });
  }, [allGrammar, selectedLektion, selectedPage, search]);

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
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-l from-amber-500/10 via-white to-blue-500/5 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                دليل قواعد الكتاب صفحة بصفحة (Grammatik nach Buchseiten)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
              كل صفحة في كتاب <span className="font-bold text-slate-900">{book.title}</span> وقواعدها المضبوطة مع شروحاتها وفيديو التيليجرام الخاص بها مباشرة بدون أي تكرار.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="rounded-xl bg-white border border-slate-200 px-4 py-2 text-center shadow-xs">
              <span className="block text-lg font-black text-slate-900">{allGrammar.length}</span>
              <span className="block text-[11px] text-slate-500 font-semibold">موضوع وقاعدة</span>
            </div>
            <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-2 text-center shadow-xs">
              <span className="block text-lg font-black text-blue-700">8</span>
              <span className="block text-[11px] text-blue-600 font-semibold">وحدات دراسية</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث برقم الصفحة (مثلاً 10 أو 11) أو باسم القاعدة (Verben, Akkusativ, Dativ, Modalverben...)"
            className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-2xs"
          />
        </div>

        {/* Lektion Tabs (1 to 8) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              تصفية بالوحدات (Lektionen 1–8):
            </span>
            {selectedLektion !== 'all' && (
              <button
                onClick={() => {
                  setSelectedLektion('all');
                  setSelectedPage('all');
                }}
                className="text-[11px] font-semibold text-amber-700 hover:underline cursor-pointer"
              >
                إظهار جميع الوحدات
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => {
                setSelectedLektion('all');
                setSelectedPage('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedLektion === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              جميع الوحدات (Alle)
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <button
                key={num}
                onClick={() => {
                  setSelectedLektion(num);
                  setSelectedPage('all');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedLektion === num
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Lektion {num}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Jump by Book Page Number */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              تصفح سريع بأرقام صفحات الكتاب (Buchseiten):
            </span>
            {selectedPage !== 'all' && (
              <button
                onClick={() => setSelectedPage('all')}
                className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                إلغاء حصر الصفحة
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedPage('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                selectedPage === 'all'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              كل الصفحات
            </button>
            {availablePages
              .filter((p) => {
                if (selectedLektion === 'all') return true;
                const matchesLektion = allGrammar.some(
                  (g) => g.lessonNumber === selectedLektion && (g.effectivePage === p || g.dayPages.includes(p))
                );
                return matchesLektion;
              })
              .map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPage(p)}
                  className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap cursor-pointer transition-all ${
                    selectedPage === p
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium'
                  }`}
                >
                  ص {p}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Active filters summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          عرض <strong className="text-slate-900">{filtered.length}</strong> قاعدة مطابقة
          {selectedLektion !== 'all' && ` في Lektion ${selectedLektion}`}
          {selectedPage !== 'all' && ` (الصفحة ${selectedPage})`}
        </span>
        {(selectedLektion !== 'all' || selectedPage !== 'all' || search) && (
          <button
            onClick={() => {
              setSearch('');
              setSelectedLektion('all');
              setSelectedPage('all');
            }}
            className="text-amber-700 font-semibold hover:underline cursor-pointer"
          >
            إعادة تعيين الفلاتر
          </button>
        )}
      </div>

      {/* Cards List */}
      <div className="space-y-6">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
            <span className="text-3xl">🔍</span>
            <h3 className="text-base font-bold text-slate-800">لا توجد قواعد مطابقة للبحث</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              جرب البحث باسم قاعدة أخرى أو برقم صفحة من صفحات الكتاب (مثل 10، 11، 18، 26...).
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedLektion('all');
                setSelectedPage('all');
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
            >
              عرض جميع القواعد
            </button>
          </div>
        ) : (
          filtered.map((g, idx) => (
            <div
              key={g.id || idx}
              id={`grammar-topic-${g.id}`}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 hover:border-slate-300 transition-all"
            >
              {/* Header Badges */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">{g.titleDe}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">{g.titleAr}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                  <span className="text-xs font-bold px-3 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    Seite {g.effectivePage || g.dayPages.join('–')}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                    Lektion {g.lessonNumber} • Tag {g.dayNumber}
                  </span>
                </div>
              </div>

              {/* Exact Telegram Video Explanation Card */}
              <TelegramGrammarVideoCard topic={g} />

              {/* Rule Summary & Explanation */}
              <div className="rounded-xl bg-amber-50/70 p-4 border border-amber-200/80 text-xs space-y-2">
                <div className="font-semibold text-slate-900 leading-relaxed">{g.summaryDe}</div>
                <div className="text-slate-700 leading-relaxed">{g.summaryAr}</div>
                {g.explanationAr && (
                  <div className="text-slate-800 pt-2 border-t border-amber-200 leading-relaxed font-normal">
                    {g.explanationAr}
                  </div>
                )}
                {g.rules && g.rules.length > 0 && (
                  <div className="pt-2 border-t border-amber-200/60">
                    <span className="block font-bold text-slate-800 mb-1">النقاط الأساسية للقاعدة:</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 font-medium">
                      {g.rules.map((rule, rIdx) => (
                        <li key={rIdx}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Tables (if present) */}
              {g.tables && g.tables.length > 0 && (
                <div className="space-y-3">
                  {g.tables.map((tbl, tIdx) => (
                    <div key={tIdx} className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                      <div className="bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-800 border-b border-slate-200">
                        {tbl.title}
                      </div>
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                          <tr>
                            {tbl.headers.map((h, hIdx) => (
                              <th key={hIdx} className="px-3.5 py-2">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {tbl.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-50/80">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="px-3.5 py-2 font-medium text-slate-800">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}

              {/* Examples with Audio Pronunciation */}
              {g.examples && g.examples.length > 0 && (
                <div className="space-y-2 pt-1">
                  <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    أمثلة تطبيقية من كتاب DaF kompakt neu:
                  </h4>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {g.examples.map((ex, exIdx) => (
                      <div
                        key={exIdx}
                        className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80 text-xs space-y-1.5 hover:bg-slate-100/60 transition-all"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-slate-900 text-sm">{ex.de}</p>
                          <button
                            onClick={() => playSpeech(ex.de)}
                            title="استمع للنطق"
                            className="p-1 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-white transition-all cursor-pointer shrink-0"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-slate-600">{ex.ar}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
