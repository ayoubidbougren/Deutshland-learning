import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Headphones,
  Check,
  BookOpen,
  ListChecks,
  Disc3,
  FastForward,
  Rewind,
  ExternalLink,
  FileText,
} from 'lucide-react';
import {
  ListeningExerciseItem,
  ListeningBookTask,
} from '../../types/bookCourse';
import { PdfPageScreenView } from './PdfPageScreenView';
import { arrangeOptionsByAnswer, arrangeOptionsByIndex } from '../../utils/shuffleOptions';

interface ListeningStageViewProps {
  exercises: ListeningExerciseItem[];
  dayNumber: number;
  lessonNumber: number;
  onCompleteStage: () => void;
  isStageCompleted: boolean;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: any;
  }
}

export const ListeningStageView: React.FC<ListeningStageViewProps> = ({
  exercises,
  dayNumber,
  lessonNumber,
  onCompleteStage,
  isStageCompleted,
}) => {
  const [currentExIndex, setCurrentExIndex] = useState(0);

  // 3 Dedicated Sections: Audio CD Track, Book Tasks, Comprehension Questions
  const [activeSection, setActiveSection] = useState<'playlist' | 'tasks' | 'questions'>('playlist');

  // Audio Playback State
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.9);
  const [volume, setVolume] = useState<number>(90);
  const [isMuted, setIsMuted] = useState(false);

  // Background YouTube Audio Player state
  const [isYtReady, setIsYtReady] = useState(false);
  const [isYtPlaying, setIsYtPlaying] = useState(false);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(65);

  // Book tasks interactive state
  const [selectedTaskAnswers, setSelectedTaskAnswers] = useState<Record<string, string>>({});
  const [checkedTaskItems, setCheckedTaskItems] = useState<Record<string, boolean>>({});

  // Questions interactive state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({});

  const ytPlayerRef = useRef<any>(null);

  // Reset selected audio index when dayNumber changes
  useEffect(() => {
    setCurrentExIndex(0);
    setActiveSection('playlist');
  }, [dayNumber]);

  const normalizedExercises = React.useMemo(
    () =>
      exercises.map((ex) => ({
        ...ex,
        bookTasks: (ex.bookTasks || []).map((task) => ({
          ...task,
          items: task.items.map((item, itemIdx) => ({
            ...item,
            options: arrangeOptionsByAnswer(item.options, item.correctAnswer, itemIdx, task.id),
          })),
        })),
        questions: (ex.questions || []).map((q, qIdx) => {
          const arranged = arrangeOptionsByIndex(q.options, q.correctIndex, qIdx, ex.id);
          return {
            ...q,
            options: arranged.options,
            correctIndex: arranged.correctIndex,
          };
        }),
      })),
    [exercises]
  );

  const currentExercise = normalizedExercises[currentExIndex] || normalizedExercises[0];

  // Stop CD (YouTube) audio
  const stopCdAudio = () => {
    if (ytPlayerRef.current && isYtReady) {
      try {
        ytPlayerRef.current.pauseVideo();
      } catch (e) {
        // ignore
      }
    }
    setIsYtPlaying(false);
  };

  const stopAllAudio = () => {
    stopCdAudio();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleToggleMasterPlay = () => {
    handleToggleCdPlay();
  };

  const handleMasterReplay = () => {
    handleReplayCd();
  };

  const handleMasterSkip = (delta: number) => {
    handleSkipSeconds(delta * 5);
  };

  // Initialize and load YouTube IFrame API for current audio track
  useEffect(() => {
    let isMounted = true;
    setIsYtReady(false);
    setIsYtPlaying(false);
    setCurrentAudioTime(0);

    const videoId = currentExercise?.youtubeVideoId;
    if (!videoId) return;

    function createPlayer() {
      if (!window.YT || !window.YT.Player) return;
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch (e) {}
        ytPlayerRef.current = null;
      }

      try {
        ytPlayerRef.current = new window.YT.Player('hidden-yt-audio-element', {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: {
            autoplay: 0,
            controls: 1,
            rel: 0,
            playsinline: 1,
            modestbranding: 1,
          },
          events: {
            onReady: (event: any) => {
              if (!isMounted) return;
              setIsYtReady(true);
              try {
                event.target.setPlaybackRate(playbackSpeed);
                event.target.setVolume(isMuted ? 0 : volume);
                const dur = event.target.getDuration();
                if (dur && dur > 0) setTotalDuration(dur);
              } catch (e) {}
            },
            onStateChange: (event: any) => {
              if (!isMounted) return;
              if (event.data === 1) {
                setIsYtPlaying(true);
              } else if (event.data === 2 || event.data === 0) {
                setIsYtPlaying(false);
              }
            },
          },
        });
      } catch (err) {
        console.warn('Error creating YT player:', err);
      }
    }

    if (typeof window !== 'undefined') {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
        window.onYouTubeIframeAPIReady = () => {
          if (isMounted) createPlayer();
        };
      } else {
        createPlayer();
      }
    }

    return () => {
      isMounted = false;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch (e) {}
        ytPlayerRef.current = null;
      }
    };
  }, [currentExIndex, currentExercise?.youtubeVideoId]);

  // Audio timer interval when CD track is playing
  useEffect(() => {
    let interval: any = null;
    if (isYtPlaying && ytPlayerRef.current) {
      interval = setInterval(() => {
        try {
          const cur = ytPlayerRef.current.getCurrentTime();
          const dur = ytPlayerRef.current.getDuration();
          if (typeof cur === 'number') setCurrentAudioTime(cur);
          if (typeof dur === 'number' && dur > 0) setTotalDuration(dur);
        } catch (e) {}
      }, 250);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isYtPlaying]);

  // Handle Play/Pause toggle for CD audio
  const handleToggleCdPlay = () => {
    if (ytPlayerRef.current && isYtReady) {
      try {
        if (isYtPlaying) {
          ytPlayerRef.current.pauseVideo();
          setIsYtPlaying(false);
        } else {
          ytPlayerRef.current.playVideo();
          setIsYtPlaying(true);
        }
      } catch (e) {
        console.warn('Playback error:', e);
      }
    }
  };

  // Handle Scrubber seek
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentAudioTime(newTime);
    if (ytPlayerRef.current && isYtReady) {
      try {
        ytPlayerRef.current.seekTo(newTime, true);
      } catch (e) {}
    }
  };

  // Skip 5 seconds back or forward
  const handleSkipSeconds = (seconds: number) => {
    if (ytPlayerRef.current && isYtReady) {
      try {
        const cur = ytPlayerRef.current.getCurrentTime() || 0;
        const target = Math.max(0, Math.min(totalDuration, cur + seconds));
        ytPlayerRef.current.seekTo(target, true);
        setCurrentAudioTime(target);
      } catch (e) {}
    }
  };

  // Replay from beginning
  const handleReplayCd = () => {
    if (ytPlayerRef.current && isYtReady) {
      try {
        ytPlayerRef.current.seekTo(0, true);
        ytPlayerRef.current.playVideo();
        setCurrentAudioTime(0);
        setIsYtPlaying(true);
      } catch (e) {}
    }
  };

  // Update speed
  const handleSpeedChange = (spd: number) => {
    setPlaybackSpeed(spd);
    if (ytPlayerRef.current && isYtReady) {
      try {
        ytPlayerRef.current.setPlaybackRate(spd);
      } catch (e) {}
    }
  };

  // Update volume
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (ytPlayerRef.current && isYtReady) {
      try {
        ytPlayerRef.current.setVolume(newVol);
      } catch (e) {}
    }
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (ytPlayerRef.current && isYtReady) {
        try {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(volume || 80);
        } catch (e) {}
      }
    } else {
      setIsMuted(true);
      if (ytPlayerRef.current && isYtReady) {
        try {
          ytPlayerRef.current.mute();
        } catch (e) {}
      }
    }
  };

  // Handle Book Task item selection
  const handleSelectTaskItem = (itemId: string, selectedOption: string) => {
    setSelectedTaskAnswers((prev) => ({ ...prev, [itemId]: selectedOption }));
    setCheckedTaskItems((prev) => ({ ...prev, [itemId]: true }));
  };

  // Handle Question option selection
  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
    setCheckedQuestions((prev) => ({ ...prev, [questionId]: true }));
  };

  // Progress metrics
  const totalBookTaskItems =
    currentExercise?.bookTasks?.reduce((acc, t) => acc + t.items.length, 0) || 0;
  const answeredBookTaskItems =
    currentExercise?.bookTasks?.reduce(
      (acc, t) => acc + t.items.filter((item) => checkedTaskItems[item.id]).length,
      0
    ) || 0;

  const totalQuestions = currentExercise?.questions?.length || 0;
  const answeredQuestionsCount =
    currentExercise?.questions?.filter((q) => checkedQuestions[q.id]).length || 0;
  const correctQuestionsCount =
    currentExercise?.questions?.filter((q) => selectedAnswers[q.id] === q.correctIndex).length || 0;

  const allExercisesCompleted =
    Boolean(isStageCompleted) ||
    normalizedExercises.some(
      (ex) =>
        (ex.bookTasks &&
          ex.bookTasks.length > 0 &&
          ex.bookTasks.some((t) => t.items.every((item) => checkedTaskItems[item.id]))) ||
        (ex.questions && ex.questions.length > 0 && ex.questions.every((q) => checkedQuestions[q.id]))
    );

  // Mini Audio Bar for Tasks & Questions views so the learner can listen while answering
  const isAnyAudioPlaying = isYtPlaying;

  const renderMiniAudioBar = () => (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 text-white px-4 py-3 rounded-2xl border border-slate-800 shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
          <Disc3 className={`w-5 h-5 ${isAnyAudioPlaying ? 'animate-spin' : ''}`} />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-amber-300">
              {currentExercise.audioTrackLabel || `Track • Seite ${currentExercise.pageNumber}`}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              صفحة {currentExercise.pageNumber}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              💿 تسجيل الأسطوانة
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-xs">
            {currentExercise.titleDe}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleMasterSkip(-1)}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer text-xs"
          title="رجوع 5 ثوانٍ"
        >
          <Rewind className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={handleToggleMasterPlay}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          {isAnyAudioPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>إيقاف</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>تشغيل الأسطوانة</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleMasterSkip(1)}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer text-xs"
          title="تقديم 5 ثوانٍ"
        >
          <FastForward className="w-3.5 h-3.5" />
        </button>

        <span className="text-xs font-mono text-slate-400 px-1 hidden sm:inline">
          {formatTime(currentAudioTime)} / {formatTime(totalDuration || 65)}
        </span>

        <button
          type="button"
          onClick={() => setActiveSection('playlist')}
          className="text-xs font-bold text-amber-400 hover:text-amber-300 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 transition-colors"
        >
          المشغل الكامل ↗
        </button>
      </div>
    </div>
  );

  // Reusable Authentic Book Tasks Renderer (shown directly under Audio Player & under PDF Screen)
  const renderBookTasksSection = () => {
    if (!currentExercise.bookTasks || currentExercise.bookTasks.length === 0) return null;
    return (
      <div className="space-y-4 pt-4 border-t border-amber-200/60">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black text-base flex items-center justify-center shadow-xs shrink-0">
              ✍️
            </span>
            <div>
              <h4 className="text-base font-black text-slate-900">
                تمارين الكتاب الخاصة بهذا الأوديو (Aufgaben • Kursbuch Seite {currentExercise.pageNumber})
              </h4>
              <p className="text-xs text-slate-500">
                أجب عن تمارين الكتاب الأصلية المأخوذة مباشرة من الصفحة {currentExercise.pageNumber} أثناء الاستماع للأوديو
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            تمرين الصفحة {currentExercise.pageNumber}
          </span>
        </div>

        <div className="space-y-4">
          {currentExercise.bookTasks.map((task: ListeningBookTask, tIdx: number) => (
            <div
              key={task.id}
              className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4"
            >
              <div className="border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 font-black text-xs flex items-center justify-center shrink-0">
                    {tIdx + 1}
                  </span>
                  <h5 dir="ltr" className="text-sm sm:text-base font-bold text-slate-900 text-left">
                    {task.titleDe}
                  </h5>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">{task.titleAr}</p>
                <div className="mt-2 text-xs bg-slate-50 border border-slate-200/70 p-2.5 rounded-xl text-slate-700">
                  <span className="font-bold">التعليمات: </span>
                  <span>{task.instructionAr} ({task.instructionDe})</span>
                </div>
              </div>

              {/* Task Items */}
              <div className="space-y-3">
                {task.items.map((item, itemIdx) => {
                  const selectedAns = selectedTaskAnswers[item.id];
                  const isChecked = checkedTaskItems[item.id];
                  const isCorrect = selectedAns === item.correctAnswer;

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border transition-all space-y-2.5 ${
                        isChecked
                          ? isCorrect
                            ? 'border-emerald-300 bg-emerald-50/50'
                            : 'border-rose-300 bg-rose-50/50'
                          : 'border-slate-200 bg-slate-50/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="space-y-1">
                          <span dir="ltr" className="text-xs sm:text-sm font-bold text-slate-900 block text-left whitespace-pre-line">
                            {item.labelDe}
                          </span>
                          {item.labelAr && (
                            <span className="text-[11px] text-slate-500 font-medium block">
                              {item.labelAr}
                            </span>
                          )}
                        </div>

                        {isChecked && (
                          <div className="shrink-0 flex items-center gap-1 text-xs font-bold">
                            {isCorrect ? (
                              <span className="text-emerald-700 flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>صحيح</span>
                              </span>
                            ) : (
                              <span className="text-rose-700 flex items-center gap-1 bg-rose-100 px-2 py-0.5 rounded-full">
                                <XCircle className="w-3.5 h-3.5" />
                                <span>خطأ</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Options Grid */}
                      <div dir="ltr" className="grid sm:grid-cols-3 gap-2">
                        {item.options.map((opt) => {
                          const isOptSelected = selectedAns === opt;
                          let btnStyle = 'border-slate-200 bg-white text-slate-700 hover:border-slate-300';

                          if (isChecked) {
                            if (opt === item.correctAnswer) {
                              btnStyle = 'border-emerald-500 bg-emerald-500 text-white font-bold';
                            } else if (isOptSelected) {
                              btnStyle = 'border-rose-400 bg-rose-100 text-rose-800';
                            } else {
                              btnStyle = 'border-slate-200 bg-white text-slate-400 opacity-60';
                            }
                          } else if (isOptSelected) {
                            btnStyle = 'border-amber-500 bg-amber-50 text-amber-950 font-bold';
                          }

                          return (
                            <button
                              key={opt}
                              type="button"
                              disabled={isChecked}
                              onClick={() => handleSelectTaskItem(item.id, opt)}
                              className={`p-2.5 rounded-xl border text-xs text-center transition-all cursor-pointer ${btnStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation if checked */}
                      {isChecked && item.explanation && (
                        <div className="text-[11px] text-slate-600 bg-white/80 p-2 rounded-lg border border-slate-200/60 flex items-start gap-1.5">
                          <span className="text-amber-600 font-bold shrink-0">💡</span>
                          <span>{item.explanation}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-7 shadow-sm space-y-6">
      {/* Hidden offscreen YouTube IFrame element acting purely as background audio stream */}
      <div
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '-9999px',
          width: '200px',
          height: '200px',
          opacity: 0.01,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <div id="hidden-yt-audio-element" />
      </div>

      {/* Top Header with Multi-Track Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 shrink-0 shadow-2xs">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Hörverstehen • تدريب الاستماع والفهم (DaF kompakt A1)
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              أسطوانة الاستماع الرسمية لكتاب DaF kompakt neu A1 • اليوم {dayNumber}
            </p>
          </div>
        </div>

        {/* Quick Audio Track Indicator */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto border border-slate-200">
          <Disc3 className="w-4 h-4 text-amber-500 shrink-0" />
          <span>الأوديو {currentExIndex + 1} من {exercises.length}</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EXPLICIT AUDIO SELECTOR BAR: ORDERED STRICTLY LEFT TO RIGHT (dir="ltr")   */}
      {/* ========================================================================= */}
      {exercises.length >= 1 && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-3.5 sm:p-4 shadow-md border border-slate-800 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold px-1 text-slate-300">
            <span className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-amber-400" />
              <span>
                {exercises.length === 1
                  ? 'مقطع الاستماع الوحيد في هذه الحصة (حسب صفحة الكتاب):'
                  : `مقاطع الاستماع لهذه الحصة (${exercises.length} أوديوات مرتبة من اليسار لليمين حسب الكتاب):`}
              </span>
            </span>
            <span className="text-[11px] text-amber-300 font-mono">
              🔊 مرتبة من اليسار لليمين (1 → {exercises.length})
            </span>
          </div>

          <div
            dir="ltr"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 text-left"
          >
            {exercises.map((ex, idx) => {
              const isSelected = currentExIndex === idx;
              const isExDone =
                ex.bookTasks &&
                ex.bookTasks.length > 0 &&
                ex.bookTasks.every((t) => t.items.every((item) => checkedTaskItems[item.id]));
              const shortLabel = ex.audioTrackLabel?.split('•')[0]?.trim() || `Audio ${idx + 1}`;
              return (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => {
                    stopAllAudio();
                    setCurrentExIndex(idx);
                  }}
                  className={`p-3 rounded-xl text-left transition-all border flex items-center gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md ring-2 ring-amber-300 font-bold'
                      : 'bg-slate-800/80 hover:bg-slate-700/80 text-white border-slate-700/80 hover:border-slate-600'
                  }`}
                >
                  <div className="shrink-0">
                    {isExDone ? (
                      <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shadow-xs">
                        <Check className="w-4 h-4" />
                      </span>
                    ) : (
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                          isSelected
                            ? 'bg-slate-950 text-amber-400'
                            : 'bg-slate-700 text-slate-200'
                        }`}
                      >
                        {idx + 1}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded ${
                          isSelected
                            ? 'bg-slate-950 text-amber-300'
                            : 'bg-slate-900 text-amber-400 border border-slate-700'
                        }`}
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{shortLabel}</span>
                      </span>
                      <span className={`text-[10px] font-bold ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                        Seite {ex.pageNumber} (ص {ex.pageNumber})
                      </span>
                    </div>
                    <p
                      dir="rtl"
                      className={`text-xs font-bold truncate leading-tight text-right ${
                        isSelected ? 'text-slate-950' : 'text-slate-100'
                      }`}
                    >
                      {ex.titleAr || ex.titleDe}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3 CLEAN SECTIONS TABS:                                                   */}
      {/* 1. أوديو أسطوانة الكتاب (Audio CD)                                        */}
      {/* 2. تمارين الكتاب (Übungen)                                                */}
      {/* 3. أسئلة الفهم (Fragen)                                                   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Tab 1: Audio CD Playlist */}
        <button
          type="button"
          onClick={() => setActiveSection('playlist')}
          className={`py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSection === 'playlist'
              ? 'bg-slate-900 text-white shadow-md border border-slate-900 ring-2 ring-amber-400/50'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Disc3 className="w-4 h-4 text-amber-400" />
          <span>1. أوديو أسطوانة الكتاب (Audio CD)</span>
        </button>

        {/* Tab 2: Book PDF Page Screen */}
        <button
          type="button"
          onClick={() => setActiveSection('tasks')}
          className={`py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSection === 'tasks'
              ? 'bg-amber-500 text-slate-950 shadow-md border border-amber-500 ring-2 ring-amber-400/50 font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <FileText className="w-4 h-4 text-slate-950" />
          <span>2. سكرين صفحة الـ PDF (ص {currentExercise.pageNumber})</span>
        </button>

        {/* Tab 3: Book Hören Exercises */}
        <button
          type="button"
          onClick={() => setActiveSection('questions')}
          className={`py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSection === 'questions'
              ? 'bg-sky-600 text-white shadow-md border border-sky-600 ring-2 ring-sky-400/50 font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <ListChecks className="w-4 h-4 text-sky-200" />
          <span>3. تمارين الـ Hören (Übungen)</span>
          {totalBookTaskItems > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 font-bold">
              {answeredBookTaskItems}/{totalBookTaskItems}
            </span>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: أسطوانة وبلايليست الكتاب (Dedicated Audio Room)                */}
      {/* ========================================================================= */}
      {activeSection === 'playlist' && (
        <div className="space-y-5">
          {/* Audio Player Card */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-5 sm:p-7 text-white shadow-xl border border-slate-800 space-y-5">
            {/* Audio Player Header & Track Info */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  {isAnyAudioPlaying && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      isAnyAudioPlaying ? 'bg-amber-400' : 'bg-slate-600'
                    }`}
                  />
                </span>
                <span className="text-xs font-bold text-amber-400">
                  {currentExercise.audioTrackLabel || `Track • Seite ${currentExercise.pageNumber}`}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-300 font-medium">
                  تسجيل أسطوانة الكتاب الرسمي (YouTube CD Track)
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>صفحة <span className="text-amber-400 font-bold">{currentExercise.pageNumber}</span> من الكتاب</span>
                {currentExercise.youtubeVideoId && (
                  <a
                    href={`https://www.youtube.com/watch?v=${currentExercise.youtubeVideoId}&list=${currentExercise.youtubePlaylistId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 font-bold"
                  >
                    <span>فتح في يوتيوب</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Central Audio Visualizer & Track Information */}
            <div className="flex flex-col md:flex-row items-center gap-5 sm:gap-7 py-2">
              {/* Vinyl / Compact Disc Graphic */}
              <div className="relative group shrink-0">
                <div
                  className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-slate-800/90 bg-gradient-to-tr from-slate-900 via-neutral-900 to-slate-950 shadow-2xl flex items-center justify-center relative overflow-hidden transition-transform ${
                    isAnyAudioPlaying ? 'animate-spin' : ''
                  }`}
                  style={{ animationDuration: '6s' }}
                >
                  <div className="absolute inset-2 rounded-full border border-slate-800/40" />
                  <div className="absolute inset-4 rounded-full border border-slate-800/50" />
                  <div className="absolute inset-6 rounded-full border border-slate-800/60" />
                  <div className="absolute inset-8 rounded-full border border-slate-800/70" />

                  {/* Center Disc Label */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex flex-col items-center justify-center font-black shadow-inner border-2 border-slate-900">
                    <span className="text-[9px] uppercase tracking-tighter">
                      DaF A1
                    </span>
                    <span className="text-[10px] leading-none">
                      CD
                    </span>
                  </div>
                </div>

                {isAnyAudioPlaying && (
                  <div className="absolute -inset-1 rounded-full bg-amber-500/20 blur-md -z-10 animate-pulse" />
                )}
              </div>

              {/* Track Info & Equalizer Waves */}
              <div className="flex-1 text-center md:text-right space-y-2 min-w-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-amber-300">
                  <Headphones className="w-3.5 h-3.5 text-amber-400" />
                  <span>تسجيل صوتي رسمي من أسطوانة الكتاب DaF kompakt A1</span>
                </div>

                <h4 className="text-base sm:text-xl font-bold text-white tracking-wide truncate">
                  {currentExercise.titleDe}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  {currentExercise.titleAr}
                </p>

                {/* Sound Bars */}
                <div className="flex items-center justify-center md:justify-start gap-1 pt-2 h-7">
                  {[4, 8, 12, 16, 10, 6, 14, 18, 11, 7, 15, 9, 5, 13].map((height, i) => (
                    <span
                      key={i}
                      className={`w-1 rounded-full bg-gradient-to-t from-amber-500 to-amber-300 transition-all ${
                        isAnyAudioPlaying ? 'animate-pulse' : 'opacity-30'
                      }`}
                      style={{
                        height: isAnyAudioPlaying ? `${height + (i % 3) * 3}px` : '4px',
                        animationDelay: `${i * 90}ms`,
                        animationDuration: '600ms',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Audio Timeline & Interactive Scrubber Slider */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>{formatTime(currentAudioTime)}</span>
                <span>{formatTime(totalDuration || 65)}</span>
              </div>

              <div className="relative flex items-center">
                <input
                  type="range"
                  min="0"
                  max={totalDuration || 65}
                  step="0.5"
                  value={currentAudioTime}
                  onChange={handleScrubberChange}
                  className="w-full h-2 rounded-lg bg-slate-800 accent-amber-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Player Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              {/* Main Controls: Replay, Skip Prev, Master Play/Pause, Skip Next */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleMasterReplay}
                  className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
                  title="إعادة من البداية"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleMasterSkip(-1)}
                  className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  title="رجوع 5 ثوانٍ"
                >
                  <Rewind className="w-3.5 h-3.5" />
                  <span>-5s</span>
                </button>

                {/* Primary Master Play/Pause Button */}
                <button
                  type="button"
                  onClick={handleToggleMasterPlay}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                  title="تشغيل المقطع الصوتي"
                >
                  {isAnyAudioPlaying ? (
                    <>
                      <Pause className="w-5 h-5 fill-current" />
                      <span>إيقاف مؤقت</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current" />
                      <span>تشغيل أسطوانة الكتاب (CD)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleMasterSkip(1)}
                  className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  title="تقديم 5 ثوانٍ"
                >
                  <span>+5s</span>
                  <FastForward className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Speed & Volume Controls */}
              <div className="flex items-center gap-3">
                {/* Speed Pills */}
                <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
                  {[0.75, 0.9, 1.0].map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => handleSpeedChange(spd)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        playbackSpeed === spd
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {spd === 0.75 ? '0.75x بطيء' : spd === 0.9 ? '0.9x مريح' : '1.0x أصلي'}
                    </button>
                  ))}
                </div>

                {/* Volume Control */}
                <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700">
                  <button
                    type="button"
                    onClick={handleToggleMute}
                    className="text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4 text-rose-400" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                    className="w-16 h-1.5 rounded-lg bg-slate-700 accent-amber-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Situation Context Card */}
          <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 shadow-xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-lg shrink-0">
              📌
            </div>
            <div>
              <span className="text-xs font-bold text-amber-900 uppercase">سياق الاستماع والموقف (Die Situation):</span>
              <p className="text-sm text-slate-800 font-medium mt-1 leading-relaxed">{currentExercise.situationAr}</p>
              {currentExercise.situationDe && (
                <p className="text-xs text-slate-500 mt-1 italic font-serif">{currentExercise.situationDe}</p>
              )}
            </div>
          </div>

          {/* Darija Tip Card */}
          {currentExercise.tipDarija && (
            <div className="rounded-2xl bg-amber-50 border border-amber-200/90 p-4 flex items-start gap-3">
              <span className="text-2xl shrink-0">💡</span>
              <div>
                <span className="text-xs font-bold text-amber-950 block">نصيحة الأستاذ للاستماع بالدارجة:</span>
                <p className="text-xs text-amber-900 leading-relaxed mt-0.5">{currentExercise.tipDarija}</p>
              </div>
            </div>
          )}

          {/* Interactive Book Exercises directly below the Audio Player */}
          {renderBookTasksSection()}

          {/* Quick Actions to Switch to PDF Page or Questions */}
          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveSection('tasks')}
              className="p-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-between gap-2 shadow-xs transition-all cursor-pointer"
            >
              <span>جاهز لمطالعة صفحة الكتاب؟ انتقل إلى 2. سكرين صفحة الـ PDF (ص {currentExercise.pageNumber})</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('questions')}
              className="p-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs sm:text-sm flex items-center justify-between gap-2 shadow-xs transition-all cursor-pointer"
            >
              <span>انتقل إلى 3. تمارين الـ Hören (Übungen)</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* SECTION 2: سكرين صفحة الـ PDF للكتاب ورابط الصفحة (Kursbuch PDF Screen) */}
      {/* ======================================================================= */}
      {activeSection === 'tasks' && (
        <div className="space-y-5 rounded-2xl border border-amber-200/70 bg-amber-50/20 p-5 sm:p-6">
          {/* Sticky Mini Audio Bar so learner can play/pause while reading the PDF page */}
          {renderMiniAudioBar()}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950">
                  {currentExercise.audioTrackLabel || `Track • Seite ${currentExercise.pageNumber}`}
                </span>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-5 h-5 text-amber-600" />
                  <span>صفحة الـ PDF الرسمية للكتاب (Kursbuch Seite {currentExercise.pageNumber})</span>
                </h4>
              </div>
              <p className="text-xs text-slate-600">
                {currentExercise.titleAr} • طالع صفحة الكتاب الأصلية وافتح ملف الـ PDF مباشرة أو اقرأ النسخة الرقمية المطابقة للواقع.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-bold text-amber-900 px-3 py-1 bg-amber-100 rounded-full border border-amber-300">
                الصفحة {currentExercise.pageNumber} من الكتاب
              </span>
            </div>
          </div>

          {/* Authentic Kursbuch PDF Page Viewer & Screen ONLY */}
          <PdfPageScreenView
            pageNumber={currentExercise.pageNumber}
            lessonNumber={lessonNumber}
            currentTrackLabel={currentExercise.audioTrackLabel}
            youtubeVideoId={currentExercise.youtubeVideoId}
            hasPracticeQuestions={false}
          />

          {/* Bottom switcher with Audio Navigation */}
          <div className="flex flex-wrap justify-between items-center gap-2 pt-3 border-t border-amber-200/50">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveSection('playlist')}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-xl bg-white border border-slate-200 cursor-pointer"
              >
                ← الاستماع للأوديو كاملاً
              </button>
              {currentExIndex > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    stopAllAudio();
                    setCurrentExIndex(currentExIndex - 1);
                  }}
                  className="text-xs font-bold text-slate-700 hover:text-slate-950 px-3 py-2 rounded-xl bg-white border border-slate-300 cursor-pointer flex items-center gap-1"
                >
                  <span>⏮ الأوديو السابق ({exercises[currentExIndex - 1]?.audioTrackLabel?.split('•')[0]?.trim() || `Audio ${currentExIndex}`})</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveSection('questions')}
                className="text-xs font-black text-white px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>انتقل إلى 3. تمارين الـ Hören من الكتاب</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
              {currentExIndex < exercises.length - 1 && (
                <button
                  type="button"
                  onClick={() => {
                    stopAllAudio();
                    setCurrentExIndex(currentExIndex + 1);
                  }}
                  className="text-xs font-black text-amber-950 bg-amber-400 hover:bg-amber-300 px-3.5 py-2.5 rounded-xl flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <span>الأوديو التالي ({exercises[currentExIndex + 1]?.audioTrackLabel?.split('•')[0]?.trim() || `Audio ${currentExIndex + 2}`}) ⏭</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* SECTION 3: تمارين الـ Hören من الكتاب كما هي (Original Hören-Übungen)    */}
      {/* ======================================================================= */}
      {activeSection === 'questions' && (
        <div className="space-y-5 rounded-2xl border border-sky-200/70 bg-sky-50/20 p-5 sm:p-6">
          {/* Sticky Mini Audio Bar so learner can listen while solving book tasks */}
          {renderMiniAudioBar()}

          {/* Verbatim Book Hören Exercises */}
          {renderBookTasksSection()}

          {/* Bottom switcher with Inter-Audio Navigation */}
          <div className="flex flex-wrap justify-between items-center gap-2 pt-3 border-t border-sky-200/50">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveSection('tasks')}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-xl bg-white border border-slate-200 cursor-pointer"
              >
                ← عرض سكرين صفحة الـ PDF (ص {currentExercise.pageNumber})
              </button>
              {currentExIndex > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    stopAllAudio();
                    setCurrentExIndex(currentExIndex - 1);
                  }}
                  className="text-xs font-bold text-slate-700 hover:text-slate-950 px-3 py-2 rounded-xl bg-white border border-slate-300 cursor-pointer flex items-center gap-1"
                >
                  <span>⏮ الأوديو السابق ({exercises[currentExIndex - 1]?.audioTrackLabel?.split('•')[0]?.trim() || `Audio ${currentExIndex}`})</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveSection('playlist')}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 cursor-pointer"
              >
                مشغل الأوديو الكامل ↗
              </button>
              {currentExIndex < exercises.length - 1 && (
                <button
                  type="button"
                  onClick={() => {
                    stopAllAudio();
                    setCurrentExIndex(currentExIndex + 1);
                    setActiveSection('playlist');
                  }}
                  className="text-xs font-black text-amber-950 bg-amber-400 hover:bg-amber-300 px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>الانتقال للأوديو التالي ({exercises[currentExIndex + 1]?.audioTrackLabel?.split('•')[0]?.trim() || `Audio ${currentExIndex + 2}`})</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Completion & Next Stage Action Footer */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500">
          {!allExercisesCompleted ? (
            <span className="text-amber-800 font-medium">
              🔒 يرجى الإجابة على أسئلة الاستماع أولاً للانتقال إلى مرحلة تمارين الذكاء الاصطناعي (6. AI Exercises).
            </span>
          ) : (
            <span className="text-emerald-700 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>ممتاز! أكملت تدريب الاستماع، يمكنك الآن الانتقال للمرحلة التالية.</span>
            </span>
          )}
        </div>

        <button
          onClick={onCompleteStage}
          disabled={!allExercisesCompleted}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
            allExercisesCompleted
              ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 cursor-pointer'
              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed select-none'
          }`}
        >
          <span>المرحلة التالية: 6. AI Exercises</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
};
