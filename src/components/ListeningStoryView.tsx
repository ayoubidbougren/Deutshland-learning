import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Eye,
  EyeOff,
  Volume2,
  BookOpen,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Layers,
  Clock,
  Wand2,
  FileEdit,
  Repeat,
  Loader2,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GermanLevel, ListeningStory, SAMPLE_STORIES, StoryQuestion, StoryVocabulary } from '../types';

interface ListeningStoryViewProps {
  selectedLevel: GermanLevel;
  onLevelChange?: (level: GermanLevel) => void;
}

// Helper to split a long German text into readable sentences
function splitIntoSentences(text: string): string[] {
  if (!text) return [];
  // Split on punctuation followed by space or newline, while keeping punctuation
  const matches = text.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g);
  if (!matches) return [text];
  return matches.map((s) => s.trim()).filter(Boolean);
}

export const ListeningStoryView: React.FC<ListeningStoryViewProps> = ({
  selectedLevel,
}) => {
  // Story selection: preset story id OR 'custom'
  const [activeStoryId, setActiveStoryId] = useState<string>(SAMPLE_STORIES[0].id);
  const [filterLevel, setFilterLevel] = useState<GermanLevel | 'ALL'>('ALL');

  // Custom story state
  const [customTitle, setCustomTitle] = useState<string>('Mein deutscher Text');
  const [customText, setCustomText] = useState<string>(
    `An einem schönen Herbstmorgen beschloss Paul, durch den Wald spazieren zu gehen. Die Blätter an den Bäumen leuchteten in warmen Gelb- und Rottönen. Unter seinen Schuhen knisterte das trockene Laub. Plötzlich hörte er ein leises Rascheln im Gebüsch. Ein kleines rotes Eichhörnchen kletterte flink an einer alten Eiche hinauf und beobachtete ihn mit neugierigen Augen. Paul lächelte, atmete tief durch und genoss die friedliche Stille der Natur.`
  );
  const [customLevel, setCustomLevel] = useState<GermanLevel>('A2');
  const [customVocab, setCustomVocab] = useState<StoryVocabulary[]>([]);
  const [customQuestions, setCustomQuestions] = useState<StoryQuestion[]>([]);
  const [isAnalyzingCustom, setIsAnalyzingCustom] = useState<boolean>(false);
  const [customSummaryAr, setCustomSummaryAr] = useState<string>('');

  // Audio Engine: 'browser' (instant, unlimited, 0 quota) vs 'gemini' (Gemini AI TTS, max 3 RPM on free tier)
  const [speechEngine, setSpeechEngine] = useState<'browser' | 'gemini'>('browser');
  const [rateLimitNotice, setRateLimitNotice] = useState<string | null>(null);

  // Playback settings
  const [voice, setVoice] = useState<string>('Zephyr');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [playMode, setPlayMode] = useState<'continuous' | 'stepByStep'>('stepByStep');
  const [isBlindMode, setIsBlindMode] = useState<boolean>(false); // Hide text for pure listening practice
  const [pacingMode, setPacingMode] = useState<'normal' | 'learning'>('learning'); // Adds clear articulation

  // Active playing state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [audioProgress, setAudioProgress] = useState<number>(0); // 0 to 100
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Audio elements & cache
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCacheRef = useRef<Map<string, string>>(new Map()); // Key: cacheKey -> DataURL
  const isPlayingRef = useRef<boolean>(false);
  isPlayingRef.current = isPlaying;

  // Browser SpeechSynthesis Voices
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedBrowserVoiceName, setSelectedBrowserVoiceName] = useState<string>('');

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showQuizExplanations, setShowQuizExplanations] = useState<Record<number, boolean>>({});

  // Load and cache browser voices for German
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const all = window.speechSynthesis.getVoices();
        const deVoices = all.filter((v) => v.lang.startsWith('de') || v.lang.includes('DE'));
        setBrowserVoices(deVoices);
        if (deVoices.length > 0 && !selectedBrowserVoiceName) {
          const preferred = deVoices.find((v) => v.default) || deVoices[0];
          setSelectedBrowserVoiceName(preferred.name);
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
      return () => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.onvoiceschanged = null;
        }
      };
    }
  }, [selectedBrowserVoiceName]);

  // Helper to speak with Browser Web Speech API (zero quota, instant playback)
  const speakWithBrowser = (text: string, onEnded?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnded) onEnded();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = playbackSpeed;

    if (selectedBrowserVoiceName && browserVoices.length > 0) {
      const voiceObj = browserVoices.find((v) => v.name === selectedBrowserVoiceName);
      if (voiceObj) utterance.voice = voiceObj;
    } else if (browserVoices.length > 0) {
      utterance.voice = browserVoices[0];
    }

    utterance.onend = () => {
      if (onEnded) onEnded();
    };

    utterance.onerror = (e) => {
      console.warn('Browser SpeechSynthesis error:', e);
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Active story object
  const activeStory = useMemo<ListeningStory>(() => {
    if (activeStoryId === 'custom') {
      return {
        id: 'custom',
        title: customTitle.trim() || 'Mein Text',
        titleAr: 'نصي الخاص',
        level: customLevel,
        durationMinutes: '~2 Min',
        category: 'Eigener Text',
        description: 'نص مخصص قمت بلصقه للتدرب على الاستماع وفهم المفردات.',
        text: customText.trim(),
        vocabulary: customVocab,
        questions: customQuestions,
      };
    }
    const found = SAMPLE_STORIES.find((s) => s.id === activeStoryId);
    return found || SAMPLE_STORIES[0];
  }, [activeStoryId, customTitle, customText, customLevel, customVocab, customQuestions]);

  // Sentences of the active story
  const sentences = useMemo(() => splitIntoSentences(activeStory.text), [activeStory.text]);

  // Filtered preset stories
  const filteredStories = useMemo(() => {
    if (filterLevel === 'ALL') return SAMPLE_STORIES;
    return SAMPLE_STORIES.filter((s) => s.level === filterLevel);
  }, [filterLevel]);

  // Initialize or cleanup audio
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      if (playMode === 'continuous') {
        // In continuous mode, check if there's a next sentence
        setCurrentSentenceIndex((prev) => {
          const next = prev + 1;
          if (next < sentences.length) {
            // Slight natural pause between sentences
            setTimeout(() => {
              if (isPlayingRef.current) {
                playSentence(next);
              }
            }, 500);
            return next;
          } else {
            setIsPlaying(false);
            return 0;
          }
        });
      } else {
        // Step-by-step mode: pause after each sentence so student can digest/repeat
        setIsPlaying(false);
      }
    };

    const handleError = (e: any) => {
      console.error('Audio playback error:', e);
      setIsPlaying(false);
      setIsLoadingAudio(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audioRef.current = null;
    };
  }, [sentences, playMode]);

  // Update playback speed whenever it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Stop audio on story change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setCurrentSentenceIndex(0);
    setAudioProgress(0);
    setUserAnswers({});
    setShowQuizExplanations({});
  }, [activeStoryId]);

  // Fetch audio data url for a specific text from Gemini TTS
  const fetchAudioForText = async (text: string, selectedVoice: string, pacing: 'normal' | 'learning'): Promise<string> => {
    const cacheKey = `${selectedVoice}_${pacing}_${text.trim()}`;
    if (audioCacheRef.current.has(cacheKey)) {
      return audioCacheRef.current.get(cacheKey)!;
    }

    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        voice: selectedVoice,
        pacing,
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      if (response.status === 429 || errJson.isRateLimit || errJson.error === 'QUOTA_EXCEEDED') {
        const errorObj = new Error('QUOTA_EXCEEDED');
        (errorObj as any).isRateLimit = true;
        (errorObj as any).details = errJson.message;
        throw errorObj;
      }
      throw new Error(errJson.error || 'Fehler beim Laden des Audios');
    }

    const data = await response.json();
    const dataUrl = data.audioDataUrl;
    audioCacheRef.current.set(cacheKey, dataUrl);
    return dataUrl;
  };

  // Play a specific sentence (handles both Browser and Gemini TTS with smart fallback)
  const playSentence = async (index: number, engineOverride?: 'browser' | 'gemini') => {
    if (index < 0 || index >= sentences.length) return;
    setCurrentSentenceIndex(index);
    setErrorMessage(null);

    const currentEngine = engineOverride || speechEngine;

    // 1. Browser Web Speech Engine (Instant, unlimited, 0 quota)
    if (currentEngine === 'browser') {
      setIsLoadingAudio(false);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.pause();
      }

      speakWithBrowser(sentences[index], () => {
        if (playMode === 'continuous') {
          if (index + 1 < sentences.length) {
            setTimeout(() => {
              if (isPlayingRef.current) {
                playSentence(index + 1, 'browser');
              }
            }, 400);
          } else {
            setIsPlaying(false);
          }
        } else {
          setIsPlaying(false);
        }
      });
      return;
    }

    // 2. Gemini AI TTS Engine
    setIsLoadingAudio(true);
    try {
      const sentenceText = sentences[index];
      const audioUrl = await fetchAudioForText(sentenceText, voice, pacingMode);

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.playbackRate = playbackSpeed;
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err: any) {
      console.warn('Gemini TTS request encountered an issue:', err);

      const isQuotaLimit =
        err?.message === 'QUOTA_EXCEEDED' ||
        err?.isRateLimit ||
        String(err?.message).includes('429') ||
        String(err?.message).includes('quota') ||
        String(err?.message).includes('RESOURCE_EXHAUSTED');

      if (isQuotaLimit) {
        // Clear friendly notification and seamless automatic fallback
        setRateLimitNotice(
          'تم بلوغ الحد الأقصى لباقة Gemini المجانية (3 طلبات/دقيقة). تم التبديل تلقائياً وبسلاسة إلى نطق المتصفح الفوري (Web Speech) لضمان استمرار الاستماع دون توقف!'
        );
        setSpeechEngine('browser');
      } else {
        setErrorMessage(err.message || 'تعذر تشغيل الصوت عبر السيرفر، تم التحويل لنطق المتصفح.');
      }

      // Immediately speak with browser engine so the student hears the sentence right away!
      setIsPlaying(true);
      speakWithBrowser(sentences[index], () => {
        if (playMode === 'continuous') {
          if (index + 1 < sentences.length) {
            setTimeout(() => {
              if (isPlayingRef.current) {
                playSentence(index + 1, 'browser');
              }
            }, 400);
          } else {
            setIsPlaying(false);
          }
        } else {
          setIsPlaying(false);
        }
      });
    } finally {
      setIsLoadingAudio(false);
    }
  };

  // Toggle play/pause
  const handleTogglePlay = () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    } else {
      playSentence(currentSentenceIndex);
    }
  };

  // Skip to next sentence
  const handleNextSentence = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      const nextIndex = currentSentenceIndex + 1;
      setCurrentSentenceIndex(nextIndex);
      if (isPlaying) {
        playSentence(nextIndex);
      }
    }
  };

  // Skip to previous sentence
  const handlePrevSentence = () => {
    if (currentSentenceIndex > 0) {
      const prevIndex = currentSentenceIndex - 1;
      setCurrentSentenceIndex(prevIndex);
      if (isPlaying) {
        playSentence(prevIndex);
      }
    }
  };

  // Replay current sentence
  const handleReplayCurrent = () => {
    playSentence(currentSentenceIndex);
  };

  // Play a single vocabulary word (Always uses Browser Web Speech to avoid exhausting Gemini 3 RPM quota)
  const playVocabularyWord = (word: string) => {
    speakWithBrowser(word);
  };

  // Analyze custom text with Gemini
  const handleAnalyzeCustomText = async () => {
    if (!customText.trim()) return;
    setIsAnalyzingCustom(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/analyze-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: customText.trim(),
          level: customLevel,
        }),
      });
      if (!res.ok) {
        throw new Error('Analyse fehlgeschlagen');
      }
      const data = await res.json();
      if (data.summaryAr) setCustomSummaryAr(data.summaryAr);
      if (Array.isArray(data.vocabulary)) setCustomVocab(data.vocabulary);
      if (Array.isArray(data.questions)) setCustomQuestions(data.questions);
    } catch (err: any) {
      console.error('Error analyzing story:', err);
      setErrorMessage('فشل تحليل النص بالذكاء الاصطناعي، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsAnalyzingCustom(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Rate limit warning banner */}
      <AnimatePresence>
        {rateLimitNotice && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-amber-50 border border-amber-300 rounded-2xl p-4 shadow-sm flex items-start justify-between gap-3 text-xs text-amber-900"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-amber-950 text-sm block">
                  تنبيه حصة Gemini TTS المجانية (429 Rate Limit)
                </span>
                <p className="leading-relaxed">{rateLimitNotice}</p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-md">
                    المحرك النشط حالياً: نطق المتصفح الفوري (غير محدود ومجاني 100%)
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRateLimitNotice(null)}
              className="text-amber-700 hover:text-amber-950 p-1 cursor-pointer font-bold"
              title="إغلاق التنبيه"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner / Concept Explainer */}
      <div className="bg-gradient-to-r from-violet-700 via-indigo-700 to-sky-700 rounded-3xl p-5 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-white/15 rounded-xl backdrop-blur-xs">
              <Headphones className="w-5 h-5 text-white" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                Hörverstehen &amp; Geschichten
              </h2>
              <span className="text-[11px] text-indigo-200 block">تدريب الاستماع وفهم القصص الألمانية</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-xl leading-relaxed">
            Höre authentische deutsche Geschichten mit nativer Aussprache. Trainiere Satz für Satz, überprüfe dein Verständnis mit Quizfragen oder füge deinen eigenen Text ein.
          </p>
          <p className="text-[11px] text-indigo-200/80 max-w-xl leading-snug">
            استمع لأي قصة أو نص بالألمانية الفصحى بنطق واضح، تمرن على الاستماع جملة بجملة، واختبر فهمك بالأسئلة والمفردات.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setIsBlindMode(!isBlindMode)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold backdrop-blur-sm transition-all cursor-pointer ${
              isBlindMode
                ? 'bg-amber-400 text-amber-950 shadow-md font-bold'
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
            title="Blindmodus für pures Hörtraining wie in der Goethe-Prüfung"
          >
            {isBlindMode ? <EyeOff className="w-4 h-4 text-amber-950 shrink-0" /> : <Eye className="w-4 h-4 text-white shrink-0" />}
            <div className="text-left">
              <span className="block leading-tight">{isBlindMode ? 'Blindmodus: AN' : 'Blindmodus (Nur Hören)'}</span>
              <span className="block text-[9px] opacity-80 leading-tight">الاستماع الأعمى</span>
            </div>
          </button>
        </div>
      </div>

      {/* Story Selector Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3 text-left">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <div>
              <span className="text-xs font-bold text-slate-900 block leading-tight">Geschichte &amp; Niveau wählen:</span>
              <span className="text-[10px] text-slate-400 block leading-tight">اختر القصة أو المستوى</span>
            </div>
          </div>

          {/* Level Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['ALL', 'A1', 'A2', 'B1'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setFilterLevel(lvl)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filterLevel === lvl
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl === 'ALL' ? 'Alle (الكل)' : lvl}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setActiveStoryId('custom')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeStoryId === 'custom'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>Eigener Text / ChatGPT</span>
            </button>
          </div>
        </div>

        {/* Story Pills Carousel */}
        {activeStoryId !== 'custom' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
            {filteredStories.map((story) => {
              const isSelected = activeStoryId === story.id;
              return (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => setActiveStoryId(story.id)}
                  className={`flex flex-col text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        story.level === 'A1'
                          ? 'bg-emerald-100 text-emerald-800'
                          : story.level === 'A2'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {story.level}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {story.durationMinutes}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{story.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{story.titleAr}</p>
                </button>
              );
            })}
          </div>
        )}

        {/* Custom Text Editor if Selected */}
        {activeStoryId === 'custom' && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="w-full sm:w-1/2">
                <label className="text-[11px] font-bold text-slate-700 block mb-1">عنوان النص:</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="مثال: قصة نهاية الأسبوع، أو مقال امتحاني..."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-700">مستوى النص:</span>
                {(['A1', 'A2', 'B1'] as GermanLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setCustomLevel(lvl)}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold cursor-pointer ${
                      customLevel === lvl ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                الصق النص أو القصة هنا (بالألمانية):
              </label>
              <textarea
                rows={4}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="الصق هنا أي نص من ChatGPT أو كتاب Deutsch oder Goethe..."
                className="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-normal leading-relaxed text-slate-800"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <span className="text-[11px] text-slate-500">
                عدد الجمل: {sentences.length} | عدد الكلمات: {customText.split(/\s+/).filter(Boolean).length}
              </span>

              <button
                type="button"
                onClick={handleAnalyzeCustomText}
                disabled={isAnalyzingCustom || !customText.trim()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                {isAnalyzingCustom ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>جاري استخراج الأسئلة والمفردات...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>تحليل واستخراج الأسئلة والمفردات تلقائياً</span>
                  </>
                )}
              </button>
            </div>

            {customSummaryAr && (
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-lg p-3 text-xs text-indigo-900 leading-relaxed">
                <span className="font-bold">ملخص القصة: </span>
                {customSummaryAr}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Interactive Audio Player Console */}
      <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-5 shadow-md space-y-4">
        {/* Story Title & Meta header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  activeStory.level === 'A1'
                    ? 'bg-emerald-100 text-emerald-800'
                    : activeStory.level === 'A2'
                    ? 'bg-sky-100 text-sky-800'
                    : 'bg-indigo-100 text-indigo-800'
                }`}
              >
                {activeStory.level}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">{activeStory.title}</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{activeStory.titleAr}</p>
          </div>

          {/* Player Configuration Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Audio Engine Selector */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => {
                  setSpeechEngine('browser');
                  setRateLimitNotice(null);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  speechEngine === 'browser'
                    ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="نطق ألماني فوري وسلس من المتصفح بدون أي حدود استهلاك أو كوتا"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>نطق المتصفح (غير محدود)</span>
              </button>
              <button
                type="button"
                onClick={() => setSpeechEngine('gemini')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  speechEngine === 'gemini'
                    ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="نطق بأصوات Gemini AI الفائقة (3 طلبات/دقيقة في الباقة المجانية)"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Gemini AI (باقة 3/د)</span>
              </button>
            </div>

            {/* Play Mode Switch */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setPlayMode('stepByStep')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  playMode === 'stepByStep' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                }`}
                title="يتوقف بعد كل جملة لتكرارها واستيعابها"
              >
                جملة بجملة
              </button>
              <button
                type="button"
                onClick={() => setPlayMode('continuous')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  playMode === 'continuous' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                }`}
                title="قراءة متواصلة للنص كاملاً"
              >
                قراءة متواصلة
              </button>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-xl text-xs text-slate-700">
              <span className="text-[10px] font-bold text-slate-500">السرعة:</span>
              {[0.75, 1.0, 1.25].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-1.5 py-0.5 rounded-md font-bold transition-colors cursor-pointer ${
                    playbackSpeed === spd ? 'bg-indigo-600 text-white' : 'hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Voice selection (Gemini or Browser) */}
            {speechEngine === 'gemini' ? (
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="text-xs bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 font-medium text-slate-800 focus:outline-hidden cursor-pointer"
                title="اختر صوت الذكاء الاصطناعي Gemini"
              >
                <option value="Zephyr">Zephyr (دافئ وهادئ)</option>
                <option value="Puck">Puck (حيوي ومرح)</option>
                <option value="Charon">Charon (عميق ورزين)</option>
                <option value="Kore">Kore (واضح ومسترسل)</option>
                <option value="Fenrir">Fenrir (واثق وقوي)</option>
              </select>
            ) : (
              browserVoices.length > 0 && (
                <select
                  value={selectedBrowserVoiceName}
                  onChange={(e) => setSelectedBrowserVoiceName(e.target.value)}
                  className="text-xs bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 font-medium text-slate-800 focus:outline-hidden cursor-pointer max-w-[140px] truncate"
                  title="صوت المتصفح الألماني المتاح في جهازك"
                >
                  {browserVoices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name.replace(/(Google|Microsoft|Apple)\s*/i, '')}
                    </option>
                  ))}
                </select>
              )
            )}
          </div>
        </div>

        {/* Player Controls Centerpiece */}
        <div className="flex flex-col items-center justify-center gap-3 pt-1">
          {/* Sentence progress indicator */}
          <div className="flex items-center justify-between w-full text-xs text-slate-500 px-1">
            <span>
              الجملة <span className="font-bold text-indigo-600">{currentSentenceIndex + 1}</span> من {sentences.length}
            </span>
            <span className="text-[11px] text-slate-400">
              {playMode === 'stepByStep' ? 'وضع التعلم: وقفة بعد كل جملة' : 'وضع القراءة المستمرة'}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-200 rounded-full"
              style={{
                width: `${((currentSentenceIndex + 1) / Math.max(1, sentences.length)) * 100}%`,
              }}
            />
          </div>

          {/* Big Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-5 mt-1">
            {/* Previous Sentence */}
            <button
              type="button"
              onClick={handlePrevSentence}
              disabled={currentSentenceIndex === 0}
              className="p-3 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 transition-all cursor-pointer shadow-xs"
              title="الجملة السابقة"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            {/* Replay Current */}
            <button
              type="button"
              onClick={handleReplayCurrent}
              className="p-3 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-all cursor-pointer shadow-xs"
              title="إعادة نطق نفس الجملة"
            >
              <Repeat className="w-5 h-5 text-indigo-600" />
            </button>

            {/* Primary Play/Pause Button */}
            <button
              type="button"
              onClick={handleTogglePlay}
              disabled={isLoadingAudio}
              className={`flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-lg transition-all active:scale-95 cursor-pointer ${
                isPlaying
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30'
              }`}
            >
              {isLoadingAudio ? (
                <Loader2 className="w-7 h-7 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-7 h-7 fill-current" />
              ) : (
                <Play className="w-7 h-7 fill-current ml-1" />
              )}
            </button>

            {/* Next Sentence */}
            <button
              type="button"
              onClick={handleNextSentence}
              disabled={currentSentenceIndex >= sentences.length - 1}
              className="p-3 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 transition-all cursor-pointer shadow-xs"
              title="الجملة التالية"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error message banner if any */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800">
            {errorMessage}
          </div>
        )}

        {/* Current Active Sentence Spotlight Box */}
        <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 sm:p-5 text-center transition-all">
          <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
            <span>الجملة الجارية حالياً:</span>
          </div>

          {isBlindMode ? (
            <div className="py-4 space-y-2">
              <p className="text-sm font-semibold text-indigo-900">
                🎧 وضع الاستماع الأعمى مفعّل (بدون قراءة)
              </p>
              <p className="text-xs text-indigo-700">
                استمع جيداً لمخارج الحروف والكلمات لتدريب أذنك على فهم الألمانية، ويمكنك كشف النص في أي وقت.
              </p>
              <button
                type="button"
                onClick={() => setIsBlindMode(false)}
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 bg-white px-3 py-1.5 rounded-lg shadow-2xs border border-indigo-200 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>إظهار النص الآن</span>
              </button>
            </div>
          ) : (
            <p className="text-base sm:text-xl font-semibold text-slate-900 leading-relaxed font-sans">
              "{sentences[currentSentenceIndex]}"
            </p>
          )}
        </div>
      </div>

      {/* Story Text (Interactive Sentence-by-Sentence Reader) */}
      {!isBlindMode && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>نص القصة كاملاً (اضغط على أي جملة للاستماع إليها مباشرة):</span>
            </h4>
            <span className="text-xs text-slate-400">انقر للتشغيل</span>
          </div>

          <div className="space-y-2 text-sm sm:text-base leading-loose text-slate-800">
            {sentences.map((sentence, idx) => {
              const isCurrent = idx === currentSentenceIndex;
              return (
                <span
                  key={idx}
                  onClick={() => playSentence(idx)}
                  className={`inline-block mx-1 px-2 py-1 rounded-lg cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-indigo-100 text-indigo-950 font-semibold ring-2 ring-indigo-400 shadow-2xs'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                  title="اضغط للاستماع لهذه الجملة"
                >
                  {sentence}{' '}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Key Vocabulary (Schlüsselwörter) */}
      {activeStory.vocabulary && activeStory.vocabulary.length > 0 && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>أهم الكلمات والمصطلحات في القصة (Schlüsselwörter):</span>
            </h4>
            <span className="text-[11px] text-slate-400">اضغط على السماعة لسماع نطق الكلمة</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {activeStory.vocabulary.map((vocab, index) => {
              const articleColor =
                vocab.article === 'der'
                  ? 'bg-blue-100 text-blue-800'
                  : vocab.article === 'die'
                  ? 'bg-rose-100 text-rose-800'
                  : vocab.article === 'das'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-700';

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100/80 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      {vocab.article && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${articleColor}`}>
                          {vocab.article}
                        </span>
                      )}
                      <span className="text-xs font-bold text-slate-900">{vocab.word}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">{vocab.meaningAr}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => playVocabularyWord(vocab.word)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors cursor-pointer"
                    title="نطق الكلمة"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Comprehension Questions (Verständnisfragen) */}
      {activeStory.questions && activeStory.questions.length > 0 && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>أسئلة الفهم بعد الاستماع (Verständnisfragen):</span>
            </h4>
            <span className="text-xs text-slate-500">
              تم الإجابة: {Object.keys(userAnswers).length} / {activeStory.questions.length}
            </span>
          </div>

          <div className="space-y-4">
            {activeStory.questions.map((q) => {
              const selectedOption = userAnswers[q.id];
              const hasAnswered = selectedOption !== undefined;
              const isCorrect = selectedOption === q.correctIndex;

              return (
                <div key={q.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2.5">
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900">{q.questionDe}</h5>
                    {q.questionAr && <p className="text-xs text-slate-500 mt-0.5">{q.questionAr}</p>}
                  </div>

                  <div className="space-y-1.5">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = selectedOption === optIdx;
                      const isRightOption = optIdx === q.correctIndex;

                      let btnStyle = 'bg-white border-slate-200 hover:border-slate-300 text-slate-800';
                      if (hasAnswered) {
                        if (isRightOption) {
                          btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
                        } else if (isChosen && !isCorrect) {
                          btnStyle = 'bg-rose-50 border-rose-300 text-rose-950 font-bold';
                        } else {
                          btnStyle = 'bg-white border-slate-200 opacity-60 text-slate-500';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={hasAnswered}
                          onClick={() => setUserAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                          className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {hasAnswered && isRightOption && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {hasAnswered && isChosen && !isCorrect && (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation in Darija & German if answered */}
                  {hasAnswered && (
                    <motion.div
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg text-xs leading-relaxed space-y-1 ${
                        isCorrect ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-rose-50 border border-rose-200 text-rose-900'
                      }`}
                    >
                      <p className="font-bold">
                        {isCorrect ? '✓ أحسنت! إجابة صحيحة' : '✗ إجابة غير دقيقة'}
                      </p>
                      <p className="text-[11px] opacity-90">{q.explanationDe}</p>
                      {q.explanationDarija && (
                        <p className="text-[11px] font-semibold text-slate-800 pt-0.5">
                          بالدارجة: {q.explanationDarija}
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
