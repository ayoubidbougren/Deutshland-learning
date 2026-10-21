import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  Film,
  BookOpen,
  PenTool,
  Volume2,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Award,
  ArrowRight,
  ArrowLeft,
  VolumeX,
  Eye,
  EyeOff,
  Flame,
  Check,
  Plus,
  Bell,
  BellRing,
  Minus,
  Sliders,
  Square,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getDailyImmersion, DailyImmersionData, VideoSegment, isImmersionDayUnlocked } from '../../data/dailyImmersionData';
import { BookVocabularyItem } from '../../types/bookCourse';
import { EasyGermanDailyVideoCard } from './EasyGermanDailyVideoCard';

interface DailyImmersionChecklistViewProps {
  dayNumber: number;
  vocabularyList?: BookVocabularyItem[];
  onFinishRoutine?: () => void;
  onNavigateToNextDay?: () => void;
  nextDayAvailable?: boolean;
  onRoutineCompleted?: (dayNumber: number) => void;
}

export const DailyImmersionChecklistView: React.FC<DailyImmersionChecklistViewProps> = ({
  dayNumber,
  vocabularyList = [],
  onFinishRoutine,
  onNavigateToNextDay,
  nextDayAvailable = true,
  onRoutineCompleted,
}) => {
  const immersionData: DailyImmersionData = getDailyImmersion(dayNumber);

  // Storage key for checklist state
  const storageKey = `german_immersion_day_${dayNumber}_v1`;

  // Checklist items state: 6 actionable steps (including Easy German daily video)
  const [checkedItems, setCheckedItems] = useState<{
    timer: boolean;
    video: boolean;
    reading: boolean;
    writing: boolean;
    speaking: boolean;
    easyGerman: boolean;
  }>({
    timer: false,
    video: false,
    reading: false,
    writing: false,
    speaking: false,
    easyGerman: false,
  });

  // Chronometer / Timer state
  const [totalSeconds, setTotalSeconds] = useState<number>(15 * 60); // 15 mins default
  const [secondsLeft, setSecondsLeft] = useState<number>(15 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerFinished, setTimerFinished] = useState<boolean>(false);
  const [isAlarmRinging, setIsAlarmRinging] = useState<boolean>(false);
  const [customMinutesInput, setCustomMinutesInput] = useState<string>('15');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const alarmAudioNodesRef = useRef<Array<{ osc: OscillatorNode; gain: GainNode }>>([]);
  const alarmTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize or resume shared AudioContext on user interaction
  const getAudioContext = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return null;
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new AudioCtx();
      }
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      return audioContextRef.current;
    } catch (e) {
      console.warn('AudioContext init error:', e);
      return null;
    }
  };

  // Reading state
  const [showReadingTranslation, setShowReadingTranslation] = useState<boolean>(false);
  const [isSpeakingText, setIsSpeakingText] = useState<boolean>(false);
  const [speechSpeed, setSpeechSpeed] = useState<number>(0.9);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Writing state
  const [userWritingText, setUserWritingText] = useState<string>('');
  const [showModelAnswer, setShowModelAnswer] = useState<boolean>(false);
  const [writingAnalysis, setWritingAnalysis] = useState<{
    wordCount: number;
    hasGoodLength: boolean;
    capitalizationTips: string[];
    feedbackMessage: string;
    isSaved: boolean;
  } | null>(null);

  // Active view section tab
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'reading' | 'writing' | 'vocab' | 'easyGerman'>('all');

  // Video Segment & Auto-Stop State (1h 43m divided across 24 days)
  const videoSegment: VideoSegment | undefined = immersionData.videoSession.segment;
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [videoSecondsLeft, setVideoSecondsLeft] = useState<number>(videoSegment?.durationSeconds || 259);
  const [videoSegmentFinished, setVideoSegmentFinished] = useState<boolean>(false);
  const [showAutoStopBanner, setShowAutoStopBanner] = useState<boolean>(false);
  const videoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const youtubeIframeRef = useRef<HTMLIFrameElement | null>(null);

  // Load saved checklist & user text from localStorage on mount / dayNumber change
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.checkedItems) {
          setCheckedItems({
            timer: !!parsed.checkedItems.timer,
            video: !!parsed.checkedItems.video,
            reading: !!parsed.checkedItems.reading,
            writing: !!parsed.checkedItems.writing,
            speaking: !!parsed.checkedItems.speaking,
            easyGerman: !!parsed.checkedItems.easyGerman,
          });
        }
        if (parsed.userWritingText) setUserWritingText(parsed.userWritingText);
        if (parsed.timerFinished) setTimerFinished(parsed.timerFinished);
      } else {
        setCheckedItems({
          timer: false,
          video: false,
          reading: false,
          writing: false,
          speaking: false,
          easyGerman: false,
        });
        setUserWritingText('');
        setTimerFinished(false);
      }
    } catch (e) {
      console.warn('Error loading immersion checklist state:', e);
    }

    // Reset timer
    setTotalSeconds(15 * 60);
    setSecondsLeft(15 * 60);
    setIsTimerRunning(false);
    setSelectedQuizAnswers({});
    setQuizSubmitted(false);
    setWritingAnalysis(null);
    setShowModelAnswer(false);
    setShowReadingTranslation(false);

    // Reset video segment timer & state for the new day
    const seg = immersionData.videoSession.segment;
    setVideoSecondsLeft(seg?.durationSeconds || 259);
    setIsVideoPlaying(false);
    setVideoSegmentFinished(false);
    setShowAutoStopBanner(false);
    if (videoTimerRef.current) {
      clearInterval(videoTimerRef.current);
      videoTimerRef.current = null;
    }
  }, [dayNumber]);

  // Persist state to localStorage
  const saveState = (updatedChecked: typeof checkedItems, updatedText = userWritingText, isTimerDone = timerFinished) => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          checkedItems: updatedChecked,
          userWritingText: updatedText,
          timerFinished: isTimerDone,
          savedAt: new Date().toISOString(),
        })
      );
    } catch (e) {
      console.warn('Error saving immersion state:', e);
    }
  };

  // Step-by-step locking conditions:
  // Step 1 (video) is always open.
  // Step 2 (reading) requires Step 1 (video) completion.
  // Step 3 (writing) requires Step 2 (reading) completion.
  // Step 4 (speaking) requires Step 3 (writing) completion.
  // Step 5 (easyGerman) requires Step 4 (speaking, or writing if no vocab) completion.
  const isVideoUnlocked = true;
  const isReadingUnlocked = Boolean(checkedItems.video);
  const isWritingUnlocked = Boolean(checkedItems.reading);
  const isSpeakingUnlocked = Boolean(checkedItems.writing);
  const isEasyGermanUnlocked = Boolean(
    vocabularyList.length > 0 ? checkedItems.speaking : checkedItems.writing
  );

  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  const showLockedNotice = (message: string) => {
    setLockedNotice(message);
    setTimeout(() => {
      setLockedNotice(null);
    }, 4500);
  };

  // Toggle checklist item with strict sequential requirements
  const toggleCheckItem = (key: keyof typeof checkedItems) => {
    // If user is unchecking, allow it (subsequent steps will become locked)
    if (checkedItems[key]) {
      const updated = { ...checkedItems, [key]: false };
      setCheckedItems(updated);
      saveState(updated);
      return;
    }

    // Checking item: Enforce prerequisites
    if (key === 'reading' && !checkedItems.video) {
      showLockedNotice('🔒 ما تقدرش تدوز لنص القراءة حتى تأكد إكمال مشاهدة مقطع الاستماع أولاً!');
      setActiveTab('video');
      const el = document.getElementById('video-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (key === 'writing' && !checkedItems.reading) {
      showLockedNotice('🔒 ما تقدرش تدوز لمهمة التعبير الكتابي حتى تكمل وتأكد قراءة النص وفهمه أولاً!');
      setActiveTab('reading');
      const el = document.getElementById('reading-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (key === 'speaking' && !checkedItems.writing) {
      showLockedNotice('🔒 ما تقدرش تدوز لترديد الفوكابولير حتى تكمل مهمة التعبير الكتابي أولاً!');
      setActiveTab('writing');
      const el = document.getElementById('writing-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (key === 'easyGerman' && !checkedItems.speaking && vocabularyList.length > 0) {
      showLockedNotice('🔒 ما تقدرش تدوز لفيديو Easy German حتى تكمل نطق وترديد كلمات اليوم أولاً!');
      setActiveTab('vocab');
      const el = document.getElementById('vocab-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const updated = { ...checkedItems, [key]: true };
    setCheckedItems(updated);
    saveState(updated);
    playChimeSound(520, 0.2);

    // If all items checked now, trigger celebration
    const allChecked = Object.values(updated).every(Boolean);
    if (allChecked) {
      triggerConfetti();
      playChimeSound(660, 0.4);
      onRoutineCompleted?.(dayNumber);
    }
  };

  // Timer Tick Effect
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current as NodeJS.Timeout);
            setIsTimerRunning(false);
            setTimerFinished(true);
            playAlarmRingtone();
            triggerConfetti();

            // Automatically check timer item
            setCheckedItems((current) => {
              const updated = { ...current, timer: true };
              saveState(updated, userWritingText, true);
              return updated;
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, userWritingText]);

  // Stop alarm ringtone
  const stopAlarmRingtone = () => {
    if (alarmTimeoutRef.current) {
      clearTimeout(alarmTimeoutRef.current);
      alarmTimeoutRef.current = null;
    }
    alarmAudioNodesRef.current.forEach(({ osc, gain }) => {
      try {
        gain.gain.setValueAtTime(0, 0);
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // node already stopped
      }
    });
    alarmAudioNodesRef.current = [];
    setIsAlarmRinging(false);
  };

  // Play rich alarm ringtone (صوت رنة المنبه الكلاسيكي عند انتهاء الوقت)
  const playAlarmRingtone = () => {
    stopAlarmRingtone();
    setIsAlarmRinging(true);

    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Classic ringing chime alarm with resonant harmonic overtones
      const notes = [
        // Ring 1
        { f: 880, overtone: 1760, t: 0.0, d: 0.28 },
        { f: 784, overtone: 1568, t: 0.3, d: 0.28 },
        { f: 987, overtone: 1974, t: 0.6, d: 0.35 },
        // Ring 2
        { f: 880, overtone: 1760, t: 1.15, d: 0.28 },
        { f: 784, overtone: 1568, t: 1.45, d: 0.28 },
        { f: 1046.5, overtone: 2093, t: 1.75, d: 0.4 },
        // Ring 3
        { f: 880, overtone: 1760, t: 2.35, d: 0.25 },
        { f: 987, overtone: 1974, t: 2.65, d: 0.25 },
        { f: 1174.66, overtone: 2349, t: 2.95, d: 0.5 },
        // Ring 4 (Climax Chime)
        { f: 1046.5, overtone: 2093, t: 3.65, d: 0.3 },
        { f: 1318.5, overtone: 2637, t: 4.0, d: 0.7 },
      ];

      notes.forEach(({ f, overtone, t, d }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime + t);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + t);
        gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + d);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + t);
        osc.stop(ctx.currentTime + t + d);
        alarmAudioNodesRef.current.push({ osc, gain });

        // Metallic bell overtone
        const oscO = ctx.createOscillator();
        const gainO = ctx.createGain();
        oscO.type = 'sine';
        oscO.frequency.setValueAtTime(overtone, ctx.currentTime + t);
        gainO.gain.setValueAtTime(0.001, ctx.currentTime + t);
        gainO.gain.linearRampToValueAtTime(0.2, ctx.currentTime + t + 0.02);
        gainO.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + d * 0.85);

        oscO.connect(gainO);
        gainO.connect(ctx.destination);
        oscO.start(ctx.currentTime + t);
        oscO.stop(ctx.currentTime + t + d);
        alarmAudioNodesRef.current.push({ osc: oscO, gain: gainO });
      });

      // Automatically reset ringing banner after ring completes
      alarmTimeoutRef.current = setTimeout(() => {
        setIsAlarmRinging(false);
        alarmAudioNodesRef.current = [];
      }, 5200);
    } catch (e) {
      console.warn('Audio alarm error:', e);
    }
  };

  // Timer Controls
  const startTimer = () => {
    stopAlarmRingtone();
    getAudioContext();
    setIsTimerRunning(true);
  };
  const pauseTimer = () => setIsTimerRunning(false);
  const resetTimer = (newDurationSecs = totalSeconds) => {
    stopAlarmRingtone();
    getAudioContext();
    setIsTimerRunning(false);
    setSecondsLeft(newDurationSecs);
    setTotalSeconds(newDurationSecs);
    setTimerFinished(false);
  };
  const addMinutes = (mins: number) => {
    getAudioContext();
    setSecondsLeft((prev) => Math.max(10, prev + mins * 60));
    setTotalSeconds((prev) => Math.max(10, prev + mins * 60));
    setTimerFinished(false);
  };

  // Set any custom minutes desired by the user
  const applyCustomMinutes = (minsVal?: number) => {
    stopAlarmRingtone();
    getAudioContext();
    const val = minsVal !== undefined ? minsVal : parseInt(customMinutesInput, 10);
    if (isNaN(val) || val <= 0) return;
    const clampedMins = Math.min(180, Math.max(1, val));
    const newSecs = clampedMins * 60;
    setCustomMinutesInput(clampedMins.toString());
    resetTimer(newSecs);
    setShowCustomInput(false);
  };

  // Quick adjust duration (+/- 1 min or +/- 5 min)
  const adjustMinutes = (delta: number) => {
    stopAlarmRingtone();
    getAudioContext();
    const currentMins = Math.floor(secondsLeft / 60);
    const newMins = Math.max(1, Math.min(180, currentMins + delta));
    const newSecs = newMins * 60;
    setCustomMinutesInput(newMins.toString());
    setSecondsLeft(newSecs);
    setTotalSeconds(newSecs);
    setTimerFinished(false);
  };

  // Web Audio Synth Chime (no external files needed)
  const playChimeSound = (freq = 587.33, duration = 0.3) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration * 0.5);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio might be blocked by browser policy until user interaction
    }
  };

  // Confetti trigger
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
      });
    } catch (e) {
      // Canvas confetti fallback
    }
  };

  // Helper to send commands to embedded YouTube Player via postMessage
  const sendYoutubeCommand = (func: 'playVideo' | 'pauseVideo' | 'seekTo' | 'stopVideo', args: any[] = []) => {
    if (youtubeIframeRef.current && youtubeIframeRef.current.contentWindow) {
      try {
        youtubeIframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func,
            args,
          }),
          '*'
        );
      } catch (e) {
        console.warn('Error sending command to YouTube iframe:', e);
      }
    }
  };

  // Video Segment Countdown & Auto-Stop Effect
  useEffect(() => {
    if (isVideoPlaying && videoSecondsLeft > 0) {
      videoTimerRef.current = setInterval(() => {
        setVideoSecondsLeft((prev) => {
          if (prev <= 1) {
            if (videoTimerRef.current) {
              clearInterval(videoTimerRef.current);
              videoTimerRef.current = null;
            }
            setIsVideoPlaying(false);
            sendYoutubeCommand('pauseVideo');
            setVideoSegmentFinished(true);
            setShowAutoStopBanner(true);
            playChimeSound(880, 0.6);
            triggerConfetti();

            // Automatically check video item in checklist & save
            setCheckedItems((current) => {
              const updated = { ...current, video: true };
              saveState(updated);
              return updated;
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isVideoPlaying && videoTimerRef.current) {
      clearInterval(videoTimerRef.current);
      videoTimerRef.current = null;
    }

    return () => {
      if (videoTimerRef.current) {
        clearInterval(videoTimerRef.current);
      }
    };
  }, [isVideoPlaying, videoSecondsLeft]);

  // Bidirectional synchronization between YouTube player and countdown timer
  useEffect(() => {
    const handleWindowMessage = (event: MessageEvent) => {
      try {
        let payload = event.data;
        if (typeof payload === 'string') {
          try {
            payload = JSON.parse(payload);
          } catch {
            return;
          }
        }
        if (!payload || typeof payload !== 'object') return;

        // 1. YouTube onStateChange event
        // 1: PLAYING, 2: PAUSED, 0: ENDED, 3: BUFFERING
        if (payload.event === 'onStateChange') {
          const state = payload.info;
          if (state === 1) {
            // Video started playing in YouTube player -> start countdown
            setIsVideoPlaying(true);
            setShowAutoStopBanner(false);
          } else if (state === 2) {
            // Video paused in YouTube player -> pause countdown
            setIsVideoPlaying(false);
          } else if (state === 0) {
            // Video ended
            setIsVideoPlaying(false);
            setVideoSegmentFinished(true);
            setShowAutoStopBanner(true);
          }
        }

        // 2. YouTube infoDelivery event
        if (payload.event === 'infoDelivery' && payload.info) {
          const { playerState, currentTime } = payload.info;
          if (playerState !== undefined) {
            if (playerState === 1) {
              setIsVideoPlaying(true);
              setShowAutoStopBanner(false);
            } else if (playerState === 2) {
              setIsVideoPlaying(false);
            } else if (playerState === 0) {
              setIsVideoPlaying(false);
              setVideoSegmentFinished(true);
              setShowAutoStopBanner(true);
            }
          }

          if (typeof currentTime === 'number' && videoSegment) {
            if (currentTime >= videoSegment.endSeconds) {
              sendYoutubeCommand('pauseVideo');
              setIsVideoPlaying(false);
              setVideoSegmentFinished(true);
              setShowAutoStopBanner(true);
              setVideoSecondsLeft(0);
            } else if (currentTime >= videoSegment.startSeconds) {
              const remaining = Math.max(0, Math.floor(videoSegment.endSeconds - currentTime));
              setVideoSecondsLeft(remaining);
            }
          }
        }
      } catch (e) {
        // ignore
      }
    };

    window.addEventListener('message', handleWindowMessage);

    // Periodic handshake listening ping so YouTube delivers state events
    const pingInterval = setInterval(() => {
      if (youtubeIframeRef.current && youtubeIframeRef.current.contentWindow) {
        try {
          youtubeIframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: 'listening', id: 'nicos-weg-player' }),
            '*'
          );
        } catch (e) {}
      }
    }, 2000);

    return () => {
      window.removeEventListener('message', handleWindowMessage);
      clearInterval(pingInterval);
    };
  }, [videoSegment]);

  // Video Segment Control Handlers
  const handleStartVideo = () => {
    setIsVideoPlaying(true);
    setShowAutoStopBanner(false);
    sendYoutubeCommand('playVideo');
  };

  const handlePauseVideo = () => {
    setIsVideoPlaying(false);
    sendYoutubeCommand('pauseVideo');
  };

  const handleReplayVideo = () => {
    const seg = immersionData.videoSession.segment;
    const startSec = seg?.startSeconds || 0;
    setVideoSecondsLeft(seg?.durationSeconds || 259);
    setVideoSegmentFinished(false);
    setShowAutoStopBanner(false);
    setIsVideoPlaying(true);
    sendYoutubeCommand('seekTo', [startSec, true]);
    sendYoutubeCommand('playVideo');
  };

  const handleCompleteVideoManually = () => {
    sendYoutubeCommand('pauseVideo');
    setIsVideoPlaying(false);
    setVideoSegmentFinished(true);
    setShowAutoStopBanner(true);
    setCheckedItems((current) => {
      const updated = { ...current, video: true };
      saveState(updated);
      return updated;
    });
    playChimeSound(660, 0.4);
    triggerConfetti();
  };

  const formatSecs = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // German Text-To-Speech
  const speakGermanText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('المتصفح لا يدعم ميزة نطق الصوت');
      return;
    }

    if (isSpeakingText) {
      window.speechSynthesis.cancel();
      setIsSpeakingText(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = speechSpeed;

    utterance.onstart = () => setIsSpeakingText(true);
    utterance.onend = () => setIsSpeakingText(false);
    utterance.onerror = () => setIsSpeakingText(false);

    window.speechSynthesis.speak(utterance);
  };

  // Analyze User Writing
  const handleAnalyzeWriting = () => {
    const trimmed = userWritingText.trim();
    if (!trimmed) {
      setWritingAnalysis({
        wordCount: 0,
        hasGoodLength: false,
        capitalizationTips: [],
        feedbackMessage: 'يُرجى كتابة بضع جمل أولاً لتحليلها!',
        isSaved: false,
      });
      return;
    }

    const words = trimmed.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const minTarget = immersionData.writingSession.targetWordCount.min;
    const hasGoodLength = wordCount >= minTarget;

    // Check capitalization in German (Substantive großgeschrieben)
    const capitalizationTips: string[] = [];
    words.forEach((w) => {
      // check if common nouns start lowercase
      const commonNouns = [
        'Tag', 'Name', 'Stadt', 'Wohnung', 'Zimmer', 'Kaffee', 'Tee', 'Wasser',
        'Buch', 'Schule', 'Kurs', 'Termin', 'Uhr', 'Freund', 'Familie', 'Arbeit'
      ];
      const match = commonNouns.find((n) => n.toLowerCase() === w.toLowerCase());
      if (match && w[0] === w[0].toLowerCase()) {
        capitalizationTips.push(`الكلمة "${w}" اسم ويجب أن تبدأ بحرف كبير بالألمانية: "${match}".`);
      }
    });

    let feedbackMessage = '';
    if (wordCount >= minTarget) {
      feedbackMessage = `🎉 عمل رائع جداً! كتبت ${wordCount} كلمة وتجاوزت الهدف الأدنى (${minTarget} كلمة).`;
    } else {
      feedbackMessage = `👍 بداية جيدة (${wordCount} كلمة). حاول إضافة جملة أو جملتين للوصول إلى ${minTarget} كلمة على الأقل!`;
    }

    setWritingAnalysis({
      wordCount,
      hasGoodLength,
      capitalizationTips,
      feedbackMessage,
      isSaved: true,
    });

    // Check the writing item in checklist
    if (wordCount >= minTarget) {
      const updated = { ...checkedItems, writing: true };
      setCheckedItems(updated);
      saveState(updated, userWritingText);
    } else {
      saveState(checkedItems, userWritingText);
    }
  };

  // Format Time (MM:SS)
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  // Calculate Progress Percent (6 items total including Easy German)
  const totalTasks = 6;
  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  if (!isImmersionDayUnlocked(dayNumber)) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-amber-200 bg-amber-50/50 p-8 sm:p-12 text-center space-y-5 max-w-xl mx-auto my-6 shadow-xs backdrop-blur-xs">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-800 flex items-center justify-center mx-auto border border-amber-300 shadow-xs">
          <Lock className="w-8 h-8 text-amber-700" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
            <Lock className="w-3.5 h-3.5" />
            روتين Day {dayNumber} مقفل حالياً 🔒
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            لا يمكنك بدء روتين Day {dayNumber} قبل إكمال اليوم السابق
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            باش يتحل ليك روتين <span className="font-bold text-amber-900">Day {dayNumber}</span>، خاصك تكمل أولاً{' '}
            <span className="font-bold text-amber-900">Day {dayNumber - 1}</span> بنسبة 100% (درس اليوم، الاختبار اليومي، وجميع مهام الروتين الست بما فيها فيديو Easy German).
          </p>
        </div>

        <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center items-center">
          {onFinishRoutine && (
            <button
              onClick={onFinishRoutine}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Clock className="w-4 h-4" />
              <span>الرجوع لليوم المتاح لإكماله</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div id="daily-immersion-container" className="space-y-6 text-slate-800">
      {/* Hero Header with Chrono Badge & Overview */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-700/50">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>روتين ما بعد إكمال الدرس • Day {dayNumber}</span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight">
              تشيك ليست الإتقان والانغماس اليومي ⏱️
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              «كل نهار كملتيه كدير موراها هاد الروتين: كرونو ربع ساعة، تفرج فمقطع، اقرا نص قصير، واكتب تعبيرك
              اليومي باش تثبت اللي قريتيه بنسبة 100%!»
            </p>

            {/* Checklist Progress Bar */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-amber-300">
                  تقدمك في الروتين: {completedCount} من {totalTasks} مهام مكتملة
                </span>
                <span className="text-white font-mono">{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-700/70 rounded-full overflow-hidden p-0.5 border border-slate-600/50">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Interactive Chronometer Widget */}
          <div className="bg-slate-950/70 backdrop-blur-md rounded-2xl p-5 border border-slate-700/70 shadow-2xl flex flex-col items-center min-w-[300px] max-w-sm w-full">
            {/* Header: Title, Status & Ringtone Test */}
            <div className="flex items-center justify-between w-full mb-2 text-xs text-slate-400 gap-2">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>الكرونو التفاعلي</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (isAlarmRinging) {
                      stopAlarmRingtone();
                    } else {
                      playAlarmRingtone();
                    }
                  }}
                  title="تجربة صوت رنة المنبه"
                  className={`px-2 py-0.5 rounded-full border text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    isAlarmRinging
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-amber-300 hover:border-amber-400/50'
                  }`}
                >
                  <Bell className="w-3 h-3" />
                  <span>{isAlarmRinging ? 'إيقاف الرنة' : 'تجربة الرنة'}</span>
                </button>
                <span className="font-mono text-slate-400 text-[11px]">
                  {isAlarmRinging
                    ? '🔔 يرن!'
                    : isTimerRunning
                    ? '🟢 شغال'
                    : timerFinished
                    ? '🎉 انتهى'
                    : '⏸️ متوقف'}
                </span>
              </div>
            </div>

            {/* Ringing Alert Notification Banner */}
            {isAlarmRinging && (
              <div className="w-full mb-3 p-2.5 rounded-xl bg-gradient-to-r from-amber-500/25 via-rose-500/25 to-amber-500/25 border border-amber-400/70 text-amber-200 text-xs flex items-center justify-between gap-2 animate-pulse shadow-lg">
                <div className="flex items-center gap-2 font-bold">
                  <BellRing className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span>🔔 سالا وقت الكرونو!</span>
                </div>
                <button
                  onClick={stopAlarmRingtone}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[11px] font-black shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>إيقاف</span>
                </button>
              </div>
            )}

            {/* Big Timer Display with Step Adjusters */}
            <div className="flex items-center justify-center gap-2.5 w-full my-1">
              <button
                disabled={isTimerRunning}
                onClick={() => adjustMinutes(-5)}
                title="إنقاص 5 دقائق"
                className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-[11px] font-bold disabled:opacity-40 transition-all cursor-pointer"
              >
                -5د
              </button>
              <button
                disabled={isTimerRunning}
                onClick={() => adjustMinutes(-1)}
                title="إنقاص دقيقة"
                className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-[11px] font-bold disabled:opacity-40 transition-all cursor-pointer"
              >
                -1د
              </button>

              <div
                className={`font-mono text-4xl sm:text-5xl font-black tracking-wider transition-colors px-2 ${
                  isAlarmRinging
                    ? 'text-rose-400 animate-bounce'
                    : timerFinished
                    ? 'text-emerald-400 animate-pulse'
                    : isTimerRunning
                    ? 'text-amber-400'
                    : 'text-white'
                }`}
              >
                {formatTime(secondsLeft)}
              </div>

              <button
                disabled={isTimerRunning}
                onClick={() => adjustMinutes(1)}
                title="زيادة دقيقة"
                className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-[11px] font-bold disabled:opacity-40 transition-all cursor-pointer"
              >
                +1د
              </button>
              <button
                disabled={isTimerRunning}
                onClick={() => adjustMinutes(5)}
                title="زيادة 5 دقائق"
                className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-[11px] font-bold disabled:opacity-40 transition-all cursor-pointer"
              >
                +5د
              </button>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 w-full my-2.5">
              {[
                { label: '5 د', secs: 5 * 60 },
                { label: '10 د', secs: 10 * 60 },
                { label: '15 د ⭐', secs: 15 * 60 },
                { label: '20 د', secs: 20 * 60 },
                { label: '25 د', secs: 25 * 60 },
                { label: '30 د', secs: 30 * 60 },
              ].map((preset) => (
                <button
                  key={preset.secs}
                  disabled={isTimerRunning}
                  onClick={() => resetTimer(preset.secs)}
                  className={`px-1.5 py-1 text-[11px] font-bold rounded-lg border transition-all text-center ${
                    totalSeconds === preset.secs
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom Time Control Row (User can input whatever duration they want) */}
            <div className="w-full bg-slate-900/70 rounded-xl p-2 border border-slate-800/90 mb-3">
              <div className="flex items-center gap-1.5 w-full">
                <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                  ⏱️ وقت مخصص:
                </span>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={customMinutesInput}
                  onChange={(e) => setCustomMinutesInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') applyCustomMinutes();
                  }}
                  disabled={isTimerRunning}
                  className="w-16 px-2 py-1 bg-slate-950 border border-slate-700 focus:border-amber-400 text-amber-300 font-bold text-xs rounded-lg text-center outline-none disabled:opacity-50"
                  placeholder="دقائق"
                />
                <span className="text-[11px] text-slate-400">دقيقة</span>
                <button
                  onClick={() => applyCustomMinutes()}
                  disabled={isTimerRunning}
                  className="flex-1 py-1 px-2.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold rounded-lg text-xs transition-all cursor-pointer text-center disabled:opacity-40"
                >
                  تطبيق
                </button>
              </div>
            </div>

            {/* Timer Action Buttons */}
            <div className="flex items-center gap-2 w-full">
              {!isTimerRunning ? (
                <button
                  onClick={startTimer}
                  className="flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>بدا الكرونو ⏱️</span>
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="flex-1 py-2.5 px-4 bg-amber-500/20 border border-amber-500/50 hover:bg-amber-500/30 text-amber-300 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>توقف مؤقت</span>
                </button>
              )}

              <button
                onClick={() => resetTimer(totalSeconds)}
                title="إعادة ضبط المؤقت"
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => addMinutes(5)}
                title="إضافة 5 دقائق سريعة"
                className="px-2.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                +5د
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist Quick Actions Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>قائمة المهام السريعة لليوم (انقر لتعليم ما أنجزته):</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2.5">
          {/* Step 1: Timer */}
          <button
            onClick={() => toggleCheckItem('timer')}
            className={`p-3 rounded-xl border text-right transition-all flex items-start gap-2.5 cursor-pointer ${
              checkedItems.timer
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="mt-0.5">
              {checkedItems.timer ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
              ) : (
                <Circle className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div className="text-xs">
              <span className="font-bold block">1. الكرونو (15 دقيقة)</span>
              <span className="text-[11px] text-slate-700">تشغيل والالتزام بالوقت</span>
            </div>
          </button>

          {/* Step 2: Video */}
          <button
            onClick={() => toggleCheckItem('video')}
            className={`p-3 rounded-xl border text-right transition-all flex items-start gap-2.5 cursor-pointer ${
              checkedItems.video
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="mt-0.5">
              {checkedItems.video ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
              ) : (
                <Circle className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div className="text-xs">
              <span className="font-bold block">2. الاستماع للمقطع 🎬</span>
              <span className="text-[11px] text-slate-700">مشاهدة بتركيز والتقاط الكلمات</span>
            </div>
          </button>

          {/* Step 3: Reading */}
          <button
            onClick={() => toggleCheckItem('reading')}
            className={`p-3 rounded-xl border text-right transition-all flex items-start gap-2.5 cursor-pointer ${
              checkedItems.reading
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold'
                : !isReadingUnlocked
                ? 'bg-slate-100/70 border-slate-200 text-slate-400 opacity-60'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="mt-0.5">
              {checkedItems.reading ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
              ) : !isReadingUnlocked ? (
                <Lock className="w-4 h-4 text-slate-400" />
              ) : (
                <Circle className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div className="text-xs">
              <span className="font-bold flex items-center gap-1">
                <span>3. قراءة النص 📖</span>
                {!isReadingUnlocked && <span className="text-[10px] text-amber-700 font-bold">🔒</span>}
              </span>
              <span className="text-[11px] text-slate-500">
                {!isReadingUnlocked ? 'أكمل مشاهدة الفيديو أولاً' : 'قراءة بصوت عالٍ وفهم المعاني'}
              </span>
            </div>
          </button>

          {/* Step 4: Writing */}
          <button
            onClick={() => toggleCheckItem('writing')}
            className={`p-3 rounded-xl border text-right transition-all flex items-start gap-2.5 cursor-pointer ${
              checkedItems.writing
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold'
                : !isWritingUnlocked
                ? 'bg-slate-100/70 border-slate-200 text-slate-400 opacity-60'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="mt-0.5">
              {checkedItems.writing ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
              ) : !isWritingUnlocked ? (
                <Lock className="w-4 h-4 text-slate-400" />
              ) : (
                <Circle className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div className="text-xs">
              <span className="font-bold flex items-center gap-1">
                <span>4. كتابة النص ✍️</span>
                {!isWritingUnlocked && <span className="text-[10px] text-amber-700 font-bold">🔒</span>}
              </span>
              <span className="text-[11px] text-slate-500">
                {!isWritingUnlocked ? 'أكمل قراءة النص أولاً' : 'كتابة 4-6 جمل وحفظها'}
              </span>
            </div>
          </button>

          {/* Step 5: Speaking */}
          <button
            onClick={() => toggleCheckItem('speaking')}
            className={`p-3 rounded-xl border text-right transition-all flex items-start gap-2.5 cursor-pointer ${
              checkedItems.speaking
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold'
                : !isSpeakingUnlocked
                ? 'bg-slate-100/70 border-slate-200 text-slate-400 opacity-60'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="mt-0.5">
              {checkedItems.speaking ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
              ) : !isSpeakingUnlocked ? (
                <Lock className="w-4 h-4 text-slate-400" />
              ) : (
                <Circle className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div className="text-xs">
              <span className="font-bold flex items-center gap-1">
                <span>5. ترديد الفوكابولير 🗣️</span>
                {!isSpeakingUnlocked && <span className="text-[10px] text-amber-700 font-bold">🔒</span>}
              </span>
              <span className="text-[11px] text-slate-500">
                {!isSpeakingUnlocked ? 'أكمل التعبير الكتابي أولاً' : 'نطق الـ 10 كلمات بالصوت'}
              </span>
            </div>
          </button>

          {/* Step 6: Easy German Daily Video */}
          <button
            onClick={() => toggleCheckItem('easyGerman')}
            className={`p-3 rounded-xl border text-right transition-all flex items-start gap-2.5 cursor-pointer ${
              checkedItems.easyGerman
                ? 'bg-amber-50/90 border-amber-300 text-amber-950 font-bold'
                : !isEasyGermanUnlocked
                ? 'bg-slate-100/70 border-slate-200 text-slate-400 opacity-60'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="mt-0.5">
              {checkedItems.easyGerman ? (
                <CheckCircle2 className="w-4 h-4 text-amber-600 fill-amber-100" />
              ) : !isEasyGermanUnlocked ? (
                <Lock className="w-4 h-4 text-slate-400" />
              ) : (
                <Circle className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div className="text-xs">
              <span className="font-bold flex items-center gap-1">
                <span>6. فيديو Easy German 🎬</span>
                {!isEasyGermanUnlocked && <span className="text-[10px] text-amber-700 font-bold">🔒</span>}
              </span>
              <span className="text-[11px] text-slate-500">
                {!isEasyGermanUnlocked ? 'أكمل نطق الكلمات أولاً' : 'حلقة اليوم من بلايليست A1'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Locked Notice Alert Banner */}
      {lockedNotice && (
        <div className="bg-amber-50 border-2 border-amber-300 text-amber-950 px-4 py-3 rounded-2xl flex items-center gap-2.5 text-xs font-bold shadow-sm animate-pulse">
          <Lock className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{lockedNotice}</span>
        </div>
      )}

      {/* Tabs navigation for in-depth practice */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          كل الأقسام معاً
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'video'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>1. مقطع الاستماع والفيديو 🎬</span>
        </button>
        <button
          onClick={() => {
            if (!isReadingUnlocked) {
              showLockedNotice('🔒 نص القراءة السريع مقفول! أكمل مشاهدة مقطع الاستماع وأكد مشاهدته أولاً.');
              return;
            }
            setActiveTab('reading');
          }}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            !isReadingUnlocked
              ? 'opacity-60 text-slate-400 bg-slate-50 cursor-not-allowed'
              : activeTab === 'reading'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {isReadingUnlocked ? <BookOpen className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-amber-600" />}
          <span>2. نص القراءة السريع 📖 {!isReadingUnlocked && '(مقفل 🔒)'}</span>
        </button>
        <button
          onClick={() => {
            if (!isWritingUnlocked) {
              showLockedNotice('🔒 مهمة التعبير الكتابي مقفولة! أكمل وتأكد قراءة النص السريع أولاً.');
              return;
            }
            setActiveTab('writing');
          }}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            !isWritingUnlocked
              ? 'opacity-60 text-slate-400 bg-slate-50 cursor-not-allowed'
              : activeTab === 'writing'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {isWritingUnlocked ? <PenTool className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-amber-600" />}
          <span>3. مهمة التعبير الكتابي ✍️ {!isWritingUnlocked && '(مقفل 🔒)'}</span>
        </button>
        <button
          onClick={() => {
            if (!isSpeakingUnlocked) {
              showLockedNotice('🔒 تمرين نطق الفوكابولير مقفول! أكمل مهمة التعبير الكتابي أولاً.');
              return;
            }
            setActiveTab('vocab');
          }}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            !isSpeakingUnlocked
              ? 'opacity-60 text-slate-400 bg-slate-50 cursor-not-allowed'
              : activeTab === 'vocab'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {isSpeakingUnlocked ? <Volume2 className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-amber-600" />}
          <span>4. نطق الفوكابولير الـ 10 🗣️ {!isSpeakingUnlocked && '(مقفل 🔒)'}</span>
        </button>
        <button
          onClick={() => {
            if (!isEasyGermanUnlocked) {
              showLockedNotice('🔒 فيديو Easy German مقفول! أكمل ترديد ونطق كلمات اليوم أولاً.');
              return;
            }
            setActiveTab('easyGerman');
          }}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            !isEasyGermanUnlocked
              ? 'opacity-60 text-slate-400 bg-slate-50 cursor-not-allowed'
              : activeTab === 'easyGerman'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {isEasyGermanUnlocked ? <Film className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-amber-600" />}
          <span>5. فيديو Easy German اليومي 📺🇩🇪 {!isEasyGermanUnlocked && '(مقفل 🔒)'}</span>
        </button>
      </div>

      {/* SECTION 1: Video / Film Clip Immersion */}
      {(activeTab === 'all' || activeTab === 'video') && (
        <div id="video-section" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5 scroll-mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                <Film className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                  المهمة الأولى • جلسة الاستماع (15 دقيقة)
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {immersionData.videoSession.titleAr}
                </h3>
              </div>
            </div>

            <button
              onClick={() => toggleCheckItem('video')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto ${
                checkedItems.video
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {checkedItems.video ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>تمت المشاهدة بنجاح ✅</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4" />
                  <span>تأكيد إكمال المشاهدة</span>
                </>
              )}
            </button>
          </div>

          {/* Listening Strategy Box */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-950 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>ميثود الاستماع في 15 دقيقة (Hör-Methode):</span>
            </div>
            <p className="leading-relaxed">
              {immersionData.videoSession.listeningMissionAr}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-[11px]">
              <div className="bg-white/80 p-2 rounded-xl border border-amber-200 font-semibold">
                1️⃣ تفرج أول مرة بدون ترجمة لفهم الموقف العام
              </div>
              <div className="bg-white/80 p-2 rounded-xl border border-amber-200 font-semibold">
                2️⃣ سجل 3 كلمات أو تعابير سمعتيها
              </div>
              <div className="bg-white/80 p-2 rounded-xl border border-amber-200 font-semibold">
                3️⃣ عاود نطق جملة واحدة بصوت عالي (Shadowing)
              </div>
            </div>
          </div>

          {/* 1h:43m Video Segmentation Info Header & Auto-Stop Overview */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                    فيلم كامل 1h:43m • مقسم على 24 يوم
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    إيقاف تلقائي عند نهاية الحصة 🛑
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-black text-slate-100">
                  {videoSegment?.segmentTitleAr || `مقطع اليوم ${dayNumber} من فيلم Nicos Weg A1`}
                </h4>
                <div className="text-xs text-slate-400">
                  توقيت مقطع اليوم: من الدقيقة <span className="text-amber-400 font-mono font-bold">{videoSegment?.startFormatted || '00:00'}</span> إلى <span className="text-amber-400 font-mono font-bold">{videoSegment?.endFormatted || '04:19'}</span> ({videoSegment?.durationFormatted || '4:19 دقيقة'})
                </div>
              </div>

              {/* Direct External YouTube Link */}
              <a
                href={videoSegment?.youtubeDirectUrl || `https://www.youtube.com/watch?v=4-eDoThe6qo`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-700 self-start sm:self-auto shrink-0"
                title="فتح المقطع على موقع YouTube في نافذة جديدة"
              >
                <ExternalLink className="w-3.5 h-3.5 text-red-400" />
                <span>فتح المقطع على YouTube 🎬</span>
              </a>
            </div>

            {/* 24-Day Filmstrip Timeline Track */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>الشريط الزمني للفيلم كاملاً (1h 43m • 24 يوم):</span>
                <span className="font-mono text-amber-400 font-bold">
                  اليوم {dayNumber} من 24 • {Math.round((dayNumber / 24) * 100)}% من الفيلم
                </span>
              </div>
              <div className="grid grid-cols-12 sm:grid-cols-24 gap-1 p-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
                {Array.from({ length: 24 }).map((_, i) => {
                  const dayIdx = i + 1;
                  const isCurrent = dayIdx === dayNumber;
                  const isPast = dayIdx < dayNumber;
                  return (
                    <div
                      key={dayIdx}
                      className={`h-4 sm:h-5 rounded-sm transition-all flex items-center justify-center text-[9px] font-mono font-bold relative group ${
                        isCurrent
                          ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-300 animate-pulse'
                          : isPast
                          ? 'bg-emerald-600/80 text-white'
                          : 'bg-slate-800/80 text-slate-500'
                      }`}
                      title={`اليوم ${dayIdx}: من ${Math.floor(((dayIdx - 1) * 259) / 60)}:${(((dayIdx - 1) * 259) % 60).toString().padStart(2, '0')} إلى ${Math.floor((dayIdx * 259) / 60)}:${((dayIdx * 259) % 60).toString().padStart(2, '0')}`}
                    >
                      {dayIdx}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                <span>00:00 (بداية الفيلم)</span>
                <span>51:48 (منتصف الفيلم - Day 12)</span>
                <span>1:43:36 (نهاية الفيلم - Day 24)</span>
              </div>
            </div>

            {/* Video Segment Auto-Stop Playback Controller Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                {/* Status Indicator */}
                <div
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    videoSegmentFinished
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : isVideoPlaying
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      videoSegmentFinished
                        ? 'bg-emerald-400'
                        : isVideoPlaying
                        ? 'bg-amber-400 animate-ping'
                        : 'bg-slate-500'
                    }`}
                  />
                  <span>
                    {videoSegmentFinished
                      ? '🎉 انتهى مقطع اليوم وتم الإيقاف التلقائي'
                      : isVideoPlaying
                      ? `🟢 المقطع شغال (${formatSecs(videoSecondsLeft)} متبقية)`
                      : `⏸️ متوقف مؤقتاً (${formatSecs(videoSecondsLeft)})`}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 hidden sm:block">
                  المدة الإجمالية لحصة اليوم: <span className="font-mono text-slate-200 font-bold">{videoSegment?.durationFormatted || '4:19'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                {!isVideoPlaying ? (
                  <button
                    onClick={handleStartVideo}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>تشغيل مقطع اليوم ▶️</span>
                  </button>
                ) : (
                  <button
                    onClick={handlePauseVideo}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>توقف مؤقت ⏸️</span>
                  </button>
                )}

                <button
                  onClick={handleReplayVideo}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-all border border-slate-700"
                  title="إعادة تشغيل المقطع من البداية"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>إعادة المقطع ↺</span>
                </button>

                {!videoSegmentFinished && (
                  <button
                    onClick={handleCompleteVideoManually}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
                    title="تأكيد إكمال المشاهدة يدوياً"
                  >
                    <Check className="w-3 h-3" />
                    <span>أكملت المشاهدة ✅</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Auto-Stop Toast Banner (shown when auto-stop triggers) */}
          {showAutoStopBanner && (
            <div className="bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 border border-emerald-300 rounded-2xl p-4 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-black text-xs sm:text-sm">
                    🎉 تم توقيف الفيديو تلقائياً! انتهت حصة اليوم ({videoSegment?.durationFormatted}).
                  </div>
                  <div className="text-[11px] text-emerald-800">
                    تفرجتي فـ مقطع اليوم من الدقيقة {videoSegment?.startFormatted} إلى {videoSegment?.endFormatted}. تم تعليم المهمة في التشيك ليست بنجاح ✅
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleReplayVideo}
                  className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-50 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>إعادة المشاهدة</span>
                </button>
                <button
                  onClick={() => setShowAutoStopBanner(false)}
                  className="px-2.5 py-1.5 rounded-lg hover:bg-emerald-100 text-emerald-800 text-xs font-bold cursor-pointer"
                >
                  إغلاق ✕
                </button>
              </div>
            </div>
          )}

          {/* Embedded Video Player Container with Auto-Stop End Overlay */}
          <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md aspect-video relative flex items-center justify-center">
            {/* Auto-Stop Overlay after finishing today's segment */}
            {videoSegmentFinished && (
              <div className="absolute inset-0 z-10 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-white font-black text-base sm:text-lg">
                  🎉 انتهى مقطع اليوم بنجاح وتم إيقاف الفيديو تلقائياً!
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
                  تفرجتي في حصة اليوم ({videoSegment?.durationFormatted}) من الدقيقة <span className="font-bold text-amber-400 font-mono">{videoSegment?.startFormatted}</span> حتى <span className="font-bold text-amber-400 font-mono">{videoSegment?.endFormatted}</span>.
                  تم تسجيل إكمال المهمة في التشيك ليست بنجاح ✅
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    onClick={handleReplayVideo}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>إعادة تشغيل مقطع اليوم ↺</span>
                  </button>
                  <button
                    onClick={() => {
                      if (!checkedItems.video) {
                        toggleCheckItem('video');
                      }
                      setActiveTab('reading');
                      const el = document.getElementById('reading-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-md"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>تأكيد المشاهدة والانتقال لنص القراءة 📖</span>
                  </button>
                  <a
                    href={videoSegment?.youtubeDirectUrl || `https://www.youtube.com/watch?v=4-eDoThe6qo`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>فتح المقطع على YouTube</span>
                  </a>
                </div>
              </div>
            )}

            {/* Segmented YouTube iFrame Player */}
            <iframe
              ref={youtubeIframeRef}
              id="nicos-weg-yt-iframe"
              key={`yt-segment-player-${dayNumber}`}
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoSegment?.youtubeId || '4-eDoThe6qo'}?start=${videoSegment?.startSeconds || 0}&end=${videoSegment?.endSeconds || 259}&enablejsapi=1&rel=0&widgetid=1`}
              title={`Nicos Weg A1 - Tag ${dayNumber} (${videoSegment?.startFormatted || '00:00'} - ${videoSegment?.endFormatted || '04:19'})`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Key Phrases to Listen For */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span>عبارات أساسية استمع إليها في المشهد:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {immersionData.videoSession.keyPhrasesToListenFor.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs space-y-1 hover:border-amber-300 transition-all"
                >
                  <div className="font-bold text-slate-900 font-mono text-[13px] flex items-center justify-between">
                    <span>{item.german}</span>
                    <button
                      onClick={() => speakGermanText(item.german)}
                      className="p-1 hover:bg-slate-200 rounded-md text-slate-500 hover:text-amber-600 transition-colors"
                      title="استمع للنطق"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-500">{item.darija}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 1 to Step 2 Progression Banner */}
          <div className="pt-2">
            {checkedItems.video ? (
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-950 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-xs sm:text-sm font-black">
                      أحسنت! تم تأكيد مشاهدة مقطع اليوم بنجاح ✅
                    </strong>
                    <span className="text-[11px] text-emerald-800 font-medium">
                      الخطوة الثانية (نص القراءة السريع) مفتوحة الآن وجاهزة للبدء.
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('reading');
                    const el = document.getElementById('reading-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shrink-0 shadow-xs cursor-pointer transition-all"
                >
                  <span>دوز لنص القراءة (الخطوة 2) 📖</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>
              </div>
            ) : (
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-950">
                <div className="flex items-center gap-2.5 text-xs text-amber-900 font-medium">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    الخطوة 2 (نص القراءة السريع) مقفولة: تفرّج فالمقطع أولاً وأكّد مشاهدته بالزر أعلاه لفتح النص والتمارين.
                  </span>
                </div>
                <button
                  onClick={() => toggleCheckItem('video')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 cursor-pointer shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>تأكيد إكمال مشاهدة المقطع الآن</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: Daily Reading Text & Comprehension */}
      {(activeTab === 'all' || activeTab === 'reading') && (
        !isReadingUnlocked ? (
          <div id="reading-section" className="bg-slate-50/80 border-2 border-dashed border-slate-200 rounded-3xl p-6 sm:p-8 text-center space-y-4 scroll-mt-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-2xs">
              <Lock className="w-6 h-6 text-amber-700" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                الخطوة 2 مقفولة 🔒
              </span>
              <h4 className="text-base sm:text-lg font-black text-slate-800">
                المهمة الثانية • نص القراءة السريع والفهم (Lesetext)
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                ما دوزش لنص القراءة حتى تأكد إكمال مشاهدة مقطع الاستماع والفيديو أولاً.
                تفرّج فالمقطع واضغط على زر <strong className="text-slate-900">"تأكيد إكمال المشاهدة"</strong> في قسم الاستماع لفتح هذا النص والتمارين.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab('video');
                const el = document.getElementById('video-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer transition-all shadow-xs inline-flex items-center gap-1.5"
            >
              <Film className="w-3.5 h-3.5" />
              <span>الرجوع لمقطع الاستماع لإكماله أولاً</span>
            </button>
          </div>
        ) : (
          <div id="reading-section" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5 scroll-mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-black">
                  <BookOpen className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
                    المهمة الثانية • نص القراءة السريع (Lesetext)
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {immersionData.readingSession.titleDe} ({immersionData.readingSession.titleAr})
                  </h3>
                </div>
              </div>

              <button
                onClick={() => toggleCheckItem('reading')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto ${
                  checkedItems.reading
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {checkedItems.reading ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>تمت القراءة بنجاح ✅</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" />
                    <span>تأكيد إكمال القراءة</span>
                  </>
                )}
              </button>
            </div>

            {/* Reading Controls (Audio TTS & Darija Toggle) */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => speakGermanText(immersionData.readingSession.germanText)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer ${
                    isSpeakingText
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {isSpeakingText ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>إيقاف الصوت</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>استمع للنص كاملاً 🔊</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setSpeechSpeed(speechSpeed === 0.9 ? 0.75 : 0.9)}
                  className="px-2.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  السرعة: {speechSpeed === 0.9 ? 'طبيعية (1x)' : 'بطيئة (0.75x) 🐢'}
                </button>
              </div>

              <button
                onClick={() => setShowReadingTranslation(!showReadingTranslation)}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {showReadingTranslation ? <EyeOff className="w-3.5 h-3.5 text-blue-600" /> : <Eye className="w-3.5 h-3.5 text-blue-600" />}
                <span>{showReadingTranslation ? 'إخفاء الترجمة بالدارجة' : 'إظهار الترجمة بالدارجة 🇲🇦'}</span>
              </button>
            </div>

            {/* German Passage Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200 text-slate-900 leading-relaxed font-serif text-sm sm:text-base space-y-3">
              <p className="select-text whitespace-pre-line tracking-wide">
                {immersionData.readingSession.germanText}
              </p>
            </div>

            {/* Optional Darija Translation Box */}
            {showReadingTranslation && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 text-xs sm:text-sm leading-relaxed space-y-1">
                <span className="font-bold text-amber-900 block text-xs">🇲🇦 الترجمة والشرح بالدارجة:</span>
                <p className="whitespace-pre-line select-text">
                  {immersionData.readingSession.darijaTranslation}
                </p>
              </div>
            )}

            {/* Comprehension Quiz Check */}
            {immersionData.readingSession.comprehensionQuiz.length > 0 && (
              <div className="pt-2 space-y-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span>سؤال الفهم السريع (Leseverstehen Quick Check):</span>
                </h4>

                {immersionData.readingSession.comprehensionQuiz.map((quiz, qIdx) => (
                  <div key={qIdx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <p className="text-xs sm:text-sm font-bold text-slate-900">
                      {qIdx + 1}. {quiz.questionAr}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {quiz.options.map((opt, oIdx) => {
                        const isSelected = selectedQuizAnswers[qIdx] === oIdx;
                        const isCorrect = oIdx === quiz.correctIndex;
                        let btnStyle = 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800';

                        if (quizSubmitted) {
                          if (isCorrect) btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                          else if (isSelected) btnStyle = 'bg-rose-100 border-rose-400 text-rose-950';
                        } else if (isSelected) {
                          btnStyle = 'bg-blue-100 border-blue-500 text-blue-950 font-bold';
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={quizSubmitted}
                            onClick={() => setSelectedQuizAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))}
                            className={`p-2.5 rounded-xl border text-xs text-right transition-all cursor-pointer ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <p className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                        💡 {quiz.explanationAr}
                      </p>
                    )}
                  </div>
                ))}

                {!quizSubmitted ? (
                  <button
                    disabled={Object.keys(selectedQuizAnswers).length === 0}
                    onClick={() => setQuizSubmitted(true)}
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                  >
                    تحقق من إجابتك ✅
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setQuizSubmitted(false);
                      setSelectedQuizAnswers({});
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                  >
                    إعادة السؤال
                  </button>
                )}
              </div>
            )}

            {/* Step 2 to Step 3 Progression Banner */}
            <div className="pt-2">
              {checkedItems.reading ? (
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-950 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="block text-xs sm:text-sm font-black">
                        ممتاز! تم تأكيد إكمال قراءة النص وفهمه بنجاح ✅
                      </strong>
                      <span className="text-[11px] text-emerald-800 font-medium">
                        الخطوة الثالثة (مهمة التعبير الكتابي) مفتوحة الآن.
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('writing');
                      const el = document.getElementById('writing-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shrink-0 shadow-xs cursor-pointer transition-all"
                  >
                    <span>دوز للتعبير الكتابي (الخطوة 3) ✍️</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                </div>
              ) : (
                <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-blue-950">
                  <div className="flex items-center gap-2.5 text-xs text-blue-900 font-medium">
                    <Lock className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      الخطوة 3 (التعبير الكتابي) مقفولة: اقرأ النص جيداً وأكّد قراءته بالزر أعلاه لفتح مهمة الكتابة.
                    </span>
                  </div>
                  <button
                    onClick={() => toggleCheckItem('reading')}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>تأكيد إكمال القراءة الآن</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* SECTION 3: Daily Writing Task (Schreibaufgabe) */}
      {(activeTab === 'all' || activeTab === 'writing') && (
        !isWritingUnlocked ? (
          <div id="writing-section" className="bg-slate-50/80 border-2 border-dashed border-slate-200 rounded-3xl p-6 sm:p-8 text-center space-y-4 scroll-mt-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-2xs">
              <Lock className="w-6 h-6 text-amber-700" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                الخطوة 3 مقفولة 🔒
              </span>
              <h4 className="text-base sm:text-lg font-black text-slate-800">
                المهمة الثالثة • مهمة التعبير الكتابي اليومي (Schreibaufgabe)
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                ما دوزش للتعبير الكتابي حتى تكمل وتأكد قراءة النص السريع في الخطوة 2 أولاً.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab('reading');
                const el = document.getElementById('reading-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-xs inline-flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>الرجوع لنص القراءة لإكماله أولاً</span>
            </button>
          </div>
        ) : (
          <div id="writing-section" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5 scroll-mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                  <PenTool className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                    المهمة الثالثة • مهمة التعبير الكتابي اليومي (Schreibaufgabe)
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {immersionData.writingSession.titleAr}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => toggleCheckItem('writing')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto ${
                  checkedItems.writing
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {checkedItems.writing ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>تمت الكتابة بنجاح ✅</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" />
                    <span>تأكيد إكمال الكتابة</span>
                  </>
                )}
              </button>
            </div>

          {/* Writing Instruction Card */}
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 text-xs text-emerald-950 space-y-2">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>المطلوب منك اليوم:</span>
            </div>
            <p className="leading-relaxed">
              {immersionData.writingSession.instructionAr}
            </p>
            <div className="flex items-center gap-4 text-[11px] text-emerald-800 font-bold pt-1">
              <span>🎯 الهدف: من {immersionData.writingSession.targetWordCount.min} إلى {immersionData.writingSession.targetWordCount.max} كلمة</span>
              <span>📝 اكتب بالألمانية واستعمل الكلمات المقترحة</span>
            </div>
          </div>

          {/* Vocabulary Helper Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-600 block">
              كلمات مساعدة للموضوع (انقر لإدراجها في النص):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {immersionData.writingSession.suggestedWords.map((word, wIdx) => (
                <button
                  key={wIdx}
                  onClick={() => setUserWritingText((prev) => (prev ? `${prev} ${word}` : word))}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 rounded-lg text-xs font-mono transition-all cursor-pointer"
                >
                  +{word}
                </button>
              ))}
            </div>
          </div>

          {/* Writing Textarea */}
          <div className="space-y-2">
            <textarea
              value={userWritingText}
              onChange={(e) => setUserWritingText(e.target.value)}
              placeholder={`${immersionData.writingSession.starterPromptDe}\n(اكتب نصك هنا بالألمانية...)`}
              rows={6}
              dir="ltr"
              className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-slate-900 text-sm font-sans leading-relaxed transition-all resize-y shadow-inner"
            />

            {/* Word Counter & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-600 font-bold">
                  الكلمات:{' '}
                  <span
                    className={
                      userWritingText.trim().split(/\s+/).filter(Boolean).length >=
                      immersionData.writingSession.targetWordCount.min
                        ? 'text-emerald-600 font-black'
                        : 'text-amber-600'
                    }
                  >
                    {userWritingText.trim().split(/\s+/).filter(Boolean).length}
                  </span>{' '}
                  / {immersionData.writingSession.targetWordCount.min} كلمة مطلوبة
                </span>

                {writingAnalysis?.isSaved && (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>تم حفظ النص محلياً</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAnalyzeWriting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>فحص وتصحيح النص 🪄</span>
                </button>

                <button
                  onClick={() => setShowModelAnswer(!showModelAnswer)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
                >
                  {showModelAnswer ? 'إخفاء النموذج' : 'عرض نموذج إجابة مثالي 💡'}
                </button>
              </div>
            </div>
          </div>

          {/* Analysis Feedback Box */}
          {writingAnalysis && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <p className="font-bold text-slate-900">{writingAnalysis.feedbackMessage}</p>

              {writingAnalysis.capitalizationTips.length > 0 && (
                <div className="space-y-1 text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  <span className="font-bold block">ملاحظات الحروف الكبيرة (Großschreibung):</span>
                  {writingAnalysis.capitalizationTips.map((tip, idx) => (
                    <p key={idx}>• {tip}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Model Answer Toggle Card */}
          {showModelAnswer && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2 text-xs sm:text-sm">
              <span className="font-bold text-amber-950 block">💡 نموذج إجابة مثالي ومقترح (Musterbeispiel):</span>
              <p className="font-serif text-slate-900 bg-white p-3 rounded-xl border border-amber-200/80 leading-relaxed font-semibold">
                {immersionData.writingSession.sampleModelAnswerDe}
              </p>
              <p className="text-amber-900 text-xs pt-1">
                ترجمة النموذج: {immersionData.writingSession.sampleModelAnswerAr}
              </p>
            </div>
          )}

          {/* Step 3 to Step 4 Progression Banner */}
          <div className="pt-2">
            {checkedItems.writing ? (
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-950 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-xs sm:text-sm font-black">
                      أحسنت! تم تأكيد إكمال مهمة التعبير الكتابي بنجاح ✅
                    </strong>
                    <span className="text-[11px] text-emerald-800 font-medium">
                      الخطوة الرابعة (ترديد الـ 10 مفردات بالصوت) مفتوحة الآن.
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('vocab');
                    const el = document.getElementById('vocab-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shrink-0 shadow-xs cursor-pointer transition-all"
                >
                  <span>دوز لترديد المفردات (الخطوة 4) 🗣️</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-950">
                <div className="flex items-center gap-2.5 text-xs text-emerald-900 font-medium">
                  <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    الخطوة 4 (ترديد المفردات) مقفولة: اكتب فقرتك وأكّد إكمالها بالزر أعلاه لفتح تمرين النطق.
                  </span>
                </div>
                <button
                  onClick={() => toggleCheckItem('writing')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>تأكيد إكمال الكتابة الآن</span>
                </button>
              </div>
            )}
          </div>
        </div>
        )
      )}

      {/* SECTION 4: 10 Words Speaking Quick Check */}
      {(activeTab === 'all' || activeTab === 'vocab') && vocabularyList.length > 0 && (
        !isSpeakingUnlocked ? (
          <div id="vocab-section" className="bg-slate-50/80 border-2 border-dashed border-slate-200 rounded-3xl p-6 sm:p-8 text-center space-y-4 scroll-mt-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-2xs">
              <Lock className="w-6 h-6 text-amber-700" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                الخطوة 4 مقفولة 🔒
              </span>
              <h4 className="text-base sm:text-lg font-black text-slate-800">
                المهمة الرابعة • نطق الـ 10 مفردات بصوت مرتفع (Sprech-Check)
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                ما دوزش لترديد ونطق المفردات حتى تكمل وتأكد مهمة التعبير الكتابي في الخطوة 3 أولاً.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab('writing');
                const el = document.getElementById('writing-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-xs inline-flex items-center gap-1.5"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>الرجوع لمهمة التعبير الكتابي أولاً</span>
            </button>
          </div>
        ) : (
          <div id="vocab-section" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5 scroll-mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-black">
                  <Volume2 className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">
                    المهمة الرابعة • نطق الـ 10 مفردات بصوت مرتفع (Sprech-Check)
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    ترديد الكلمات الـ 10 المقررة لهذا اليوم
                  </h3>
                </div>
              </div>

              <button
                onClick={() => toggleCheckItem('speaking')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto ${
                  checkedItems.speaking
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {checkedItems.speaking ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>تم الترديد بنجاح ✅</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" />
                    <span>تأكيد إكمال الترديد</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vocabularyList.slice(0, 10).map((vItem, idx) => (
                <div
                  key={vItem.id || idx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-purple-300 transition-all flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-mono">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-slate-900 font-mono text-sm">
                        {vItem.word}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 truncate">{vItem.meaningAr}</div>
                  </div>

                  <button
                    onClick={() => speakGermanText(vItem.exampleSentence || vItem.word)}
                    title="استمع للنطق والجملة"
                    className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 transition-all shrink-0 cursor-pointer shadow-2xs"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Step 4 to Step 5 Progression Banner */}
            <div className="pt-2">
              {checkedItems.speaking ? (
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-950 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="block text-xs sm:text-sm font-black">
                        رائع! تم تأكيد ترديد ونطق مفردات اليوم بنجاح ✅
                      </strong>
                      <span className="text-[11px] text-emerald-800 font-medium">
                        الخطوة الخامسة (فيديو Easy German اليومي) مفتوحة الآن.
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('easyGerman');
                      const el = document.getElementById('easy-german-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shrink-0 shadow-xs cursor-pointer transition-all"
                  >
                    <span>دوز لفيديو Easy German (الخطوة 5) 🎬</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                </div>
              ) : (
                <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-purple-950">
                  <div className="flex items-center gap-2.5 text-xs text-purple-900 font-medium">
                    <Lock className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>
                      الخطوة 5 (Easy German) مقفولة: استمع وانطق كل كلمة ثم اضغط <strong className="text-purple-950">"تأكيد إكمال الترديد"</strong> لفتح الفيديو.
                    </span>
                  </div>
                  <button
                    onClick={() => toggleCheckItem('speaking')}
                    className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>تأكيد إكمال الترديد الآن</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* SECTION 5: Easy German Daily Immersion Video */}
      {(activeTab === 'all' || activeTab === 'easyGerman') && (
        <div id="easy-german-section" className="scroll-mt-6">
          {!isEasyGermanUnlocked ? (
            <div className="bg-slate-50/80 border-2 border-dashed border-slate-200 rounded-3xl p-6 sm:p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-2xs">
                <Lock className="w-6 h-6 text-amber-700" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                  الخطوة 5 مقفولة 🔒
                </span>
                <h4 className="text-base sm:text-lg font-black text-slate-800">
                  المهمة الخامسة • فيديو Easy German اليومي 🇩🇪
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  فيديو Easy German كيتحل تلقائياً فاش كتسالي مهام الروتين السابقة (الفيديو، نص القراءة، التعبير الكتابي، وترديد المفردات).
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('vocab');
                  const el = document.getElementById('vocab-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-xs inline-flex items-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>إكمال ترديد المفردات لفتح Easy German</span>
              </button>
            </div>
          ) : (
            <EasyGermanDailyVideoCard
              dayNumber={dayNumber}
              isCompleted={checkedItems.easyGerman}
              onToggleCompleted={(completed) => {
                const updated = { ...checkedItems, easyGerman: completed };
                setCheckedItems(updated);
                saveState(updated);
                if (Object.values(updated).every(Boolean)) {
                  triggerConfetti();
                  playChimeSound(660, 0.4);
                }
              }}
            />
          )}
        </div>
      )}

      {/* Routine Completion & Easy German Prompt */}
      {completedCount >= 5 && !checkedItems.easyGerman && (
        <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 p-6 sm:p-7 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-right">
            <div className="flex items-center justify-center sm:justify-start gap-2 font-black text-xs uppercase tracking-wider bg-slate-950/10 px-3 py-1 rounded-full w-fit mx-auto sm:mx-0">
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>مكافأة إكمال روتين اليوم!</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-950">
              🎉 برافو! ساليتي مهام الروتين ديال اليوم!
            </h3>
            <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-medium">
              دابا جا وقت فيديو اليوم من Easy German باش تطلق وذنك وتسمع الألمانية الحقيقية في الشارع!
            </p>
          </div>

          <button
            onClick={() => {
              setActiveTab('easyGerman');
              const el = document.getElementById('easy-german-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-3 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl font-black text-xs sm:text-sm shadow-lg shrink-0 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <span>شاهد فيديو Easy German دابا 📺</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180 text-amber-400" />
          </button>
        </div>
      )}

      {/* Day Completion Status Banner when not all 6 are completed */}
      {completedCount < 6 && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-700 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                <span>روتين Day {dayNumber} في طور الإنجاز ({completedCount} من 6 مكتمل)</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                اليوم الموالي (Day {dayNumber + 1}) يبقى مقفولاً 🔒 حتى تكمل جميع مهام روتين اليوم بنسبة 100%.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-3 py-1.5 rounded-xl border border-amber-200">
              متبقي {6 - completedCount} مهام
            </span>
          </div>
        </div>
      )}

      {/* Full Completion Celebration Banner (when all 6 items checked) */}
      {completedCount === 6 && (
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 sm:p-8 shadow-xl text-center space-y-4">
          <Award className="w-14 h-14 mx-auto text-amber-300 animate-bounce" />
          <h3 className="text-xl sm:text-2xl font-black">
            🎉 تبارك الله عليك! كملتي روتين الإتقان وفيديو Easy German لـ Day {dayNumber} كاملاً بنسبة 100%!
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto leading-relaxed">
            «درتي الكرونو، تفرجتي فالمقطع، قريتي النص، كتبتي التعبير، ردّدتي الفوكابولير، وتفرجتي ففيديو Easy German الواقعي! هاد الالتزام هو السر الحقيقي باش تهضر بالألمانية بطلاقة في وقت قياسي!»
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {nextDayAvailable && onNavigateToNextDay && (
              <button
                onClick={onNavigateToNextDay}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>دوز لـ Day {dayNumber + 1} دابا 🚀</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            )}

            {onFinishRoutine && (
              <button
                onClick={onFinishRoutine}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-800/80 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm border border-emerald-500/50 transition-all cursor-pointer"
              >
                العودة للدرس ↩️
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
