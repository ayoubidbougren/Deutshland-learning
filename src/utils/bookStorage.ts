import {
  CourseBook,
  UserCourseProgress,
  UserDayProgress,
  BookVocabularyItem,
  UserExerciseAttempt,
} from '../types/bookCourse';
import { DAF_KOMPAKT_A1_BOOK } from '../data/dafKompaktBookData';
import { isImmersionDayComplete } from '../data/dailyImmersionData';
import { auth, syncCourseProgressToCloud } from '../firebase';

const STORAGE_KEY_PROGRESS_PREFIX = 'german_book_course_progress_';
const STORAGE_KEY_ACTIVE_BOOK = 'german_book_course_active_book';
const STORAGE_KEY_CUSTOM_BOOKS = 'german_book_course_custom_books';

export function getActiveBook(): CourseBook {
  if (typeof window === 'undefined') return DAF_KOMPAKT_A1_BOOK;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVE_BOOK);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id && parsed.title) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading active book from storage:', e);
  }
  return DAF_KOMPAKT_A1_BOOK;
}

export function setActiveBook(book: CourseBook): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_BOOK, JSON.stringify(book));
  } catch (e) {
    console.error('Error saving active book:', e);
  }
}

export function getCustomBooks(): CourseBook[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_BOOKS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error reading custom books:', e);
  }
  return [];
}

export function saveCustomBook(book: CourseBook): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getCustomBooks().filter((b) => b.id !== book.id);
    existing.push(book);
    localStorage.setItem(STORAGE_KEY_CUSTOM_BOOKS, JSON.stringify(existing));
    setActiveBook(book);
  } catch (e) {
    console.error('Error saving custom book:', e);
  }
}

export function getUserProgress(bookId: string): UserCourseProgress {
  const defaultProgress: UserCourseProgress = {
    bookId,
    currentLesson: 1,
    currentDay: 1,
    currentPage: 8,
    completedDays: [],
    completedPages: [],
    completedExercises: {},
    vocabularyBank: {},
    mistakeCounter: {},
    speakingHistoryCount: 0,
    writingCompletions: [],
    testScores: {},
    lastActivity: new Date().toISOString(),
  };

  if (typeof window === 'undefined') return defaultProgress;

  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PROGRESS_PREFIX}${bookId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultProgress, ...parsed };
    }
  } catch (e) {
    console.warn('Error reading progress from storage:', e);
  }

  return defaultProgress;
}

export function saveUserProgress(progress: UserCourseProgress): void {
  if (typeof window === 'undefined') return;
  try {
    progress.lastActivity = new Date().toISOString();
    localStorage.setItem(
      `${STORAGE_KEY_PROGRESS_PREFIX}${progress.bookId}`,
      JSON.stringify(progress)
    );
    if (auth.currentUser) {
      syncCourseProgressToCloud(auth.currentUser.uid, progress).catch((err) => {
        console.warn('Cloud sync warning:', err);
      });
    }
  } catch (e) {
    console.error('Error saving user progress:', e);
  }
}

export function recordExerciseAttempt(
  progress: UserCourseProgress,
  exerciseId: string,
  userAnswer: string,
  isCorrect: boolean,
  category?: string
): UserCourseProgress {
  const existing = progress.completedExercises[exerciseId] || {
    exerciseId,
    userAnswer,
    isCorrect: false,
    attemptsCount: 0,
    timestamp: new Date().toISOString(),
  };

  const updatedAttempt: UserExerciseAttempt = {
    exerciseId,
    userAnswer,
    isCorrect,
    attemptsCount: existing.attemptsCount + 1,
    timestamp: new Date().toISOString(),
  };

  const updatedMistakes = { ...progress.mistakeCounter };
  if (!isCorrect && category) {
    updatedMistakes[category] = (updatedMistakes[category] || 0) + 1;
  }

  const newProgress: UserCourseProgress = {
    ...progress,
    completedExercises: {
      ...progress.completedExercises,
      [exerciseId]: updatedAttempt,
    },
    mistakeCounter: updatedMistakes,
  };

  saveUserProgress(newProgress);
  return newProgress;
}

export function updateVocabularyStatus(
  progress: UserCourseProgress,
  wordId: string,
  newStatus: 'new' | 'learning' | 'learned' | 'needs_review',
  itemDetails?: BookVocabularyItem
): UserCourseProgress {
  const currentBank = { ...progress.vocabularyBank };
  const currentItem = currentBank[wordId] || itemDetails;

  if (currentItem) {
    currentBank[wordId] = {
      ...currentItem,
      status: newStatus,
      lastReviewDate: new Date().toISOString(),
    };
  }

  const newProgress = {
    ...progress,
    vocabularyBank: currentBank,
  };

  saveUserProgress(newProgress);
  return newProgress;
}

export function completeDay(
  progress: UserCourseProgress,
  dayNumber: number,
  pages: number[],
  testScore: number
): UserCourseProgress {
  const completedDaysSet = new Set(progress.completedDays);
  completedDaysSet.add(dayNumber);

  const completedPagesSet = new Set(progress.completedPages);
  pages.forEach((p) => completedPagesSet.add(p));

  const testScores = {
    ...progress.testScores,
    [dayNumber]: testScore,
  };

  // Move to next day
  const nextDay = dayNumber + 1;

  const newProgress: UserCourseProgress = {
    ...progress,
    currentDay: nextDay,
    completedDays: Array.from(completedDaysSet),
    completedPages: Array.from(completedPagesSet),
    testScores,
  };

  saveUserProgress(newProgress);
  return newProgress;
}

export function getWeakAreas(progress: UserCourseProgress): Array<{ category: string; mistakes: number }> {
  return Object.entries(progress.mistakeCounter)
    .map(([category, mistakes]) => ({ category, mistakes }))
    .sort((a, b) => b.mistakes - a.mistakes);
}

export function calculateOverallProgress(book: CourseBook, progress: UserCourseProgress): number {
  const totalDays = book.lessons.reduce((acc, l) => acc + l.days.length, 0);
  if (totalDays === 0) return 0;
  const completed = progress.completedDays.length;
  return Math.min(100, Math.round((completed / totalDays) * 100));
}

export function isDayUnlocked(dayNumber: number, completedDays: number[] = []): boolean {
  if (dayNumber <= 1) return true;
  const prevDay = dayNumber - 1;
  const isPrevDayLessonDone = completedDays.includes(prevDay);
  const isPrevDayRoutineDone = isImmersionDayComplete(prevDay);

  // If this day was already completed previously, keep it accessible
  if (completedDays.includes(dayNumber) && isImmersionDayComplete(dayNumber)) {
    return true;
  }

  // To access day N, day N-1 must be 100% completed in both lesson/test and daily immersion routine
  return isPrevDayLessonDone && isPrevDayRoutineDone;
}

// Convenient aliases for components
export const loadCourseBook = getActiveBook;
export const saveCourseBook = setActiveBook;
export const loadUserProgress = getUserProgress;
