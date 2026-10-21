/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Square,
  Volume2,
  VolumeX,
  Radio,
  AlertCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  BookOpen,
  FileText,
  Headphones,
  RotateCcw,
  Home,
  LogIn,
  UserPlus,
  Cloud,
  ShieldCheck,
  Ban,
} from 'lucide-react';
import { useLiveVoice } from './hooks/useLiveVoice';
import { VoiceVisualizer } from './components/VoiceVisualizer';
import { VoiceSelector } from './components/VoiceSelector';
import { TranscriptView } from './components/TranscriptView';
import { DialoguePracticeView } from './components/DialoguePracticeView';
import { TopicTrainingView } from './components/TopicTrainingView';
import { ListeningStoryView } from './components/ListeningStoryView';
import { SidebarNavigation } from './components/SidebarNavigation';
import { BookCourseView } from './components/bookCourse/BookCourseView';
import { BookTutorSelector } from './components/BookTutorSelector';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { useAuth } from './context/AuthContext';
import { getBookLessonTutorProfile } from './data/bookLessonTutorData';
import { getUserProgress } from './utils/bookStorage';
import { AppMode, GermanLevel, SAMPLE_DIALOGUES, TopicPreset, SAMPLE_TOPICS } from './types';
import { parseDialogue, buildDialogueInstruction } from './utils/dialogueParser';
import { buildFreeConversationPrompt } from './utils/freeConversationPrompt';
import { buildTopicDiscussionPrompt } from './utils/topicDiscussionPrompt';

