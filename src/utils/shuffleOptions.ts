/**
 * Deterministically and idempotently arranges multiple-choice options so that
 * the correct answer is never predictably in the first position (index 0) and
 * never repeats the same position consecutively across items in a task.
 */

function computeSeed(seedStr: string): number {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash * 31 + seedStr.charCodeAt(i)) >>> 0;
  }
  return hash;
}

const SEQUENCES_3: number[][] = [
  [1, 2, 0, 1, 2, 1, 0, 2],
  [2, 1, 0, 2, 1, 2, 0, 1],
  [1, 2, 1, 0, 2, 1, 2, 0],
];

const SEQUENCES_4: number[][] = [
  [1, 2, 3, 0, 2, 1, 3, 2],
  [2, 3, 1, 0, 3, 2, 1, 3],
  [3, 1, 2, 0, 1, 3, 2, 1],
  [1, 3, 2, 1, 0, 3, 2, 1],
];

/**
 * Given an options array and the correctAnswer string, returns a new options array
 * where the correct answer is placed at a varied position (never always index 0).
 * This function is strictly idempotent: calling it multiple times with the same
 * (itemIndex, seedKey) returns the exact same array.
 */
export function arrangeOptionsByAnswer(
  options: string[],
  correctAnswer: string,
  itemIndex: number,
  seedKey = ''
): string[] {
  if (!options || options.length <= 1 || !correctAnswer) {
    return options;
  }

  // Keep standard True/False (richtig/falsch), pure numeric sequences (1..8),
  // or book-labeled options (a., b., c. / Foto 1..4) in their natural book order
  if (
    (options.length === 2 &&
      options[0].toLowerCase().includes('richtig') &&
      options[1].toLowerCase().includes('falsch')) ||
    options.every((o) => /^\d+$/.test(o.trim())) ||
    options.every((o) => /^[a-d][.):]\s/i.test(o.trim())) ||
    options.every((o) => /^Foto\s+[1-8A-D]/i.test(o.trim()))
  ) {
    return options;
  }

  const normalizedCorrect = correctAnswer.trim().toLowerCase();
  const currentIdx = options.findIndex((o) => o.trim().toLowerCase() === normalizedCorrect);
  if (currentIdx === -1) {
    return options;
  }

  const correctOpt = options[currentIdx];
  const wrongOpts = options.filter((_, idx) => idx !== currentIdx);

  const groupHash = computeSeed(seedKey || 'default');
  const len = options.length;
  let targetIdx = 1;

  if (len === 2) {
    const seq2 = groupHash % 2 === 0 ? [1, 0, 1, 0, 1, 1, 0, 1] : [1, 1, 0, 1, 0, 1, 0, 1];
    targetIdx = seq2[itemIndex % seq2.length];
  } else if (len === 3) {
    const seq = SEQUENCES_3[groupHash % SEQUENCES_3.length];
    targetIdx = seq[itemIndex % seq.length];
  } else {
    const seq = SEQUENCES_4[groupHash % SEQUENCES_4.length];
    targetIdx = seq[itemIndex % seq.length] % len;
  }

  const result = [...wrongOpts];
  result.splice(targetIdx, 0, correctOpt);
  return result;
}

/**
 * Given an options array and a numeric correctIndex, returns a new { options, correctIndex }
 * where the correct option is placed at a varied index (never predictably index 0).
 */
export function arrangeOptionsByIndex(
  options: string[],
  correctIndex: number,
  itemIndex: number,
  seedKey = ''
): { options: string[]; correctIndex: number } {
  if (!options || options.length <= 1 || correctIndex < 0 || correctIndex >= options.length) {
    return { options, correctIndex };
  }

  const correctAnswer = options[correctIndex];
  const arranged = arrangeOptionsByAnswer(options, correctAnswer, itemIndex, seedKey);
  const newCorrectIndex = arranged.findIndex(
    (o) => o.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
  );

  return {
    options: arranged,
    correctIndex: newCorrectIndex !== -1 ? newCorrectIndex : correctIndex,
  };
}
