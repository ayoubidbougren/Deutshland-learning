import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Send,
  Mic,
  MessageSquare,
  Edit3,
  Lightbulb,
  Award,
  AlertCircle,
  BookOpen,
  Lock,
  Clock,
  Flame,
  Headphones,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  Timer,
} from 'lucide-react';
import {
  DayLessonPlan,
  ExerciseItem,
  BookVocabularyItem,
  UserCourseProgress,
} from '../../types/bookCourse';
import { recordExerciseAttempt, updateVocabularyStatus, completeDay } from '../../utils/bookStorage';
import { DailyImmersionChecklistView } from './DailyImmersionChecklistView';
import { ListeningStageView } from './ListeningStageView';
import { TelegramGrammarVideoCard } from './TelegramGrammarVideoCard';
import { PdfPageScreenView } from './PdfPageScreenView';
import { getListeningExercisesForDay } from '../../data/bookListeningData';
import { isImmersionDayComplete } from '../../data/dailyImmersionData';
import { arrangeOptionsByAnswer, arrangeOptionsByIndex } from '../../utils/shuffleOptions';

interface TodayLessonViewProps {
  dayPlan: DayLessonPlan;
  progress: UserCourseProgress;
  onProgressUpdate: (updated: UserCourseProgress) => void;
  onCompleteDaySuccess: () => void;
  onNavigateToDay?: (dayNumber: number) => void;
  totalDaysInBook?: number;
}

type LessonStage =
  | 'warm_up'
  | 'vocabulary'
  | 'grammar'
  | 'book_exercises'
  | 'listening'
  | 'ai_exercises'
  | 'speaking'
  | 'writing'
  | 'review'
  | 'daily_test'
  | 'post_routine';