export default function App() {
  const { user, profile, isAdminUser, isSuspended, openAuthModal, logout } = useAuth();
  const {
    status,
    errorMessage,
    isMicMuted,
    isAiMuted,
    selectedVoice,
    setSelectedVoice,
    transcripts,
    inputLevel,
    outputLevel,
    startConversation,
    endConversation,
    toggleMicMute,
    toggleAiMute,
    clearTranscripts,
  } = useLiveVoice();

  // View: Landing Page (SaaS Homepage) vs App (Interactive Learning Platform) vs Admin (/admin)
  const [currentView, setCurrentView] = useState<'landing' | 'app' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin/') || hash === '#/admin') {
        return 'admin';
      }
    }
    return 'landing';
  });

  React.useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin/')) {
        setCurrentView('admin');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const goToAdminView = () => {
    try {
      window.history.pushState({}, '', '/admin');
    } catch {
      // ignore
    }
    setCurrentView('admin');
  };

  const exitAdminView = () => {
    try {
      window.history.pushState({}, '', '/');
    } catch {
      // ignore
    }
    setCurrentView('app');
  };

  // Mode: Book Course | Dialog Practice | Topic Discussion | Free Talk | Listening Stories
  const [appMode, setAppMode] = useState<AppMode>('book_course');
  const [selectedLevel, setSelectedLevel] = useState<GermanLevel>('A1');
  const [currentBookTitle, setCurrentBookTitle] = useState<string>('DaF kompakt neu A1');

  // Book-linked Free Conversation state
  const [isBookLinked, setIsBookLinked] = useState<boolean>(true);
  const [selectedBookLesson, setSelectedBookLesson] = useState<number>(() => {
    try {
      const progress = getUserProgress('daf-kompakt-neu-a1');
      return progress.currentLesson || 1;
    } catch {
      return 1;
    }
  });
  const [userCurrentLesson, setUserCurrentLesson] = useState<number>(() => {
    try {
      const progress = getUserProgress('daf-kompakt-neu-a1');
      return progress.currentLesson || 1;
    } catch {
      return 1;
    }
  });

  // Keep userCurrentLesson updated when switching modes
  React.useEffect(() => {
    if (appMode === 'free_conversation') {
      try {
        const progress = getUserProgress('daf-kompakt-neu-a1');
        const lesson = progress.currentLesson || 1;
        setUserCurrentLesson(lesson);
      } catch (e) {
        console.warn('Error reading user progress for lesson syncing:', e);
      }
    }
  }, [appMode]);

  // Dialogue practice state
  const [dialogueText, setDialogueText] = useState<string>(SAMPLE_DIALOGUES[0].linesText);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [enableCorrection, setEnableCorrection] = useState<boolean>(true);

  // Topic Training state
  const [selectedTopic, setSelectedTopic] = useState<TopicPreset>(SAMPLE_TOPICS[0]);
  const [customTopicTitle, setCustomTopicTitle] = useState<string>(SAMPLE_TOPICS[0].title);
  const [customTopicText, setCustomTopicText] = useState<string>(SAMPLE_TOPICS[0].text);
  const [topicCorrection, setTopicCorrection] = useState<boolean>(true);

  const [showTranscripts, setShowTranscripts] = useState(true);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  const isActive = status !== 'idle' && status !== 'error';
  const isConnecting = status === 'connecting';
  const isListening = status === 'listening';
  const isSpeaking = status === 'speaking';

  // Parse lines whenever dialogueText changes
  const parsedLines = useMemo(() => parseDialogue(dialogueText), [dialogueText]);

  // Synchronize current script step based on live transcripts
  React.useEffect(() => {
    if (appMode !== 'dialogue_practice' || !isActive) {
      if (!isActive) setCurrentLineIndex(0);
      return;
    }

    const completedCount = transcripts.length;
    setCurrentLineIndex(Math.min(completedCount, parsedLines.length - 1));
  }, [transcripts, appMode, isActive, parsedLines.length]);

  const handleToggleConversation = () => {
    if (isActive) {
      endConversation();
      setCurrentLineIndex(0);
    } else {
      if (appMode === 'dialogue_practice') {
        const customInstruction = buildDialogueInstruction(parsedLines, enableCorrection, selectedLevel);
        const firstLine = parsedLines[0];
        startConversation(customInstruction, {
          mode: 'dialogue_practice',
          firstSpeaker: firstLine?.speaker || 'ai',
          firstLineText: firstLine?.text || '',
          level: selectedLevel,
        });
      } else if (appMode === 'topic_discussion') {
        const title = customTopicTitle.trim() || selectedTopic.title || 'Thema';
        const text = customTopicText.trim() || selectedTopic.text;
        const topicPrompt = buildTopicDiscussionPrompt(title, text, selectedLevel, topicCorrection);
        startConversation(topicPrompt, {
          mode: 'topic_discussion',
          topicTitle: title,
          level: selectedLevel,
        });
      } else {
        const profile = getBookLessonTutorProfile(selectedBookLesson);
        const freeConversationPrompt = buildFreeConversationPrompt({
          level: isBookLinked ? 'A1' : selectedLevel,
          bookLinked: isBookLinked,
          lessonNumber: selectedBookLesson,
          bookTitle: currentBookTitle,
        });
        startConversation(freeConversationPrompt, {
          mode: 'free_conversation',
          level: isBookLinked ? 'A1' : selectedLevel,
          firstSpeaker: isBookLinked ? 'ai' : undefined,
          firstLineText: isBookLinked ? profile.firstTurnGreetingDe : undefined,
        });
      }
    }
  };

  const handleResetScript = () => {
    if (isActive) {
      endConversation();
    }
    clearTranscripts();
    setCurrentLineIndex(0);
  };

  if (currentView === 'admin') {
    return <AdminDashboard onBackToApp={exitAdminView} />;
  }

  if (currentView === 'landing') {
    return (
      <>
        <LandingPage
          onEnterApp={() => setCurrentView('app')}
          onSelectMode={(mode) => {
            setAppMode(mode);
            setCurrentView('app');
          }}
          onOpenAdmin={goToAdminView}
        />
        <AuthModal onSuccessEnterApp={() => setCurrentView('app')} />
      </>
    );
  }

  if (isSuspended) {
    return (
      <div
        className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4"
        dir="rtl"
      >
        <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-rose-500/40 p-6 sm:p-8 text-center space-y-5 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
            <Ban className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-black text-white">
              تم إيقاف الوصول للمنصة مؤقتاً لحسابك
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              حسابك (<span className="font-mono text-slate-200">{user?.email}</span>) غير مفعل حالياً.
              يرجى التواصل مع إدارة المنصة لتفعيل باقتك واستئناف الدروس المحفوظة.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentView('landing')}
              className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer"
            >
              العودة للصفحة الرئيسية
            </button>
            <button
              type="button"
              onClick={logout}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100/60 to-slate-100 text-slate-800 flex flex-col justify-between selection:bg-slate-900 selection:text-white">
      <AuthModal />
      {/* Top Header */}
      <header className="w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('landing')}
              className="flex items-center gap-2 group cursor-pointer text-right"
              title="العودة لصفحة الموقع التعريفي الرئيسية (SaaS)"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                <Radio className="w-4 h-4 text-emerald-400 group-hover:text-slate-950" />
              </div>
              <div>
                <h1 className="text-sm font-semibold tracking-tight text-slate-900 leading-none flex items-center gap-1.5">
                  <span>Deutsch Sprechen &amp; Dialoge</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-bold border border-amber-200">
                    🇲🇦 MA
                  </span>
                </h1>
                <span className="text-[11px] text-slate-500 font-mono">
                  A1 &bull; A2 &bull; B1 Sprachtrainer &bull; Gemini Live API
                </span>
              </div>
            </button>
          </div>

          {/* Status Indicator Pill, Gmail SaaS Auth & Home Button */}
          <div className="flex items-center gap-2">
            {!user ? (
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-600" />
                <span>تسجيل الدخول</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('account')}
                className="px-2.5 py-1 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 text-slate-800 text-xs font-bold transition-all flex items-center gap-2 shadow-2xs cursor-pointer"
                title="حسابك المتصل بـ Gmail ومزامنة الدروس السحابية"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={profile?.displayName || 'User'}
                    className="w-6 h-6 rounded-lg object-cover border border-emerald-400"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-slate-900 text-amber-400 font-black text-xs flex items-center justify-center">
                    {(profile?.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline max-w-[100px] truncate text-slate-900">
                  {profile?.displayName || user.displayName || 'حسابي'}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-mono">
                  {profile?.plan === 'ausbildung_pro'
                    ? 'PRO 🇩🇪'
                    : profile?.plan === 'goethe_pass'
                    ? 'Goethe 🔥'
                    : 'Free'}
                </span>
                <Cloud className="w-3.5 h-3.5 text-emerald-600 hidden md:inline" />
              </button>
            )}

            {isAdminUser && (
              <button
                type="button"
                onClick={goToAdminView}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-black flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="لوحة تحكم الأدمن (/admin)"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}

            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                isListening
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : isSpeaking
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : isConnecting
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : status === 'error'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isListening
                    ? 'bg-emerald-500 animate-pulse'
                    : isSpeaking
                    ? 'bg-amber-500 animate-pulse'
                    : isConnecting
                    ? 'bg-blue-500 animate-ping'
                    : status === 'error'
                    ? 'bg-rose-500'
                    : 'bg-slate-400'
                }`}
              />
              <span className="truncate max-w-[110px] sm:max-w-none">
                {isListening && 'Hört zu... (Du sprichst)'}
                {isSpeaking && 'KI spricht auf Deutsch...'}
                {isConnecting && 'Verbindung...'}
                {status === 'idle' && 'Bereit zum Sprechen'}
                {status === 'error' && 'Fehler'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Page Layout: Left Sidebar + Main Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-6 flex flex-col lg:flex-row items-start gap-6">
        {/* Left Sidebar Navigation (مسار الكتاب / حوارات / تيمات / استماع / محادثة حرة) */}
        <SidebarNavigation
          appMode={appMode}
          onSelectMode={setAppMode}
          isActive={isActive}
          selectedLevel={selectedLevel}
          onSelectLevel={setSelectedLevel}
          bookTitle={currentBookTitle}
          onGoToLanding={() => setCurrentView('landing')}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 w-full flex flex-col items-center gap-6">
          {/* Error notification banner */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full max-w-md bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl flex items-start gap-3 text-sm shadow-sm"
              >
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-rose-900">Hinweis:</p>
                  <p className="text-xs mt-0.5 leading-relaxed">{errorMessage}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        {/* If Free Conversation, show Book-Linked Tutor Selector & Controls */}
        {appMode === 'free_conversation' && (
          <div className="w-full max-w-2xl flex flex-col items-center gap-3">
            <BookTutorSelector
              isBookLinked={isBookLinked}
              setIsBookLinked={setIsBookLinked}
              selectedLesson={selectedBookLesson}
              setSelectedLesson={setSelectedBookLesson}
              userCurrentLesson={userCurrentLesson}
              disabled={isActive}
              selectedLevel={selectedLevel}
              setSelectedLevel={setSelectedLevel}
            />

            {/* Multilingual Help Tip Banner */}
            <div className="w-full bg-amber-50/80 border border-amber-200/90 rounded-2xl px-4 py-3 flex items-start gap-2.5 text-xs text-amber-900 shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <p className="font-semibold text-amber-950">
                  مساعدة فورية ومترجم مدمج بالدارجة المغربية:
                </p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  إلى سولك الأستاذ (AI) على شي سؤال وما فهمتيهش، قول ليه بالصوت:{' '}
                  <span className="font-bold underline decoration-amber-500">«شرح ليا بالدارجة»</span> أو{' '}
                  <span className="font-bold underline decoration-amber-500">«ما فهمتش، عاود بسطها ليا»</span>، وغادي يترجم ليك ويشرح ليك بالدارجة مباشرة، ويعاود يرجع يهضر معاك بالألمانية بنفس بساطة الدرس الحالي!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Topic Training View */}
        {appMode === 'topic_discussion' && (
          <TopicTrainingView
            selectedTopic={selectedTopic}
            setSelectedTopic={setSelectedTopic}
            customTopicTitle={customTopicTitle}
            setCustomTopicTitle={setCustomTopicTitle}
            customTopicText={customTopicText}
            setCustomTopicText={setCustomTopicText}
            selectedLevel={selectedLevel}
            setSelectedLevel={setSelectedLevel}
            enableCorrection={topicCorrection}
            setEnableCorrection={setTopicCorrection}
            isActive={isActive}
          />
        )}

        {/* Dialogue Script Editor & Step-by-Step Flow */}
        {appMode === 'dialogue_practice' && (
          <DialoguePracticeView
            dialogueText={dialogueText}
            setDialogueText={setDialogueText}
            parsedLines={parsedLines}
            currentLineIndex={currentLineIndex}
            status={status}
            isActive={isActive}
            enableCorrection={enableCorrection}
            setEnableCorrection={setEnableCorrection}
            selectedLevel={selectedLevel}
            setSelectedLevel={setSelectedLevel}
            onStartPractice={handleToggleConversation}
            onResetPractice={handleResetScript}
          />
        )}

        {/* Listening & Stories Mode View */}
        {appMode === 'listening_stories' && (
          <ListeningStoryView
            selectedLevel={selectedLevel}
            onLevelChange={setSelectedLevel}
          />
        )}

        {/* Book Course Mode (Dynamic Name based on uploaded book) */}
        {appMode === 'book_course' && (
          <div className="w-full">
            <BookCourseView onBookTitleChange={setCurrentBookTitle} />
          </div>
        )}

        {/* Central Audio Visualizer & Live Voice Controls (for Dialogue, Topics, and Free Conversation) */}
        {appMode !== 'listening_stories' && appMode !== 'book_course' && (
          <>
            {/* Central Audio Visualizer */}
            <div className="my-1">
              <VoiceVisualizer
                status={status}
                inputLevel={inputLevel}
                outputLevel={outputLevel}
              />
            </div>

            {/* Primary Interactive Controller */}
            <div className="flex flex-col items-center gap-4 w-full">
              {/* Main Action Button */}
              <div className="relative flex items-center justify-center gap-3">
                {/* Pulsing ring when active */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-slate-900/10"
                    animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  />
                )}

                <button
                  id="main-voice-toggle-btn"
                  type="button"
                  disabled={isConnecting}
                  onClick={handleToggleConversation}
                  className={`relative z-10 flex items-center justify-center gap-3 px-8 py-4 rounded-full font-medium text-base sm:text-lg transition-all shadow-lg active:scale-95 cursor-pointer ${
                    isActive
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25'
                      : appMode === 'dialogue_practice'
                      ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/25'
                      : appMode === 'topic_discussion'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/25'
                  } ${isConnecting ? 'opacity-70 cursor-wait' : ''}`}
                >
                  {isConnecting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verbindung wird hergestellt...</span>
                    </>
                  ) : isActive ? (
                    <>
                      <Square className="w-5 h-5 fill-current" />
                      <span>Gespräch beenden (Stopp)</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-6 h-6 text-white" />
                      <span>
                        {appMode === 'dialogue_practice'
                          ? 'Dialog starten & laut vorlesen'
                          : appMode === 'topic_discussion'
                          ? 'Themen-Diskussion starten (Start)'
                          : isBookLinked
                          ? `بدء المحادثة المقيدة (Lektion ${selectedBookLesson})`
                          : 'Auf Deutsch sprechen (Start)'}
                      </span>
                    </>
                  )}
                </button>

                {/* Reset button when practicing */}
                {(appMode === 'dialogue_practice' || appMode === 'topic_discussion') && (
                  <button
                    id="reset-practice-btn"
                    type="button"
                    onClick={handleResetScript}
                    title="Von vorne beginnen / Neu starten"
                    className="p-3.5 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-600 shadow-sm transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Sub Controls when active */}
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm"
                >
                  {/* Mic Mute Toggle */}
                  <button
                    id="toggle-mic-mute-btn"
                    type="button"
                    onClick={toggleMicMute}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      isMicMuted
                        ? 'bg-amber-100 text-amber-800'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    title={isMicMuted ? 'Mikrofon einschalten' : 'Mikrofon stummschalten'}
                  >
                    {isMicMuted ? (
                      <>
                        <MicOff className="w-3.5 h-3.5 text-amber-700" />
                        <span>Mikrofon stumm</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Mikrofon aktiv</span>
                      </>
                    )}
                  </button>

                  <div className="w-px h-4 bg-slate-200" />

                  {/* AI Audio Mute Toggle */}
                  <button
                    id="toggle-ai-mute-btn"
                    type="button"
                    onClick={toggleAiMute}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      isAiMuted
                        ? 'bg-amber-100 text-amber-800'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    title={isAiMuted ? 'KI-Ton einschalten' : 'KI-Ton stummschalten'}
                  >
                    {isAiMuted ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-amber-700" />
                        <span>KI stumm</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-slate-600" />
                        <span>KI Ton an</span>
                      </>
                    )}
                  </button>
                </motion.div>
              )}

              {/* Quick Helper Tips */}
              {!isActive && (
                <div className="text-center max-w-md text-xs text-slate-500 leading-relaxed px-4">
                  <p className="font-medium text-slate-700 flex items-center justify-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>So funktioniert es:</span>
                  </p>
                  <p>
                    {appMode === 'dialogue_practice'
                      ? 'Füge deinen Dialog ein oder wähle eine Vorlage. Lies deine Rolle laut vor. Wenn du einen Fehler machst, korrigiert dich die KI sanft auf Deutsch, bevor sie ihren Part spricht!'
                      : isBookLinked
                      ? `المحادثة مقيدة ومقفلة على Lektion ${selectedBookLesson} فقط. الـ AI ما غايفوتش معاك هاد المستوى وغايستعمل فقط جمل قصيرة وبسيطة.`
                      : 'Unterhalte dich ungezwungen auf Deutsch. Die KI spricht ruhiges, deutliches Hochdeutsch (A1/A2) und hilft dir, Sprachpraxis zu sammeln.'}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Voice Selector Accordion Toggle */}
        <div className="w-full max-w-xl">
          <button
            id="toggle-voice-settings-btn"
            type="button"
            onClick={() => setShowVoiceSettings((prev) => !prev)}
            className="flex items-center justify-between w-full px-4 py-2.5 bg-white/70 hover:bg-white border border-slate-200/80 rounded-xl text-xs font-medium text-slate-600 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-slate-500" />
              <span>
                Aktuelle KI-Stimme: <strong className="text-slate-900">{selectedVoice}</strong>
              </span>
            </div>
            {showVoiceSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <AnimatePresence>
            {showVoiceSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden pt-3"
              >
                <VoiceSelector
                  selectedVoice={selectedVoice}
                  onSelectVoice={(v) => {
                    setSelectedVoice(v);
                    if (isActive) {
                      endConversation();
                      setTimeout(() => handleToggleConversation(), 300);
                    }
                  }}
                  disabled={isConnecting}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Live Transcript Section */}
        <div className="w-full max-w-xl">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Live-Transkription
            </span>
            <button
              id="toggle-transcripts-btn"
              type="button"
              onClick={() => setShowTranscripts((prev) => !prev)}
              className="text-xs text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>{showTranscripts ? 'Ausblenden' : 'Einblenden'}</span>
              {showTranscripts ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {showTranscripts && (
            <TranscriptView
              transcripts={transcripts}
              onClear={clearTranscripts}
              status={status}
            />
          )}
        </div>
      </main>
      </div>

      {/* Footer info */}
      <footer className="w-full border-t border-slate-200/70 bg-white/50 py-3.5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('landing')}
              className="font-semibold text-slate-700 hover:text-amber-600 transition-colors cursor-pointer"
            >
              &copy; Ayoub Id Bougren &bull; الصفحة الرئيسية (SaaS)
            </button>
            <span className="text-slate-300 hidden sm:inline">&bull;</span>
            <span>Deutsch Sprachtrainer A1 &bull; A2 &bull; B1</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <span>Gemini Live API &bull; Google AI Studio</span>
            <span>🇲🇦 نسخة المغرب</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
