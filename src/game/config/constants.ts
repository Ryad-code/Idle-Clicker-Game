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
 * Game tick interval in milliseconds
 * How often the game updates production and checks upgrade expiration
 */
export const GAME_TICK_INTERVAL_MS = 1000;

/**
 * Upgrade cost multiplier
 * Cost of an upgrade = (net benefit over duration) * UPGRADE_COST_MULTIPLIER
 */
export const UPGRADE_COST_MULTIPLIER = 0.4;

