/**
 * Game balance and configuration constants
 * Centralized for easy tuning and maintenance
 */

/**
 * Unit cost scaling factor
 * Each additional unit of the same type costs base_cost * UNIT_COST_MULTIPLIER^count
 */
export const UNIT_COST_MULTIPLIER = 1.15;

/**
 * Click value calculation
 * Base click value = 1 + (total_production * CLICK_VALUE_RATIO)
 */
export const CLICK_VALUE_RATIO = 0.05;

/**
 * Minimum click value - ensures clicking is always useful
 */
export const MIN_CLICK_VALUE = 1;

/**
 * Auto-save debounce delay in milliseconds
 */
export const AUTO_SAVE_DELAY_MS = 1000;

/**
 * Game tick interval in milliseconds
 * How often the game updates production and checks upgrade expiration
 */
export const GAME_TICK_INTERVAL_MS = 1000;

/**
 * Unit refund percentage (0.5 = 50% refund)
 */
export const UNIT_REFUND_PERCENTAGE = 0.5;
