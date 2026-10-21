export type VocabularyStatus = 'new' | 'learning' | 'learned' | 'needs_review';

export interface BookVocabularyItem {
  id: string;
  word: string;
  article?: 'der' | 'die' | 'das';
  plural?: string;
  meaningAr: string;
  exampleSentence: string;
  sentenceTranslationAr: string;
  lessonNumber: number;
  pageNumber: number;
  status: VocabularyStatus;
  mistakeCount: number;
  lastReviewDate?: string;
  nextReviewDate?: string;
}

export type GrammarTopic = BookGrammarTopic;

export interface BookGrammarTopic {
  id: string;
  titleDe: string;
  titleAr: string;
  lessonNumber?: number;
  pageNumber?: number;
  summaryDe: string;
  summaryAr: string;
  explanationAr?: string;
  rules?: string[];
  tables?: Array<{
    title: string;
    headers: string[];
    rows: string[][];
  }>;
  examples: Array<{
    de: string;
    ar: string;
    note?: string;
  }>;
  telegramVideo?: {
    id: number;
    lessonTitle: string;
    url: string;
    note?: string;
  };
}

export interface ExerciseItem {
  id: string;
  bookId: string;
  lessonNumber: number;
  pageNumber: number;
  exerciseNumber: string; // e.g. "1b", "2a", "4"
  source: 'book' | 'ai_generated';
  section: string; // e.g. "A Guten Tag!", "B Sprachen öffnen Türen"
  instructionDe: string;
  instructionAr: string;
  type: 'fill_gap' | 'multiple_choice' | 'sentence_order' | 'translate';
  prompt: string;
  options?: string[];
  correctAnswer: string;
  acceptableAnswers?: string[];
  hint: string;
  explanationDe: string;
  explanationAr: string;
  grammarCategory?: string; // e.g. "Akkusativ", "Artikel", "Konjugation"
}

export interface SpeakingPrompt {
  id: string;
  titleDe: string;
  titleAr: string;
  situationDe: string;
  starterQuestion: string;
  expectedTopic: string;
  sampleUserAnswers: string[];
  vocabularyHints: string[];
}

export interface WritingPrompt {
  id: string;
  titleDe: string;
  titleAr: string;
  taskDe: string;
  taskAr: string;
  minSentences: number;
  exampleText: string;
  keyPhrases: string[];
}

export interface ListeningExerciseQuestion {
  id: string;
  questionDe: string;
  questionAr?: string;
  options: string[];
  correctIndex: number;
  explanationDe: string;
  explanationAr: string;
}

export interface ListeningBookTaskItem {
  id: string;
  labelDe: string;
  labelAr?: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface ListeningBookTask {
  id: string;
  titleDe: string;
  titleAr: string;
  instructionDe: string;
  instructionAr: string;
  type: 'matching' | 'table' | 'true-false' | 'fill-gap';
  items: ListeningBookTaskItem[];
}

export interface ListeningExerciseItem {
  id: string;
  titleDe: string;
  titleAr: string;
  situationDe: string;
  situationAr: string;
  pageNumber: number;
  audioTrackLabel?: string; // e.g. "Track 01" / "Audio 1.2"
  youtubeVideoId?: string; // YouTube video ID from the DaF kompakt neu A1 playlist (e.g. "s3E0I_Ggn6M")
  youtubePlaylistId?: string; // Optional playlist ID (defaults to "PLIVqNAXwu9qhbY0ZxGcp7kRNrcu21ihXM")
  dialogueSpeakerA?: string;
  dialogueSpeakerB?: string;
  fullTranscriptDe: string;
  transcriptAr?: string;
  audioLines: Array<{
    speaker: string;
    textDe: string;
    textAr?: string;
    gender?: 'female' | 'male';
  }>;
  questions: ListeningExerciseQuestion[];
  bookTasks?: ListeningBookTask[];
  tipDarija?: string;
}

export interface DailyTestQuestion {
  id: string;
  type: 'vocabulary' | 'grammar' | 'reading' | 'translation';
  questionDe: string;
  questionAr?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}

export interface DayLessonPlan {
  dayNumber: number;
  lessonNumber: number;
  lessonTitleDe: string;
  lessonTitleAr: string;
  sectionTitleDe: string;
  sectionTitleAr: string;
  pages: number[]; // e.g. [8, 9]
  warmUp: {
    titleDe: string;
    titleAr: string;
    introDe: string;
    introAr: string;
    quickTip: string;
  };
  vocabulary: BookVocabularyItem[];
  grammar: BookGrammarTopic[];
  bookExercises: ExerciseItem[];
  listeningExercises?: ListeningExerciseItem[];
  speaking: SpeakingPrompt;
  writing: WritingPrompt;
  dailyTest: DailyTestQuestion[];
}

export interface BookLesson {
  lessonNumber: number;
  titleDe: string;
  titleAr: string;
  topicSummaryDe: string;
  kursbuchPages: { start: number; end: number };
  arbeitsbuchPages?: { start: number; end: number };
  sections: Array<{
    letter: string; // "A", "B", "C"
    titleDe: string;
    titleAr: string;
    page: number;
  }>;
  days: DayLessonPlan[];
}

export interface CourseBook {
  id: string;
  title: string; // e.g. "DaF kompakt neu A1"
  subtitle?: string; // "Kurs- und Übungsbuch"
  level: string; // "A1"
  publisher?: string; // "Ernst Klett Sprachen"
  totalPages: number; // 145
  importedAt: string;
  isBuiltIn: boolean;
  fileName?: string;
  uploadedAt?: string;
  lessons: BookLesson[];
}

export interface UserExerciseAttempt {
  exerciseId: string;
  userAnswer: string;
  isCorrect: boolean;
  attemptsCount: number;
  timestamp: string;
}

export interface UserDayProgress {
  dayNumber: number;
  isCompleted: boolean;
  completedAt?: string;
  stagesCompleted: {
    warmUp: boolean;
    vocabulary: boolean;
    grammar: boolean;
    bookExercises: boolean;
    listening?: boolean;
    aiExercises: boolean;
    speaking: boolean;
    writing: boolean;
    review: boolean;
    dailyTest: boolean;
  };
  testScore?: number; // 0 to 100
  testAttempts?: number;
}

export interface UserCourseProgress {
  bookId: string;
  currentLesson: number;
  currentDay: number;
  currentPage: number;
  completedDays: number[];
  completedPages: number[];
  completedExercises: Record<string, UserExerciseAttempt>;
  vocabularyBank: Record<string, BookVocabularyItem>;
  mistakeCounter: Record<string, number>; // e.g. { "Akkusativ": 4, "Artikel": 3 }
  speakingHistoryCount: number;
  writingCompletions: Array<{
    dayNumber: number;
    text: string;
    feedback: string;
    score: number;
    date: string;
  }>;
  testScores: Record<number, number>; // dayNumber -> score%
  lastActivity: string;
}

export type BookCourseSubTab =
  | 'overview'
  | 'today_lesson'
  | 'lessons'
  | 'vocabulary'
  | 'grammar'
  | 'exercises'
  | 'speaking'
  | 'writing'
  | 'progress';