export const TodayLessonView: React.FC<TodayLessonViewProps> = ({
  dayPlan,
  progress,
  onProgressUpdate,
  onCompleteDaySuccess,
  onNavigateToDay,
  totalDaysInBook,
}) => {
  const [activeStage, setActiveStage] = useState<LessonStage>('warm_up');

  // Book Exercises state
  const [bookStageViewMode, setBookStageViewMode] = useState<'pdfScreen' | 'interactive'>('pdfScreen');
  const [bookExIndex, setBookExIndex] = useState(0);
  const [bookUserAnswer, setBookUserAnswer] = useState('');
  const [bookExHint, setBookExHint] = useState<string | null>(null);
  const [bookExResult, setBookExResult] = useState<{
    checked: boolean;
    isCorrect: boolean;
    messageDe?: string;
    messageAr?: string;
    showSolution?: boolean;
  }>({ checked: false, isCorrect: false });
  const [bookExAttempts, setBookExAttempts] = useState(0);
  const [bookAnswersHistory, setBookAnswersHistory] = useState<
    Record<
      number,
      {
        answer: string;
        result: {
          checked: boolean;
          isCorrect: boolean;
          messageDe?: string;
          messageAr?: string;
          showSolution?: boolean;
        };
        attempts: number;
      }
    >
  >({});

  // AI Exercises state
  const [aiExercises, setAiExercises] = useState<ExerciseItem[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiExIndex, setAiExIndex] = useState(0);
  const [aiUserAnswer, setAiUserAnswer] = useState('');
  const [aiExHint, setAiExHint] = useState<string | null>(null);
  const [aiExResult, setAiExResult] = useState<{
    checked: boolean;
    isCorrect: boolean;
    messageDe?: string;
    messageAr?: string;
    showSolution?: boolean;
  }>({ checked: false, isCorrect: false });
  const [aiExAttempts, setAiExAttempts] = useState(0);
  const [aiAnswersHistory, setAiAnswersHistory] = useState<
    Record<
      number,
      {
        answer: string;
        result: {
          checked: boolean;
          isCorrect: boolean;
          messageDe?: string;
          messageAr?: string;
          showSolution?: boolean;
        };
        attempts: number;
      }
    >
  >({});

  // Lock notification banner
  const [stageLockNotice, setStageLockNotice] = useState<string | null>(null);

  // Speaking state
  const [speakingMessages, setSpeakingMessages] = useState<
    Array<{
      role: 'teacher' | 'user';
      text: string;
      tip?: string;
      isExplaining?: boolean;
      showExplanation?: boolean;
      explanation?: {
        translationDarija: string;
        explanationDarija: string;
        vocabularyBreakdown?: Array<{ german: string; darija: string }>;
        suggestedAnswers?: Array<{ german: string; darija: string }>;
        quickTip?: string;
      };
    }>
  >([]);
  const [speakingInput, setSpeakingInput] = useState('');
  const [speakingLoading, setSpeakingLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Writing state
  const [writingInput, setWritingInput] = useState('');
  const [writingFeedback, setWritingFeedback] = useState<any>(null);
  const [writingLoading, setWritingLoading] = useState(false);

  // Test state
  const [testAnswers, setTestAnswers] = useState<Record<number, number>>({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testScore, setTestScore] = useState<number | null>(null);

  // Grammar topic focus
  const [selectedGrammarIndex, setSelectedGrammarIndex] = useState(0);

  // Stage completion flags
  const [completedStages, setCompletedStages] = useState<Record<LessonStage, boolean>>({
    warm_up: false,
    vocabulary: false,
    grammar: false,
    book_exercises: false,
    listening: false,
    ai_exercises: false,
    speaking: false,
    writing: false,
    review: false,
    daily_test: false,
    post_routine: false,
  });

  // 2-Hour Daily Goal (120 Minutes) Study Session Timer
  const [dailyStudySeconds, setDailyStudySeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showScheduleBreakdown, setShowScheduleBreakdown] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setDailyStudySeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const formatStudyTime = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    if (hours > 0) {
      return `${hours}س ${minutes}د ${seconds < 10 ? '0' : ''}${seconds}ث`;
    }
    return `${minutes}د ${seconds < 10 ? '0' : ''}${seconds}ث`;
  };

  // Audio player state & helper
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setPlayingAudioId(null);
  };

  const playSpeech = (text: string, id?: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (playingAudioId && id && playingAudioId === id) {
      stopSpeech();
      return;
    }

    window.speechSynthesis.cancel();

    // Clean text for natural German audio
    const clean = text
      .replace(/\(Seite \d+[^)]*\)/gi, '') // skip page references like (Seite 11, Aufgabe 4a) in speech
      .replace(/_+/g, ' ... ') // replace underscores with short pause
      .replace(/\s+/g, ' ')
      .trim();

    if (!clean) return;

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'de-DE';
    utterance.rate = 0.88; // learner-friendly clear rate

    const voices = window.speechSynthesis.getVoices();
    const deVoice = voices.find((v) => v.lang === 'de-DE') || voices.find((v) => v.lang.startsWith('de'));
    if (deVoice) {
      utterance.voice = deVoice;
    }

    if (id) {
      setPlayingAudioId(id);
      utterance.onend = () => {
        setPlayingAudioId((curr) => (curr === id ? null : curr));
      };
      utterance.onerror = () => {
        setPlayingAudioId((curr) => (curr === id ? null : curr));
      };
    }

    window.speechSynthesis.speak(utterance);
  };

  // Stop speech when switching exercises or stages, and on unmount
  useEffect(() => {
    stopSpeech();
  }, [bookExIndex, aiExIndex, activeStage]);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  // Initialize speaking with starter question
  useEffect(() => {
    if (dayPlan?.speaking) {
      setSpeakingMessages([
        {
          role: 'teacher',
          text: dayPlan.speaking.starterQuestion,
          tip: 'جاوب بالألمانية بشكل بسيط وواضح.',
        },
      ]);
    }

    // Restore test state if this day was previously completed
    const existingScore = progress.testScores[dayPlan.dayNumber];
    const isCompleted = progress.completedDays.includes(dayPlan.dayNumber);
    if (existingScore !== undefined || isCompleted) {
      const finalScore = existingScore !== undefined ? existingScore : 100;
      setTestScore(finalScore);
      setTestSubmitted(true);
      if (finalScore >= 80) {
        setCompletedStages({
          warm_up: true,
          vocabulary: true,
          grammar: true,
          book_exercises: true,
          listening: true,
          ai_exercises: true,
          speaking: true,
          writing: true,
          review: true,
          daily_test: true,
          post_routine: false,
        });
      }
    } else {
      setTestScore(null);
      setTestSubmitted(false);
      setTestAnswers({});
      setBookExIndex(0);
      setBookUserAnswer('');
      setBookExResult({ checked: false, isCorrect: false });
      setBookExAttempts(0);
      setBookAnswersHistory({});
      setAiExIndex(0);
      setAiUserAnswer('');
      setAiExResult({ checked: false, isCorrect: false });
      setAiExAttempts(0);
      setAiAnswersHistory({});
      setWritingFeedback(null);
      setWritingInput('');
      setSelectedGrammarIndex(0);
      setCompletedStages({
        warm_up: false,
        vocabulary: false,
        grammar: false,
        book_exercises: false,
        listening: false,
        ai_exercises: false,
        speaking: false,
        writing: false,
        review: false,
        daily_test: false,
        post_routine: false,
      });
    }
  }, [dayPlan?.dayNumber, progress.completedDays, progress.testScores]);

  // Load AI Exercises when entering stage
  const loadAiExercises = async () => {
    if (aiExercises.length > 0) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/book/ai-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonNumber: dayPlan.lessonNumber,
          pages: dayPlan.pages,
          vocabulary: dayPlan.vocabulary,
          grammar: dayPlan.grammar,
          weakAreas: Object.keys(progress.mistakeCounter),
        }),
      });
      const data = await res.json();
      if (data && Array.isArray(data.exercises) && data.exercises.length > 0) {
        setAiExercises(
          data.exercises.map((ex: ExerciseItem, idx: number) => ({
            ...ex,
            options: ex.options
              ? arrangeOptionsByAnswer(ex.options, ex.correctAnswer, idx, `ai-day-${dayPlan.dayNumber}`)
              : ex.options,
          }))
        );
      }
    } catch (e) {
      console.error('Error fetching AI exercises:', e);
    } finally {
      setAiLoading(false);
    }
  };

  // Handle Book Exercise Submit
  const handleCheckBookExercise = async (selectedAnswer?: string) => {
    const currentEx = dayPlan.bookExercises[bookExIndex];
    if (!currentEx) return;

    const answerToCheck = (selectedAnswer !== undefined ? selectedAnswer : bookUserAnswer).trim();
    if (!answerToCheck) return;

    const newAttempts = bookExAttempts + 1;
    setBookExAttempts(newAttempts);

    // Direct check
    const acceptable = [currentEx.correctAnswer, ...(currentEx.acceptableAnswers || [])].map((a) =>
      a.trim().toLowerCase()
    );
    const isCorrect = acceptable.includes(answerToCheck.toLowerCase());

    if (isCorrect) {
      const resObj = {
        checked: true,
        isCorrect: true,
        messageDe: 'Hervorragend! Die Antwort ist richtig.',
        messageAr: 'ممتاز! إجابتك صحيحة ومطابقة لتمارين الكتاب.',
      };
      setBookExResult(resObj);
      setBookAnswersHistory((prev) => ({
        ...prev,
        [bookExIndex]: {
          answer: answerToCheck,
          result: resObj,
          attempts: newAttempts,
        },
      }));
      const updated = recordExerciseAttempt(
        progress,
        currentEx.id,
        answerToCheck,
        true,
        currentEx.grammarCategory
      );
      onProgressUpdate(updated);
    } else {
      // Fetch pedagogical hint from backend or fallback
      let hintAr = currentEx.hint;
      let hintDe = 'Nicht ganz richtig.';
      try {
        const res = await fetch('/api/book/check-answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instructionDe: currentEx.instructionDe,
            questionPrompt: currentEx.prompt,
            correctAnswer: currentEx.correctAnswer,
            userAnswer: answerToCheck,
            hint: currentEx.hint,
            attemptsCount: newAttempts,
          }),
        });
        const data = await res.json();
        if (data.hintAr) hintAr = data.hintAr;
        if (data.hintDe) hintDe = data.hintDe;
      } catch (e) {
        console.warn('Check answer backend error:', e);
      }

      setBookExHint(hintAr);
      const resObj = {
        checked: true,
        isCorrect: false,
        messageDe: hintDe,
        messageAr: hintAr,
        showSolution: newAttempts >= 3,
      };
      setBookExResult(resObj);
      setBookAnswersHistory((prev) => ({
        ...prev,
        [bookExIndex]: {
          answer: answerToCheck,
          result: resObj,
          attempts: newAttempts,
        },
      }));

      const updated = recordExerciseAttempt(
        progress,
        currentEx.id,
        answerToCheck,
        false,
        currentEx.grammarCategory
      );
      onProgressUpdate(updated);
    }
  };

  const handleNextBookExercise = () => {
    const nextIdx = bookExIndex + 1;
    setBookAnswersHistory((prev) => ({
      ...prev,
      [bookExIndex]: {
        answer: bookUserAnswer,
        result: bookExResult,
        attempts: bookExAttempts,
      },
    }));
    const nextSaved = bookAnswersHistory[nextIdx];
    if (nextSaved) {
      setBookUserAnswer(nextSaved.answer);
      setBookExResult(nextSaved.result);
      setBookExAttempts(nextSaved.attempts);
    } else {
      setBookUserAnswer('');
      setBookExResult({ checked: false, isCorrect: false });
      setBookExAttempts(0);
    }
    setBookExIndex(nextIdx);
  };

  const handlePrevBookExercise = () => {
    const prevIdx = bookExIndex - 1;
    setBookAnswersHistory((prev) => ({
      ...prev,
      [bookExIndex]: {
        answer: bookUserAnswer,
        result: bookExResult,
        attempts: bookExAttempts,
      },
    }));
    const prevSaved = bookAnswersHistory[prevIdx];
    if (prevSaved) {
      setBookUserAnswer(prevSaved.answer);
      setBookExResult(prevSaved.result);
      setBookExAttempts(prevSaved.attempts);
    } else {
      setBookUserAnswer('');
      setBookExResult({ checked: false, isCorrect: false });
      setBookExAttempts(0);
    }
    setBookExIndex(prevIdx);
  };

  // Handle AI Exercise Submit
  const handleCheckAiExercise = async (selectedAnswer?: string) => {
    const currentEx = aiExercises[aiExIndex];
    if (!currentEx) return;

    const answerToCheck = (selectedAnswer !== undefined ? selectedAnswer : aiUserAnswer).trim();
    if (!answerToCheck) return;

    const newAttempts = aiExAttempts + 1;
    setAiExAttempts(newAttempts);

    const acceptable = [currentEx.correctAnswer, ...(currentEx.acceptableAnswers || [])].map((a) =>
      a.trim().toLowerCase()
    );
    const isCorrect = acceptable.includes(answerToCheck.toLowerCase());

    if (isCorrect) {
      const resObj = {
        checked: true,
        isCorrect: true,
        messageDe: 'Sehr gut gelöst!',
        messageAr: 'برافو! إجابة صحيحة لتمرين الذكاء الاصطناعي.',
      };
      setAiExResult(resObj);
      setAiAnswersHistory((prev) => ({
        ...prev,
        [aiExIndex]: {
          answer: answerToCheck,
          result: resObj,
          attempts: newAttempts,
        },
      }));
      const updated = recordExerciseAttempt(
        progress,
        currentEx.id,
        answerToCheck,
        true,
        currentEx.grammarCategory
      );
      onProgressUpdate(updated);
    } else {
      setAiExHint(currentEx.hint);
      const resObj = {
        checked: true,
        isCorrect: false,
        messageDe: 'Noch nicht ganz richtig.',
        messageAr: currentEx.hint,
        showSolution: newAttempts >= 3,
      };
      setAiExResult(resObj);
      setAiAnswersHistory((prev) => ({
        ...prev,
        [aiExIndex]: {
          answer: answerToCheck,
          result: resObj,
          attempts: newAttempts,
        },
      }));
      const updated = recordExerciseAttempt(
        progress,
        currentEx.id,
        answerToCheck,
        false,
        currentEx.grammarCategory
      );
      onProgressUpdate(updated);
    }
  };

  const handleNextAiExercise = () => {
    const nextIdx = aiExIndex + 1;
    setAiAnswersHistory((prev) => ({
      ...prev,
      [aiExIndex]: {
        answer: aiUserAnswer,
        result: aiExResult,
        attempts: aiExAttempts,
      },
    }));
    const nextSaved = aiAnswersHistory[nextIdx];
    if (nextSaved) {
      setAiUserAnswer(nextSaved.answer);
      setAiExResult(nextSaved.result);
      setAiExAttempts(nextSaved.attempts);
    } else {
      setAiUserAnswer('');
      setAiExResult({ checked: false, isCorrect: false });
      setAiExAttempts(0);
    }
    setAiExIndex(nextIdx);
  };

  const handlePrevAiExercise = () => {
    const prevIdx = aiExIndex - 1;
    setAiAnswersHistory((prev) => ({
      ...prev,
      [aiExIndex]: {
        answer: aiUserAnswer,
        result: aiExResult,
        attempts: aiExAttempts,
      },
    }));
    const prevSaved = aiAnswersHistory[prevIdx];
    if (prevSaved) {
      setAiUserAnswer(prevSaved.answer);
      setAiExResult(prevSaved.result);
      setAiExAttempts(prevSaved.attempts);
    } else {
      setAiUserAnswer('');
      setAiExResult({ checked: false, isCorrect: false });
      setAiExAttempts(0);
    }
    setAiExIndex(prevIdx);
  };

  // Readiness / Completion Checks for Exercises and Stages
  const isCurrentBookExAnswered =
    Boolean(bookExResult.checked) ||
    Boolean(bookAnswersHistory[bookExIndex]?.result?.checked);

  const isCurrentAiExAnswered =
    Boolean(aiExResult.checked) ||
    Boolean(aiAnswersHistory[aiExIndex]?.result?.checked);

  const userSpeakingCount = speakingMessages.filter((m) => m.role === 'user').length;
  const isSpeakingDone = userSpeakingCount >= 1;
  const isWritingDone = Boolean(writingFeedback);

  // Speaking Submit
  const handleSendSpeaking = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || speakingLoading) return;

    const newHistory = [...speakingMessages, { role: 'user' as const, text }];
    setSpeakingMessages(newHistory);
    setSpeakingInput('');
    setSpeakingLoading(true);

    try {
      const res = await fetch('/api/book/speaking-turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: newHistory,
          userSpeech: text,
          situation: dayPlan.speaking.situationDe,
          lessonTitle: dayPlan.lessonTitleDe,
        }),
      });
      const data = await res.json();
      const teacherText = data.teacherReply || 'Sehr gut! Erzähl mir mehr.';
      setSpeakingMessages((prev) => [
        ...prev,
        {
          role: 'teacher',
          text: teacherText,
          tip: data.darijaTip || (data.correction ? `تصحيح: ${data.correction}` : undefined),
        },
      ]);
      playSpeech(teacherText);
    } catch (e) {
      console.error('Speaking error:', e);
      setSpeakingMessages((prev) => [
        ...prev,
        { role: 'teacher', text: 'Sehr gut! Und wie geht es dir heute?', tip: 'جملة صحيحة، واصل الحوار.' },
      ]);
    } finally {
      setSpeakingLoading(false);
    }
  };

  // Explain teacher message in Moroccan Darija
  const handleExplainMessage = async (index: number) => {
    const targetMsg = speakingMessages[index];
    if (!targetMsg || targetMsg.role !== 'teacher') return;

    // If already generated, toggle visibility
    if (targetMsg.explanation) {
      setSpeakingMessages((prev) =>
        prev.map((m, i) => (i === index ? { ...m, showExplanation: !m.showExplanation } : m))
      );
      return;
    }

    // Set loading and expand
    setSpeakingMessages((prev) =>
      prev.map((m, i) => (i === index ? { ...m, isExplaining: true, showExplanation: true } : m))
    );

    try {
      const res = await fetch('/api/book/explain-in-darija', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          germanText: targetMsg.text,
          situation: dayPlan.speaking.situationDe,
          lessonTitle: dayPlan.lessonTitleDe,
        }),
      });
      const data = await res.json();
      setSpeakingMessages((prev) =>
        prev.map((m, i) =>
          i === index
            ? {
                ...m,
                isExplaining: false,
                explanation: {
                  translationDarija: data.translationDarija || `المعنى: ${targetMsg.text}`,
                  explanationDarija: data.explanationDarija || '',
                  vocabularyBreakdown: data.vocabularyBreakdown || [],
                  suggestedAnswers: data.suggestedAnswers || [],
                  quickTip: data.quickTip || '',
                },
              }
            : m
        )
      );
    } catch (err) {
      console.error('Error fetching Darija explanation:', err);
      setSpeakingMessages((prev) =>
        prev.map((m, i) =>
          i === index
            ? {
                ...m,
                isExplaining: false,
                explanation: {
                  translationDarija: `معنى كلام الأستاذ: "${targetMsg.text}"`,
                  explanationDarija: 'الأستاذ كيطرح عليك سؤال فالمحادثة باش تتفاعل معاه. خود وقتك وجاوب بكلمات بسيطة.',
                  vocabularyBreakdown: [],
                  suggestedAnswers: [
                    { german: 'Ich verstehe. / Ja, genau.', darija: 'فهمت. / نعم تماماً.' },
                    { german: 'Kannst du das wiederholen?', darija: 'واش تقدر تعاود ليا؟' },
                  ],
                  quickTip: 'تقدر تستعمل كلمات السؤال باش تركب الجواب بسهولة.',
                },
              }
            : m
        )
      );
    }
  };

  // Voice recording toggle
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('المتصفح لا يدعم التعرف على الصوت المباشر، يمكنك كتابة الجواب بالأسفل.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'de-DE';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsRecording(true);
    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      setIsRecording(false);
      handleSendSpeaking(speechResult);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  // Submit Writing Task
  const handleSubmitWriting = async () => {
    if (!writingInput.trim() || writingLoading) return;
    setWritingLoading(true);
    try {
      const res = await fetch('/api/book/writing-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userText: writingInput,
          taskDe: dayPlan.writing.taskDe,
          minSentences: dayPlan.writing.minSentences,
        }),
      });
      const data = await res.json();
      setWritingFeedback(data);

      if (data.score >= 80) {
        setCompletedStages((prev) => ({ ...prev, writing: true }));
      }
    } catch (e) {
      console.error('Writing evaluation error:', e);
      setWritingFeedback({
        score: 85,
        passed: true,
        feedbackDe: 'Gut geschrieben! Deine Sätze sind verständlich.',
        feedbackDarija: 'نص جيد ومفهوم، استمر على هذا المنوال!',
      });
      setCompletedStages((prev) => ({ ...prev, writing: true }));
    } finally {
      setWritingLoading(false);
    }
  };

  const normalizedDailyTest = React.useMemo(
    () =>
      (dayPlan.dailyTest || []).map((q, qIdx) => {
        const arranged = arrangeOptionsByIndex(
          q.options,
          q.correctIndex,
          qIdx,
          `dt-day-${dayPlan.dayNumber}`
        );
        return {
          ...q,
          options: arranged.options,
          correctIndex: arranged.correctIndex,
        };
      }),
    [dayPlan.dailyTest, dayPlan.dayNumber]
  );

  // Daily Test evaluation
  const handleDailyTestSubmit = () => {
    let correctCount = 0;
    normalizedDailyTest.forEach((q, idx) => {
      if (testAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / normalizedDailyTest.length) * 100);
    setTestScore(score);
    setTestSubmitted(true);

    if (score >= 80) {
      setCompletedStages((prev) => ({ ...prev, daily_test: true, post_routine: true }));
      // Save completion to user progress!
      const updated = completeDay(progress, dayPlan.dayNumber, dayPlan.pages, score);
      onProgressUpdate(updated);
      onCompleteDaySuccess();
    }
  };

  const stagesList: Array<{ id: LessonStage; label: string; time: string; icon: string }> = [
    { id: 'warm_up', label: '1. Warm-up', time: '10 د', icon: '☀️' },
    { id: 'vocabulary', label: '2. Vocabulary', time: '15 د', icon: '📖' },
    { id: 'grammar', label: '3. Grammar & Video', time: '25 د', icon: '📐' },
    { id: 'book_exercises', label: '4. Book Exercises', time: '20 د', icon: '✍️' },
    { id: 'listening', label: '5. Listening (Hören)', time: '15 د', icon: '🎧' },
    { id: 'ai_exercises', label: '6. AI Exercises', time: '10 د', icon: '🤖' },
    { id: 'speaking', label: '7. Speaking', time: '10 د', icon: '🗣️' },
    { id: 'writing', label: '8. Writing', time: '5 د', icon: '📝' },
    { id: 'review', label: '9. Review', time: '5 د', icon: '🧠' },
    { id: 'daily_test', label: '10. Daily Test', time: '5 د', icon: '🎯' },
    { id: 'post_routine', label: '11. روتين الإتقان', time: '⏱️', icon: '🔥' },
  ];

  const progressPercent = Math.min(100, Math.round((dailyStudySeconds / 7200) * 100));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Lesson Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 sm:p-6 text-white shadow-md border border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30">
                🇩🇪 Day {dayPlan.dayNumber}
              </span>
              <span>• Lektion {dayPlan.lessonNumber}</span>
              <span>• Seiten {dayPlan.pages.join('–')} im Buch</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                ⏱️ هدف اليوم: ساعتان (120 دقيقة)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">{dayPlan.sectionTitleDe}</h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">{dayPlan.sectionTitleAr}</p>
          </div>

          {/* Right Stats & 2-Hour Daily Timer */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* 2-Hour Daily Tracker */}
            <div className="px-3.5 py-2 rounded-xl bg-amber-400/15 border border-amber-400/30 text-right space-y-1 min-w-[200px]">
              <div className="flex items-center gap-2 justify-between">
                <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>جلسة اليوم (ساعتان)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="text-[10px] px-2 py-0.5 rounded bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="w-2.5 h-2.5" />
                      <span>إيقاف مؤقت</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>متابعة</span>
                    </>
                  )}
                </button>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-bold text-white tracking-wide">
                  {formatStudyTime(dailyStudySeconds)}{' '}
                  <span className="text-xs text-slate-300 font-normal">/ 120 د</span>
                </span>
                <span className="text-xs font-bold text-amber-300">
                  {progressPercent}%
                </span>
              </div>
              {/* Progress bar towards 120 min */}
              <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Stages completion */}
            <div className="px-3 py-2 rounded-xl bg-white/10 text-right shrink-0">
              <div className="text-[10px] text-slate-400">معدل الإنجاز</div>
              <div className="text-sm font-bold text-amber-300">
                {Object.values(completedStages).filter(Boolean).length} / {stagesList.length} مراحل
              </div>
            </div>
          </div>
        </div>

        {/* Expandable 2-Hour Daily Routine Breakdown */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setShowScheduleBreakdown(!showScheduleBreakdown)}
            className="text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-between gap-2 py-1 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span>📋 كيف تنظم الساعتين (120 دقيقة) لإتقان درس اليوم؟</span>
              <span className="text-[10px] text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full">
                توزيع منهجي دقيق
              </span>
            </span>
            {showScheduleBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showScheduleBreakdown && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-2 text-xs">
              <div className="rounded-lg bg-white/5 border border-white/10 p-2.5 space-y-1">
                <div className="font-bold text-amber-300 flex items-center justify-between">
                  <span>1. الإحماء والمفردات</span>
                  <span className="text-[11px] bg-white/10 px-1.5 py-0.5 rounded">25 دقيقة</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  10 د إحماء ومدخل + 15 د حفظ الكلمات ونطقها ببطاقات التكرار المتباعد.
                </p>
              </div>

              <div className="rounded-lg bg-white/5 border border-white/10 p-2.5 space-y-1">
                <div className="font-bold text-sky-300 flex items-center justify-between">
                  <span>2. القواعد والفيديو وتمارين الكتاب</span>
                  <span className="text-[11px] bg-white/10 px-1.5 py-0.5 rounded">45 دقيقة</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  25 د دراسة القاعدة ومشاهدة فيديو التيليغرام المحدد + 20 د حل تمارين الكتاب.
                </p>
              </div>

              <div className="rounded-lg bg-white/5 border border-white/10 p-2.5 space-y-1">
                <div className="font-bold text-emerald-300 flex items-center justify-between">
                  <span>3. الاستماع والتدريب التفاعلي</span>
                  <span className="text-[11px] bg-white/10 px-1.5 py-0.5 rounded">25 دقيقة</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  15 د استماع لحوارات ألمانية واقعية + 10 د تمارين الذكاء الاصطناعي الذكية.
                </p>
              </div>

              <div className="rounded-lg bg-white/5 border border-white/10 p-2.5 space-y-1">
                <div className="font-bold text-purple-300 flex items-center justify-between">
                  <span>4. التحدث والكتابة</span>
                  <span className="text-[11px] bg-white/10 px-1.5 py-0.5 rounded">15 دقيقة</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  10 د محادثة صوتية مع الذكاء الاصطناعي + 5 د كتابة فقرة قصيرة وتصحيحها.
                </p>
              </div>

              <div className="rounded-lg bg-white/5 border border-white/10 p-2.5 space-y-1 sm:col-span-2">
                <div className="font-bold text-amber-300 flex items-center justify-between">
                  <span>5. المراجعة والاختبار النهائي لليوم</span>
                  <span className="text-[11px] bg-white/10 px-1.5 py-0.5 rounded">10 دقائق</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  5 د مراجعة سريعة + 5 د اجتياز الاختبار اليومي لتسجيل تقدمك بنجاح.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 9 Stages Horizontal Stepper Navigation */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
          {stagesList.map((st, sIdx) => {
            const isActive = activeStage === st.id;
            const isDone = completedStages[st.id];
            const isUnlocked =
              progress.completedDays.includes(dayPlan.dayNumber) ||
              sIdx === 0 ||
              Boolean(completedStages[st.id]) ||
              Boolean(completedStages[stagesList[sIdx - 1].id]);

            return (
              <button
                key={st.id}
                onClick={() => {
                  if (!isUnlocked) {
                    const prevStageLabel = stagesList[sIdx - 1]?.label || 'المرحلة السابقة';
                    setStageLockNotice(`🔒 هاد المرحلة مقفولة حتى تكمل أولاً: ${prevStageLabel} وتجاوب على التمارين ديالها`);
                    setTimeout(() => setStageLockNotice(null), 4000);
                    return;
                  }
                  setActiveStage(st.id);
                  if (st.id === 'ai_exercises') loadAiExercises();
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : !isUnlocked
                    ? 'bg-slate-100/70 text-slate-400 border border-slate-200/60 cursor-not-allowed opacity-60'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-pointer'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 cursor-pointer'
                }`}
              >
                {!isUnlocked ? <Lock className="w-3.5 h-3.5 text-slate-400" /> : <span>{st.icon}</span>}
                <span>{st.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    isActive
                      ? 'bg-black/15 text-slate-950'
                      : isDone
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {st.time}
                </span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            );
          })}
        </div>

        {/* Notice banner if user clicks a locked stage */}
        {stageLockNotice && (
          <div className="rounded-xl bg-amber-50 border border-amber-300 p-3 text-xs text-amber-950 font-bold flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{stageLockNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setStageLockNotice(null)}
              className="text-amber-700 hover:text-amber-950 font-bold px-2 py-0.5 rounded cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* STAGE 1: WARM-UP */}
      {/* ===================================================================== */}
      {activeStage === 'warm_up' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <span className="text-2xl">☀️</span>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{dayPlan.warmUp.titleDe}</h3>
              <p className="text-xs text-slate-500">{dayPlan.warmUp.titleAr}</p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-2">
            <p className="text-sm text-slate-800 leading-relaxed">{dayPlan.warmUp.introDe}</p>
            <p className="text-xs text-slate-600 leading-relaxed">{dayPlan.warmUp.introAr}</p>
          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-900">نصيحة الأستاذ لدرس اليوم (Pädagogischer Tipp):</h4>
              <p className="text-xs text-amber-800 mt-1">{dayPlan.warmUp.quickTip}</p>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={() => {
                setCompletedStages((p) => ({ ...p, warm_up: true }));
                setActiveStage('vocabulary');
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2"
            >
              <span>المرحلة التالية: 2. Vocabulary</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* STAGE 2: VOCABULARY IN CONTEXT */}
      {/* ===================================================================== */}
      {activeStage === 'vocabulary' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📖</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Wortschatz im Kontext (المفردات في سياقها)</h3>
                <p className="text-xs text-slate-500">
                  كل كلمة مع جملتها النموذجية وترجمتها. لا نقوم بحفظ الكلمات معزولة!
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            {dayPlan.vocabulary.map((item) => {
              const currentStatus = progress.vocabularyBank[item.id]?.status || item.status;

              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 hover:bg-white hover:border-amber-300 transition-all shadow-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-slate-900">
                        {item.article && (
                          <span
                            className={`text-xs font-semibold px-1.5 py-0.5 rounded mr-1.5 ${
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
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none"
                    >
                      <option value="new">🆕 New</option>
                      <option value="learning">🔄 Learning</option>
                      <option value="learned">✅ Learned</option>
                      <option value="needs_review">⚠️ Needs Review</option>
                    </select>
                  </div>

                  <p className="text-xs font-medium text-amber-800">{item.meaningAr}</p>

                  <div className="rounded-lg bg-white p-2.5 border border-slate-200/70 text-xs space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-slate-900 font-medium">{item.exampleSentence}</p>
                      <button
                        onClick={() => playSpeech(item.exampleSentence)}
                        className="text-slate-400 hover:text-amber-600 shrink-0"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500">{item.sentenceTranslationAr}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveStage('warm_up')}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>السابق</span>
            </button>

            <button
              onClick={() => {
                setCompletedStages((p) => ({ ...p, vocabulary: true }));
                setActiveStage('grammar');
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2"
            >
              <span>المرحلة التالية: 3. Grammar</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* STAGE 3: GRAMMAR */}
      {/* ===================================================================== */}
      {activeStage === 'grammar' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <span className="text-2xl">📐</span>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Grammatik (قواعد الدرس المحددة)</h3>
              <p className="text-xs text-slate-500">
                قواعد صفحات اليوم من الكتاب بالضبط، مع فيديو واحد مباشر وجداول واضحة
              </p>
            </div>
          </div>

          {/* Grammar Topic Tabs if more than one topic exists */}
          {dayPlan.grammar && dayPlan.grammar.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-semibold text-slate-500 shrink-0">اختر موضوع القاعدة:</span>
              {dayPlan.grammar.map((topicItem, idx) => (
                <button
                  key={topicItem.id}
                  onClick={() => setSelectedGrammarIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedGrammarIndex === idx
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}. {topicItem.titleAr || topicItem.titleDe}
                </button>
              ))}
            </div>
          )}

          {/* Telegram Video Explanation Card - Shown ONCE for selected topic */}
          {dayPlan.grammar && dayPlan.grammar[selectedGrammarIndex] && (
            <TelegramGrammarVideoCard topic={dayPlan.grammar[selectedGrammarIndex]} />
          )}

          <div className="space-y-6">
            {(() => {
              const g = dayPlan.grammar?.[selectedGrammarIndex] || dayPlan.grammar?.[0];
              if (!g) return null;
              return (
                <div key={g.id} className="rounded-xl border border-slate-200 p-5 space-y-4 bg-slate-50/30">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{g.titleDe}</h4>
                    <p className="text-xs text-slate-500">{g.titleAr}</p>
                  </div>

                  <div className="rounded-xl bg-amber-50/60 p-3.5 border border-amber-100 text-xs space-y-1">
                    <p className="text-slate-800 font-medium">{g.summaryDe}</p>
                    <p className="text-slate-600">{g.summaryAr}</p>
                    {g.explanationAr && (
                      <p className="text-slate-700 pt-1.5 border-t border-amber-200/60 leading-relaxed font-normal">
                        {g.explanationAr}
                      </p>
                    )}
                    {g.rules && g.rules.length > 0 && (
                      <ul className="list-disc list-inside space-y-1 pt-1.5 text-slate-700 font-medium">
                        {g.rules.map((rule, rIdx) => (
                          <li key={rIdx}>{rule}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {g.tables?.map((tbl, tIdx) => (
                    <div key={tIdx} className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                      <div className="bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-700 border-b border-slate-200">
                        {tbl.title}
                      </div>
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                          <tr>
                            {tbl.headers.map((h, hIdx) => (
                              <th key={hIdx} className="px-3.5 py-2 font-semibold">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {tbl.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-50">
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

                  {g.examples && g.examples.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-slate-700">أمثلة تطبيقية (Beispielsätze):</h5>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {g.examples.map((ex, exIdx) => (
                          <div key={exIdx} className="rounded-lg bg-white p-3 border border-slate-200 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="font-bold text-slate-900">{ex.de}</p>
                              <button onClick={() => playSpeech(ex.de)} className="text-slate-400 hover:text-amber-600">
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-slate-500">{ex.ar}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveStage('vocabulary')}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>السابق</span>
            </button>

            <button
              onClick={() => {
                setCompletedStages((p) => ({ ...p, grammar: true }));
                setActiveStage('book_exercises');
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2"
            >
              <span>المرحلة التالية: 4. Book Exercises</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* STAGE 4: BOOK EXERCISES (AUTHENTIC EXERCISES WITH HINTS) */}
      {/* ===================================================================== */}
      {activeStage === 'book_exercises' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-6">
          {/*Stage Header: PDF Page Screen only */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📖</span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-black text-slate-900">
                    سكرين صفحة الكتاب (Kursbuch S. {dayPlan.pages.join(' – ')})
                  </h3>
                  <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950">
                    كتاب DaF kompakt neu A1
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  طالع صفحات الدرس الأصلية مباشرة من كتاب DaF kompakt neu A1.
                </p>
              </div>
            </div>
          </div>

          {/* PDF Page Screen ONLY */}
          <div className="space-y-6">
            <PdfPageScreenView
              pageNumber={dayPlan.pages[0] || 8}
              availablePages={dayPlan.pages}
              lessonNumber={dayPlan.lessonNumber}
              hasPracticeQuestions={false}
            />
          </div>

          {/* Stage 4 Bottom Navigation Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveStage('grammar')}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              ← العودة للقواعد والملخص
            </button>

            <button
              type="button"
              onClick={() => {
                setCompletedStages((p) => ({ ...p, book_exercises: true }));
                setActiveStage('listening');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <span>أنهيت مراجعة صفحة الـ PDF! التالي: 5. الاستماع لأوديو الكتاب (Hören)</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* STAGE 5: LISTENING (HÖREN) EXERCISES */}
      {/* ===================================================================== */}
      {activeStage === 'listening' && (
        <div className="space-y-4">
          <ListeningStageView
            exercises={
              (dayPlan.listeningExercises && dayPlan.listeningExercises.length > 0)
                ? dayPlan.listeningExercises
                : getListeningExercisesForDay(dayPlan.dayNumber, {
                    pages: dayPlan.pages,
                    lessonNumber: dayPlan.lessonNumber,
                    sectionTitleDe: dayPlan.sectionTitleDe,
                    sectionTitleAr: dayPlan.sectionTitleAr,
                  })
            }
            dayNumber={dayPlan.dayNumber}
            lessonNumber={dayPlan.lessonNumber}
            isStageCompleted={completedStages.listening}
            onCompleteStage={() => {
              setCompletedStages((p) => ({ ...p, listening: true }));
              setActiveStage('ai_exercises');
              loadAiExercises();
            }}
          />
        </div>
      )}

      {/* ===================================================================== */}
      {/* STAGE 6: NEW AI EXERCISES */}
      {/* ===================================================================== */}
      {activeStage === 'ai_exercises' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">تمارين الذكاء الاصطناعي التكيفية (AI Exercises)</h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                    مولدة خصيصاً لك
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  تمارين إضافية غير موجودة بالكتاب، تركز على القواعد التي تحتاج فيها لتثبيت وممارسة إضافية.
                </p>
              </div>
            </div>

            {aiExercises.length > 0 && (
              <span className="text-xs font-bold text-slate-500">
                تمرين {aiExIndex + 1} من {aiExercises.length}
              </span>
            )}
          </div>

          {aiLoading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-medium">
                جاري توليد تمارين تكيفية ذكية مبنية على مفردات الصفحة وأخطائك السابقة...
              </p>
            </div>
          ) : aiExercises[aiExIndex] ? (
            <div className="space-y-4 max-w-2xl mx-auto">
              {/* Instructions & Audio Reader Header */}
              <div className="rounded-2xl bg-gradient-to-r from-amber-50/80 via-slate-50 to-amber-50/50 p-4 border border-amber-200/80 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {aiExercises[aiExIndex].instructionDe}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                      {aiExercises[aiExIndex].instructionAr}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      playSpeech(
                        `${aiExercises[aiExIndex].instructionDe}. ${aiExercises[aiExIndex].prompt}`,
                        `ai-ex-full-${aiExIndex}`
                      )
                    }
                    className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98 ${
                      playingAudioId === `ai-ex-full-${aiExIndex}`
                        ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400 font-extrabold animate-pulse'
                        : 'bg-white hover:bg-amber-100 text-slate-800 border border-slate-200 hover:border-amber-300'
                    }`}
                    title="استمع لقراءة السؤال بالألمانية (Frage anhören)"
                    aria-label="استمع للسؤال"
                  >
                    {playingAudioId === `ai-ex-full-${aiExIndex}` ? (
                      <>
                        <VolumeX className="w-4 h-4 text-slate-950 shrink-0" />
                        <span>جاري القراءة... (إيقاف)</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>🔊 استمع للسؤال</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-amber-50/50 p-4 border border-amber-200/80 text-sm font-medium text-slate-900 leading-relaxed flex items-start justify-between gap-3">
                <div className="flex-1 font-mono text-sm sm:text-base">{aiExercises[aiExIndex].prompt}</div>
                <button
                  type="button"
                  onClick={() => playSpeech(aiExercises[aiExIndex].prompt, `ai-prompt-${aiExIndex}`)}
                  className={`p-2 rounded-lg border text-xs transition-all cursor-pointer shrink-0 ${
                    playingAudioId === `ai-prompt-${aiExIndex}`
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs ring-2 ring-amber-300'
                      : 'border-amber-200 bg-white hover:bg-amber-50 text-slate-600 hover:text-slate-900'
                  }`}
                  title="استمع لنص الجملة فقط"
                  aria-label="استمع لنص الجملة"
                >
                  <Volume2 className="w-4 h-4 text-amber-600" />
                </button>
              </div>

              {aiExercises[aiExIndex].options && aiExercises[aiExIndex].options!.length > 0 ? (
                <div className="grid gap-2.5">
                  {arrangeOptionsByAnswer(
                    aiExercises[aiExIndex].options!,
                    aiExercises[aiExIndex].correctAnswer,
                    aiExIndex,
                    `ai-day-${dayPlan.dayNumber}`
                  ).map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-2">
                      <button
                        disabled={aiExResult.isCorrect}
                        onClick={() => {
                          setAiUserAnswer(opt);
                          handleCheckAiExercise(opt);
                        }}
                        className={`flex-1 text-left p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                          aiUserAnswer === opt
                            ? aiExResult.isCorrect
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                              : 'border-amber-400 bg-amber-50 text-amber-900'
                            : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        {opt}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playSpeech(opt, `ai-opt-${aiExIndex}-${oIdx}`);
                        }}
                        className={`p-3 rounded-xl border text-xs transition-colors cursor-pointer shrink-0 ${
                          playingAudioId === `ai-opt-${aiExIndex}-${oIdx}`
                            ? 'bg-amber-500 text-slate-950 border-amber-600 ring-2 ring-amber-300'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-700'
                        }`}
                        title="استمع لهذا الخيار بالألمانية"
                        aria-label={`استمع للخيار ${opt}`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiUserAnswer}
                    disabled={aiExResult.isCorrect}
                    onChange={(e) => setAiUserAnswer(e.target.value)}
                    placeholder="اكتب إجابتك..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={() => handleCheckAiExercise()}
                    disabled={aiExResult.isCorrect || !aiUserAnswer.trim()}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold"
                  >
                    تحقق
                  </button>
                </div>
              )}

              {aiExResult.checked && (
                <div
                  className={`rounded-xl p-4 border text-xs space-y-2 ${
                    aiExResult.isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {aiExResult.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-amber-600" />
                    )}
                    <span>{aiExResult.messageDe}</span>
                  </div>
                  <p>{aiExResult.messageAr}</p>
                </div>
              )}

              {/* Requirement notice if exercise not answered yet */}
              {!isCurrentAiExAnswered && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs font-semibold">
                  <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>جاوب على هاد التمرين أولاً (اختر الإجابة أو اكتبها واضغط تحقق) باش تقدر تدوز للتمرين الموالي 🔒</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={() => {
                    if (aiExIndex > 0) {
                      handlePrevAiExercise();
                    } else {
                      setActiveStage('listening');
                    }
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  {aiExIndex > 0 ? 'السابق' : '← العودة إلى الاستماع (Hören)'}
                </button>

                {aiExIndex < aiExercises.length - 1 ? (
                  <button
                    disabled={!isCurrentAiExAnswered}
                    onClick={handleNextAiExercise}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isCurrentAiExAnswered
                        ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs cursor-pointer'
                        : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed select-none'
                    }`}
                  >
                    {!isCurrentAiExAnswered && <Lock className="w-3.5 h-3.5 text-slate-400" />}
                    <span>التمرين التالي</span>
                    {isCurrentAiExAnswered && <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />}
                  </button>
                ) : (
                  <button
                    disabled={!isCurrentAiExAnswered}
                    onClick={() => {
                      if (!isCurrentAiExAnswered) return;
                      setCompletedStages((p) => ({ ...p, ai_exercises: true }));
                      setActiveStage('speaking');
                    }}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isCurrentAiExAnswered
                        ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs cursor-pointer'
                        : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed select-none'
                    }`}
                  >
                    {!isCurrentAiExAnswered && <Lock className="w-3.5 h-3.5 text-slate-400" />}
                    <span>أنهيت تمارين AI! التالي: 7. Speaking</span>
                    {isCurrentAiExAnswered && <ArrowRight className="w-4 h-4 rtl:rotate-180" />}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <button
                onClick={loadAiExercises}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
              >
                توليد تمارين AI الآن
              </button>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* STAGE 6: SPEAKING (ONE QUESTION AT A TIME) */}
      {/* ===================================================================== */}
      {activeStage === 'speaking' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🗣️</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Mündliches Training (Speaking)</h3>
                <p className="text-xs text-slate-500">
                  حوار تفاعلي سؤال بسؤال مع الأستاذ. تحدث بصوتك أو اكتب، وسيصحح لك نطقك وتركيب الجملة.
                </p>
              </div>
            </div>

            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 font-semibold text-slate-600">
              {dayPlan.speaking.titleDe}
            </span>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100 flex items-center justify-between">
            <span>💡 الموقف: {dayPlan.speaking.situationDe}</span>
            <span className="text-[11px] font-bold text-amber-700">تحدث بالألمانية فقط</span>
          </div>

          {/* Dialogue Messages Container */}
          <div className="space-y-3 min-h-[220px] max-h-[420px] overflow-y-auto p-4 rounded-xl bg-slate-50/50 border border-slate-200">
            {speakingMessages.map((msg, mIdx) => (
              <div
                key={mIdx}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[82%] rounded-2xl p-4 text-xs sm:text-sm font-medium shadow-xs transition-all ${
                    msg.role === 'user'
                      ? 'bg-amber-500 text-slate-950 rounded-br-none'
                      : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="leading-relaxed font-semibold">{msg.text}</p>
                    {msg.role === 'teacher' && (
                      <button
                        onClick={() => playSpeech(msg.text)}
                        className="text-slate-400 hover:text-amber-600 shrink-0 p-1 hover:bg-slate-100 rounded-lg transition-colors"
                        title="استمع للنطق"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Button: "ما فهمتيش؟ شرح بالدارجة" for teacher messages */}
                  {msg.role === 'teacher' && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleExplainMessage(mIdx)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          msg.showExplanation
                            ? 'bg-amber-500 text-slate-950 shadow-xs'
                            : 'bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-900 border border-amber-300/80 hover:border-amber-400'
                        }`}
                      >
                        <span className="text-sm">🇲🇦</span>
                        <span>{msg.showExplanation ? 'إخفاء الشرح بالدارجة' : 'ما فهمتيش؟ شرح بالدارجة'}</span>
                      </button>

                      {msg.tip && (
                        <span className="text-[11px] text-amber-800 font-normal">
                          💡 {msg.tip}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Expanded explanation card in Moroccan Darija */}
                  {msg.role === 'teacher' && msg.showExplanation && (
                    <div className="mt-3 rounded-xl bg-gradient-to-br from-amber-50/90 via-orange-50/60 to-amber-100/40 p-3.5 border border-amber-300/80 text-slate-900 text-xs space-y-3 shadow-xs text-right">
                      <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                        <div className="flex items-center gap-2 font-bold text-amber-950">
                          <span className="text-base">🇲🇦</span>
                          <span>شرح وتوضيح السؤال بالدارجة المغربية:</span>
                        </div>
                        {msg.isExplaining && (
                          <span className="text-[11px] font-semibold text-amber-700 animate-pulse flex items-center gap-1">
                            <span className="w-3 h-3 border-2 border-amber-600 border-t-transparent rounded-full animate-spin inline-block" />
                            جاري الشرح...
                          </span>
                        )}
                      </div>

                      {msg.isExplaining ? (
                        <div className="py-4 text-center text-amber-900/70 space-y-2">
                          <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
                          <p className="text-[11px]">كنوجدو ليك الشرح بالدارجة ونماذج كيفاش تجاوب...</p>
                        </div>
                      ) : (
                        <>
                          {/* Translation in Darija */}
                          <div className="rounded-lg bg-white/90 p-2.5 border border-amber-200/80 space-y-1">
                            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">
                              المعنى بالدارجة:
                            </span>
                            <p className="font-bold text-slate-900 text-xs sm:text-sm leading-relaxed">
                              {msg.explanation?.translationDarija}
                            </p>
                            {msg.explanation?.explanationDarija && (
                              <p className="text-[11px] text-slate-600 leading-relaxed pt-1 border-t border-slate-100">
                                {msg.explanation.explanationDarija}
                              </p>
                            )}
                          </div>

                          {/* Vocabulary breakdown */}
                          {msg.explanation?.vocabularyBreakdown && msg.explanation.vocabularyBreakdown.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-[11px] font-bold text-slate-700 block">
                                🔍 تفكيك كلمات السؤال (Wort für Wort):
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {msg.explanation.vocabularyBreakdown.map((item, vIdx) => (
                                  <span
                                    key={vIdx}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-xs shadow-2xs"
                                  >
                                    <strong className="text-amber-950 font-bold">{item.german}</strong>
                                    <span className="text-slate-400">=</span>
                                    <span className="text-slate-700">{item.darija}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Suggested answers */}
                          {msg.explanation?.suggestedAnswers && msg.explanation.suggestedAnswers.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-[11px] font-bold text-slate-700 block">
                                💬 نماذج كيفاش تقدر تجاوب (اضغط على أي جملة للاستعمال المباشر):
                              </span>
                              <div className="space-y-1.5">
                                {msg.explanation.suggestedAnswers.map((ans, aIdx) => (
                                  <button
                                    key={aIdx}
                                    type="button"
                                    onClick={() => {
                                      setSpeakingInput(ans.german);
                                    }}
                                    className="w-full text-right p-2.5 rounded-lg bg-white hover:bg-amber-100/70 border border-amber-200/80 transition-all flex items-center justify-between gap-2 group cursor-pointer"
                                  >
                                    <div>
                                      <div className="font-bold text-slate-900 text-xs group-hover:text-amber-950">
                                        {ans.german}
                                      </div>
                                      <div className="text-[11px] text-slate-500 font-normal">
                                        {ans.darija}
                                      </div>
                                    </div>
                                    <span className="shrink-0 text-[10px] font-bold px-2 py-1 rounded bg-amber-100 text-amber-800 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                                      استعمل هذا الجواب ✍️
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Quick tip */}
                          {msg.explanation?.quickTip && (
                            <div className="text-[11px] text-amber-950 bg-amber-100/60 rounded-lg p-2 border border-amber-200/60 flex items-start gap-1.5">
                              <span className="shrink-0 text-sm">💡</span>
                              <span className="leading-relaxed font-medium">{msg.explanation.quickTip}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {speakingLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <span>الأستاذ يفكر في السؤال التالي...</span>
              </div>
            )}
          </div>

          {/* Quick assist button if user didn't understand the latest teacher question */}
          {speakingMessages.some((m) => m.role === 'teacher') && (
            <div className="flex items-center justify-start">
              <button
                type="button"
                onClick={() => {
                  const lastTeacherIdx = speakingMessages
                    .map((m, idx) => ({ m, idx }))
                    .filter((x) => x.m.role === 'teacher')
                    .pop()?.idx;
                  if (lastTeacherIdx !== undefined) {
                    handleExplainMessage(lastTeacherIdx);
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs text-amber-900 hover:text-amber-950 font-bold bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-3 py-1.5 rounded-xl transition-all shadow-2xs"
              >
                <span>🇲🇦</span>
                <span>ما فهمتيش آخر سؤال ديال الأستاذ؟ اضغط هنا يشرحو ليك بالدارجة 💡</span>
              </button>
            </div>
          )}

          {/* Speaking Input Bar */}
          <div className="flex gap-2 items-center">
            <button
              onClick={toggleSpeechRecognition}
              className={`p-3 rounded-xl border transition-all ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse border-rose-600'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
              }`}
              title="اضغط للتحدث بصوتك بالألمانية"
            >
              <Mic className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={speakingInput}
              onChange={(e) => setSpeakingInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendSpeaking(speakingInput);
              }}
              placeholder="اكتب إجابتك بالألمانية أو اضغط على الميكروفون للتحدث..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
            />

            <button
              onClick={() => handleSendSpeaking(speakingInput)}
              disabled={!speakingInput.trim() || speakingLoading}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>إرسال</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium">
              {!isSpeakingDone ? (
                <span className="text-amber-800 font-semibold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-amber-700 inline" />
                  جاوب الأستاذ على الأقل مرة واحدة بالصوت أو بالكتابة باش تفتح مرحلة الكتابة 🔒
                </span>
              ) : (
                <span>✓ أحسنت! تفاعلت مع الأستاذ، يمكنك الآن الانتقال لمرحلة الكتابة أو الاستمرار في المحادثة.</span>
              )}
            </span>

            <button
              disabled={!isSpeakingDone}
              onClick={() => {
                if (!isSpeakingDone) return;
                setCompletedStages((p) => ({ ...p, speaking: true }));
                setActiveStage('writing');
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isSpeakingDone
                  ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs cursor-pointer'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed select-none'
              }`}
            >
              {!isSpeakingDone && <Lock className="w-3.5 h-3.5 text-slate-400" />}
              <span>المرحلة التالية: 8. Writing</span>
              {isSpeakingDone && <ArrowRight className="w-4 h-4 rtl:rotate-180" />}
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* STAGE 8: WRITING */}
      {/* ===================================================================== */}
      {activeStage === 'writing' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📝</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Schreibtraining (تمرين الكتابة والتعبير)</h3>
                <p className="text-xs text-slate-500">
                  اكتب فقرة باللغة الألمانية وسيقوم الذكاء الاصطناعي بتصحيح القواعد والإملاء وتقديم تقييم مفصل.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">{dayPlan.writing.titleDe}</h4>
              <span className="text-xs font-semibold text-slate-500">
                المطلوب: {dayPlan.writing.minSentences} جمل على الأقل
              </span>
            </div>
            <p className="text-xs text-slate-800">{dayPlan.writing.taskDe}</p>
            <p className="text-xs text-slate-500">{dayPlan.writing.taskAr}</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">محرر النص الخاص بك:</label>
            <textarea
              rows={5}
              value={writingInput}
              onChange={(e) => setWritingInput(e.target.value)}
              placeholder="اكتب جملك هنا بالألمانية..."
              className="w-full p-4 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500 font-sans"
            />
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>{writingInput.split('.').filter((s) => s.trim()).length} جمل مكتوبة</span>
              <button
                onClick={handleSubmitWriting}
                disabled={writingLoading || !writingInput.trim()}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-2"
              >
                {writingLoading && (
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                )}
                <span>تصحيح النص وتقييمه بواسطة AI</span>
              </button>
            </div>
          </div>

          {/* Feedback Card */}
          {writingFeedback && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span className="font-bold text-sm text-slate-900">تقييم الأستاذ للإنشاء</span>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    writingFeedback.score >= 80
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  العلامة: {writingFeedback.score} / 100
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-semibold text-slate-800">{writingFeedback.feedbackDe}</p>
                <p className="text-slate-600">{writingFeedback.feedbackDarija}</p>
              </div>

              {writingFeedback.correctedText && (
                <div className="rounded-lg bg-white p-3 border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-emerald-800">الصيغة المصححة النموذجية:</span>
                  <p className="text-slate-900 font-medium">{writingFeedback.correctedText}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => setActiveStage('speaking')}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              السابق
            </button>

            {!isWritingDone ? (
              <span className="text-[11px] text-amber-800 font-semibold flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-700 inline" />
                اكتب النص ديالك واضغط «تصحيح النص وتقييمه بواسطة AI» لفتح المراجعة 🔒
              </span>
            ) : (
              <span className="text-[11px] text-emerald-700 font-semibold">
                ✓ تم تقييم وتصحيح النص بنجاح! يمكنك الآن المرور للمراجعة المركزة.
              </span>
            )}

            <button
              disabled={!isWritingDone}
              onClick={() => {
                if (!isWritingDone) return;
                setCompletedStages((p) => ({ ...p, writing: true }));
                setActiveStage('review');
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isWritingDone
                  ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs cursor-pointer'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed select-none'
              }`}
            >
              {!isWritingDone && <Lock className="w-3.5 h-3.5 text-slate-400" />}
              <span>المرحلة التالية: 9. Review</span>
              {isWritingDone && <ArrowRight className="w-4 h-4 rtl:rotate-180" />}
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* STAGE 9: REVIEW (SPACED REPETITION) */}
      {/* ===================================================================== */}
      {activeStage === 'review' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <span className="text-2xl">🧠</span>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Wiederholung (مراجعة مركزة وتكرار متباعد)</h3>
              <p className="text-xs text-slate-500">
                مراجعة الكلمات والقواعد السابقة لتثبيت الذاكرة قبل خوض الاختبار اليومي
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700">كلمات اليوم للمراجعة السريعة:</h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {dayPlan.vocabulary.map((v) => (
                <div key={v.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900">{v.word}</span>
                    <span className="text-slate-400 mx-1.5">•</span>
                    <span className="text-slate-600">{v.meaningAr}</span>
                  </div>
                  <button onClick={() => playSpeech(v.word)} className="text-slate-400 hover:text-amber-600">
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveStage('writing')}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              السابق
            </button>

            <button
              onClick={() => {
                setCompletedStages((p) => ({ ...p, review: true }));
                setActiveStage('daily_test');
              }}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-sm"
            >
              <span>جاهز للاختبار! 10. Daily Test</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* STAGE 10: DAILY TEST (80% MINIMUM TO PASS) */}
      {/* ===================================================================== */}
      {activeStage === 'daily_test' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Täglicher Abschlusstest (الاختبار اليومي)</h3>
                <p className="text-xs text-slate-500">
                  اجتياز هذا الاختبار بنسبة لا تقل عن 80% شرط أساسي لإكمال Day {dayPlan.dayNumber} والانتقال للصفحات التالية!
                </p>
              </div>
            </div>

            {testScore !== null && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  testScore >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                النتيجة: {testScore}%
              </span>
            )}
          </div>

          {/* Test Questions */}
          <div className="space-y-6">
            {normalizedDailyTest.map((q, qIdx) => {
              const selectedOpt = testAnswers[qIdx];
              const isCorrect = testSubmitted && selectedOpt === q.correctIndex;
              const isWrong = testSubmitted && selectedOpt !== undefined && selectedOpt !== q.correctIndex;

              return (
                <div key={q.id} className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">سؤال {qIdx + 1} من {normalizedDailyTest.length}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      {q.category}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5 flex-1">
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">{q.questionDe}</h4>
                      {q.questionAr && <p className="text-xs text-slate-500">{q.questionAr}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => playSpeech(q.questionDe, `test-q-${qIdx}`)}
                      className={`p-2 rounded-lg border text-xs transition-colors shrink-0 cursor-pointer ${
                        playingAudioId === `test-q-${qIdx}`
                          ? 'bg-amber-500 text-slate-950 border-amber-600 ring-2 ring-amber-300 font-bold'
                          : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                      }`}
                      title="استمع للسؤال بالألمانية (Frage anhören)"
                      aria-label="استمع للسؤال"
                    >
                      <Volume2 className="w-4 h-4 text-amber-600" />
                    </button>
                  </div>

                  <div className="grid gap-2">
                    {q.options.map((opt, oIdx) => {
                      let btnStyle = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800';

                      if (testSubmitted) {
                        if (oIdx === q.correctIndex) {
                          btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                        } else if (selectedOpt === oIdx) {
                          btnStyle = 'border-rose-500 bg-rose-50 text-rose-900';
                        } else {
                          btnStyle = 'opacity-50 border-slate-200 bg-white text-slate-400';
                        }
                      } else if (selectedOpt === oIdx) {
                        btnStyle = 'border-amber-500 bg-amber-50 text-amber-950 font-bold';
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={testSubmitted}
                          onClick={() => setTestAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))}
                          className={`text-left p-3 rounded-xl border text-xs sm:text-sm transition-all ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {testSubmitted && (
                    <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                      💡 {q.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Test Submit / Results */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            {!testSubmitted ? (
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-between">
                {Object.keys(testAnswers).length < dayPlan.dailyTest.length && (
                  <span className="text-xs text-amber-800 font-semibold flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>
                      جاوب على جميع الأسئلة أولاً: ({Object.keys(testAnswers).length} / {dayPlan.dailyTest.length}) سؤال تم الإجابة عليه 🔒
                    </span>
                  </span>
                )}
                <button
                  onClick={handleDailyTestSubmit}
                  disabled={Object.keys(testAnswers).length < dayPlan.dailyTest.length}
                  className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                    Object.keys(testAnswers).length >= dayPlan.dailyTest.length
                      ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'
                      : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed select-none'
                  }`}
                >
                  {Object.keys(testAnswers).length < dayPlan.dailyTest.length && <Lock className="w-4 h-4" />}
                  <span>تصحيح الاختبار وتسجيل النتيجة</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-between">
                {testScore !== null && testScore >= 80 ? (
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-emerald-900">
                        🎉 مبروك! لقد أكملت Day {dayPlan.dayNumber} بنجاح ({testScore}%)!
                      </h4>
                      <p className="text-xs text-emerald-700">
                        تم تسجيل تقدمك في الكتاب وفتح صفحات اليوم التالي.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-8 h-8 text-amber-500 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-amber-900">
                        النتيجة: {testScore}% (أقل من الحد الأدنى 80%)
                      </h4>
                      <p className="text-xs text-amber-700">
                        يُرجى مراجعة التمارين وقواعد الدرس ثم إعادة المحاولة لتحقيق 80% على الأقل.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  {testScore !== null && testScore < 80 && (
                    <button
                      onClick={() => {
                        setTestSubmitted(false);
                        setTestAnswers({});
                      }}
                      className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold"
                    >
                      إعادة المحاولة
                    </button>
                  )}

                  {testScore !== null && testScore >= 80 && (
                    <>
                      <button
                        onClick={() => setActiveStage('post_routine')}
                        className={`w-full sm:w-auto px-5 py-3 rounded-xl font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          isImmersionDayComplete(dayPlan.dayNumber)
                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                            : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 animate-pulse'
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                        <span>
                          {isImmersionDayComplete(dayPlan.dayNumber)
                            ? 'تشيك ليست الإتقان مكتملة (6/6) ✅'
                            : '⏱️ بدا روتين الإتقان والكرونو (إجباري لفتح اليوم الموالي) 🔥'}
                        </span>
                      </button>

                      {onNavigateToDay && (
                        isImmersionDayComplete(dayPlan.dayNumber) ? (
                          <button
                            onClick={() => onNavigateToDay(dayPlan.dayNumber + 1)}
                            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                          >
                            <span>دوز لـ Day {dayPlan.dayNumber + 1} 🚀</span>
                            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setActiveStage('post_routine')}
                            title={`خاصك تكمل روتين ما بعد الدرس وفيديو Easy German لـ Day ${dayPlan.dayNumber} أولاً!`}
                            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-xs sm:text-sm border border-slate-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
                          >
                            <Lock className="w-4 h-4 text-amber-600" />
                            <span>Day {dayPlan.dayNumber + 1} مقفل (كمل الروتين أولاً) 🔒</span>
                          </button>
                        )
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* STAGE 10: DAILY IMMERSION ROUTINE & CHRONOMETER */}
      {/* ===================================================================== */}
      {activeStage === 'post_routine' && (
        <DailyImmersionChecklistView
          dayNumber={dayPlan.dayNumber}
          vocabularyList={dayPlan.vocabulary}
          onFinishRoutine={() => setActiveStage('daily_test')}
          onNavigateToNextDay={onNavigateToDay ? () => onNavigateToDay(dayPlan.dayNumber + 1) : undefined}
          nextDayAvailable={Boolean(onNavigateToDay)}
        />
      )}

      {/* Persistent Next Day Banner when Day is Completed */}
      {(progress.completedDays.includes(dayPlan.dayNumber) ||
        (testSubmitted && testScore !== null && testScore >= 80)) &&
        onNavigateToDay && (
          <div className="rounded-2xl border-2 border-emerald-300/80 bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-emerald-950">
                  {isImmersionDayComplete(dayPlan.dayNumber)
                    ? `🎉 كملتي Day ${dayPlan.dayNumber} كاملاً بنسبة 100% (الدرس + الروتين)!`
                    : `⚠️ كملتي درس Day ${dayPlan.dayNumber}، ولكن متبقي روتين الإتقان!`}
                </h4>
                <p className="text-xs text-emerald-800">
                  {isImmersionDayComplete(dayPlan.dayNumber)
                    ? `النتيجة: ${progress.testScores[dayPlan.dayNumber] !== undefined ? `${progress.testScores[dayPlan.dayNumber]}%` : `${testScore || 100}%`} • مبروك، Day ${dayPlan.dayNumber + 1} مفتوح دابا وتقدر تبدا فيه مباشرة.`
                    : `باش يتحل Day ${dayPlan.dayNumber + 1}، خاصك تكمل روتين ما بعد الدرس (تشيك ليست الإتقان 6/6 وفيديو Easy German).`}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setActiveStage('post_routine')}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                  isImmersionDayComplete(dayPlan.dayNumber)
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 animate-pulse'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {isImmersionDayComplete(dayPlan.dayNumber)
                    ? 'تشيك ليست الإتقان (مكتملة 6/6 ✅)'
                    : 'إكمال روتين الإتقان ⏱️ (مطلوب لفتح اليوم التالي)'}
                </span>
              </button>

              {isImmersionDayComplete(dayPlan.dayNumber) ? (
                <button
                  onClick={() => onNavigateToDay(dayPlan.dayNumber + 1)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <span>دوز لـ Day {dayPlan.dayNumber + 1} 🚀</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>
              ) : (
                <button
                  onClick={() => setActiveStage('post_routine')}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-200 text-slate-500 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-300 transition-all cursor-pointer"
                  title="أكمل روتين الإتقان أولاً لفتح اليوم الموالي"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Day {dayPlan.dayNumber + 1} مقفل 🔒</span>
                </button>
              )}
            </div>
          </div>
        )}
    </div>
  );
};
