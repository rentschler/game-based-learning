/**
 * Coin utility functions for managing user coins in localStorage
 */

const COINS_STORAGE_KEY = 'gbl_user_coins';
const INITIAL_COINS = 50;

/**
 * Get the current user coins from localStorage
 * If no coins exist, initializes it to INITIAL_COINS
 * @returns The current user coins
 */
export function getCoins(): number {
  if (typeof window === 'undefined') {
    return INITIAL_COINS;
  }

  const storedCoins = localStorage.getItem(COINS_STORAGE_KEY);
  
  if (storedCoins === null) {
    // First time user - initialize coins
    setCoins(INITIAL_COINS);
    return INITIAL_COINS;
  }

  const coins = parseInt(storedCoins, 10);
  
  // Validate coins is a valid number
  if (isNaN(coins)) {
    setCoins(INITIAL_COINS);
    return INITIAL_COINS;
  }

  return coins;
}

/**
 * Update the user coins by adding coins
 * @param amount - The amount of coins to add (can be negative to subtract)
 * @returns The new total coins after adding
 */
export function addCoins(amount: number): number {
  const currentCoins = getCoins();
  const newCoins = currentCoins + amount;
  setCoins(newCoins);
  return newCoins;
}

/**
 * Set the user coins to a specific value
 * @param coins - The new coins value
 */
export function setCoins(coins: number): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Ensure coins is never negative
  const validCoins = Math.max(0, Math.floor(coins));
  localStorage.setItem(COINS_STORAGE_KEY, validCoins.toString());
}

/**
 * Spend coins (subtract from current balance)
 * @param amount - The amount of coins to spend
 * @returns true if successful, false if insufficient coins
 */
export function spendCoins(amount: number): boolean {
  const currentCoins = getCoins();
  
  if (currentCoins < amount) {
    return false; // Insufficient coins
  }
  
  const newCoins = currentCoins - amount;
  setCoins(newCoins);
  return true;
}
