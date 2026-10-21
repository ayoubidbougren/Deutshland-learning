import React, { useState } from 'react';
import {
  BookOpen,
  Lock,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Compass,
  MessageCircle,
  HelpCircle,
  Layers,
  Flame,
} from 'lucide-react';
import {
  BOOK_LESSON_TUTOR_PROFILES,
  BookLessonTutorProfile,
  getBookLessonTutorProfile,
} from '../data/bookLessonTutorData';
import { GermanLevel } from '../types';

interface BookTutorSelectorProps {
  isBookLinked: boolean;
  setIsBookLinked: (val: boolean) => void;
  selectedLesson: number;
  setSelectedLesson: (lessonNum: number) => void;
  userCurrentLesson: number;
  disabled?: boolean;
  selectedLevel: GermanLevel;
  setSelectedLevel: (level: GermanLevel) => void;
}

export const BookTutorSelector: React.FC<BookTutorSelectorProps> = ({
  isBookLinked,
  setIsBookLinked,
  selectedLesson,
  setSelectedLesson,
  userCurrentLesson,
  disabled = false,
  selectedLevel,
  setSelectedLevel,
}) => {
  const [showDetails, setShowDetails] = useState(true);
  const [playingPhrase, setPlayingPhrase] = useState<string | null>(null);

  const activeProfile = getBookLessonTutorProfile(selectedLesson);

  const handleSpeakPhrase = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setPlayingPhrase(text);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = 0.85; // slow for learner
    utterance.onend = () => setPlayingPhrase(null);
    utterance.onerror = () => setPlayingPhrase(null);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden transition-all">
      {/* Top Mode Toggle: Linked to Book vs. Unlinked General Conversation */}
      <div className="p-3 sm:p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center border border-amber-500/25">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>محادثة مرتبطة بدروس الكتاب</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                موصى به
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              DaF kompakt neu A1 • تحديد سقف ومستوى المحادثة
            </p>
          </div>
        </div>

        {/* Segmented Mode Button */}
        <div className="flex items-center bg-slate-200/80 p-1 rounded-xl w-full sm:w-auto self-stretch sm:self-auto">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsBookLinked(true)}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              isBookLinked
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>مقيد بدرس محدد</span>
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsBookLinked(false)}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              !isBookLinked
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>محادثة عامة (A1-B1)</span>
          </button>
        </div>
      </div>

      {isBookLinked ? (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Lektion Selection Pills */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                <span>اختر الدرس الذي قمت بدراسته في الكتاب:</span>
              </label>

              {userCurrentLesson > 0 && selectedLesson !== userCurrentLesson && (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelectedLesson(userCurrentLesson)}
                  className="text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Flame className="w-3 h-3 text-amber-600" />
                  <span>مزامنة مع درسي الحالي (Lektion {userCurrentLesson})</span>
                </button>
              )}
            </div>

            {/* Lessons Selector Bar */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {Object.values(BOOK_LESSON_TUTOR_PROFILES).map((prof) => {
                const isSelected = selectedLesson === prof.lessonNumber;
                const isUserCurrent = userCurrentLesson === prof.lessonNumber;

                return (
                  <button
                    key={prof.lessonNumber}
                    type="button"
                    disabled={disabled}
                    onClick={() => setSelectedLesson(prof.lessonNumber)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs ring-2 ring-slate-900/10'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                    title={prof.titleAr}
                  >
                    {isUserCurrent && (
                      <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-500 text-slate-950 rounded-full text-[8px] font-bold flex items-center justify-center shadow-xs border border-white">
                        ★
                      </span>
                    )}
                    <div className="text-[10px] uppercase font-bold opacity-80">Lektion</div>
                    <div className="text-sm font-black">{prof.lessonNumber}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Lesson Header & Strict Ceiling Guarantee */}
          <div className="rounded-2xl border border-amber-300/80 bg-gradient-to-br from-amber-50/90 via-white to-amber-50/40 p-4 space-y-3 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/70 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[10px]">
                    Lektion {activeProfile.lessonNumber}
                  </span>
                  <span className="text-xs font-black text-slate-900">
                    {activeProfile.titleDe}
                  </span>
                  <span className="text-xs text-slate-600 font-medium">
                    ({activeProfile.titleAr})
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {activeProfile.subtitleAr} • {activeProfile.bookPages}
                </div>
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300 flex items-center gap-1 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>قفل المستوى نشط 🔒</span>
                </span>
              </div>
            </div>

            {/* Strict Constraint Notice (Guarantee to the user) */}
            <div className="bg-white/90 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 leading-relaxed space-y-1">
                <div className="font-bold text-slate-900">
                  ضمانة عدم تجاوز المستوى (Level Ceiling):
                </div>
                <p className="text-[11px] text-slate-600">
                  الذكاء الاصطناعي مقيد بصرامة باش ما يفوتش معاك هاد المستوى وما يستعملش أي كلمة أو زمن أو قاعدة ما قريتيهاش في{' '}
                  <span className="font-bold text-slate-900">{activeProfile.titleDe}</span>.
                </p>
                {/* Forbidden items tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {activeProfile.forbiddenGrammar.map((fg, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 text-[10px] font-semibold border border-rose-200"
                    >
                      {fg}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Accordion / Toggle for full Details */}
            <div>
              <button
                type="button"
                onClick={() => setShowDetails((prev) => !prev)}
                className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer transition-colors"
              >
                {showDetails ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span>إخفاء تفاصيل مواضيع الدرس ومفرداته</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span>عرض مواضيع ومفردات {activeProfile.titleDe} المسموحة</span>
                  </>
                )}
              </button>

              {showDetails && (
                <div className="pt-3 space-y-3">
                  {/* Allowed Topics */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-700">
                      المواضيع المسموح للـ AI التحدث عنها في هذا الدرس:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {activeProfile.allowedTopics.map((topic, i) => (
                        <div
                          key={i}
                          className="bg-white/80 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs flex items-center gap-1.5 text-slate-800"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="font-medium">{topic.titleAr}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Allowed Verbs & Grammar */}
                  <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 text-xs space-y-1.5">
                    <div>
                      <span className="font-bold text-slate-700 text-[11px]">الأفعال المعتمدة: </span>
                      <span className="font-mono text-[11px] text-slate-800">
                        {activeProfile.allowedVerbs.join(', ')}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 text-[11px]">القواعد المعتمدة: </span>
                      <span className="text-[11px] text-slate-600">
                        {activeProfile.allowedGrammar.join(' • ')}
                      </span>
                    </div>
                  </div>

                  {/* Starter Phrases with Listen Button */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                      <span>عبارات وجمل مقترحة تقدر تبدا بيها المحادثة مع الـ AI:</span>
                      <span className="text-[10px] text-slate-400">انقر على 🔊 لسماع النطق</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {activeProfile.starterPrompts.map((p, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-slate-200 rounded-xl p-2 flex items-center justify-between gap-2 hover:border-amber-300 transition-colors"
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">
                              {p.german}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate">
                              {p.darija}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSpeakPhrase(p.german)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 transition-colors shrink-0 cursor-pointer"
                            title="سماع النطق الألماني الصحيح"
                          >
                            <Volume2
                              className={`w-3.5 h-3.5 ${
                                playingPhrase === p.german ? 'text-amber-600 animate-pulse' : ''
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* General Unlinked Conversation Controls */
        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">المستوى العام (Tutor-Niveau):</span>
              <div className="flex items-center gap-1.5">
                {(['A1', 'A2', 'B1'] as GermanLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    disabled={disabled}
                    onClick={() => setSelectedLevel(lvl)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedLevel === lvl
                        ? lvl === 'A1'
                          ? 'bg-emerald-600 text-white'
                          : lvl === 'A2'
                          ? 'bg-sky-600 text-white'
                          : 'bg-indigo-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-[11px] text-slate-500">
              {selectedLevel === 'A1' && 'A1: جمل بسيطة وقصيرة'}
              {selectedLevel === 'A2' && 'A2: مواضيع يومية وجمل مع weil'}
              {selectedLevel === 'B1' && 'B1: نقاش، آراء ومصطلحات متنوعة'}
            </span>
          </div>
          <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            في هذا النمط، يمكنك الحديث بحرية عن أي موضوع دون التقيد بفصل أو كتاب معين.
          </p>
        </div>
      )}
    </div>
  );
};
