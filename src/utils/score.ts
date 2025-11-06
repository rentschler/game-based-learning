/**
 * Score utility functions for managing user XP in localStorage
 */

const SCORE_STORAGE_KEY = 'gbl_user_score';
const INITIAL_SCORE = 1069;

/**
 * Get the current user score from localStorage
 * If no score exists, initializes it to INITIAL_SCORE
 * @returns The current user score
 */
export function getScore(): number {
  if (typeof window === 'undefined') {
    return INITIAL_SCORE;
  }

  const storedScore = localStorage.getItem(SCORE_STORAGE_KEY);
  
  if (storedScore === null) {
    // First time user - initialize score
    setScore(INITIAL_SCORE);
    return INITIAL_SCORE;
  }

  const score = parseInt(storedScore, 10);
  
  // Validate score is a valid number
  if (isNaN(score)) {
    setScore(INITIAL_SCORE);
    return INITIAL_SCORE;
  }

  return score;
}

/**
 * Update the user score by adding XP
 * @param xp - The amount of XP to add (can be negative to subtract)
 * @returns The new total score after adding XP
 */
export function addXP(xp: number): number {
  const currentScore = getScore();
  const newScore = currentScore + xp;
  setScore(newScore);
  return newScore;
}

/**
 * Set the user score to a specific value
 * @param score - The new score value
 */
export function setScore(score: number): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Ensure score is never negative
  const validScore = Math.max(0, Math.floor(score));
  localStorage.setItem(SCORE_STORAGE_KEY, validScore.toString());
}

/**
 * Reset the score to the initial value
 * @returns The reset score value
 */
export function resetScore(): number {
  setScore(INITIAL_SCORE);
  return INITIAL_SCORE;
}

