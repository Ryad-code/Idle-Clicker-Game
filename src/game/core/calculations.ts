import Decimal from 'break_infinity.js';
import type { Unit, ActiveUpgrade, UnitType } from './types';
import { UPGRADES, getUpgradeKind } from '../config/upgrades';
import { UNIT_COST_MULTIPLIER, CLICK_VALUE_RATIO, MIN_CLICK_VALUE, UPGRADE_COST_MULTIPLIER } from '../config/constants';
import { getUnitBonusMultiplier } from './bonuses';

/**
 * Calculate total production from units with grid bonuses and active upgrade multipliers
 * Returns production as a Decimal for precise calculations with large numbers
 */
export function calculateProduction(grid: (Unit | null)[][], activeUpgrades: ActiveUpgrade[]): Decimal {
  let totalProduction = new Decimal(0); // Start with Decimal zero
  const upgradeMultiplier = getActiveMultiplier(activeUpgrades, 'production');
  
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const unit = grid[y][x];
      if (unit) {
        // Get the bonus multiplier for this grid position
        const bonusMultiplier = getUnitBonusMultiplier(grid, x, y);

        // Calculate unit production: base value * stack count * bonus
        const baseProduction = new Decimal(unit.value).times(unit.stackedCount);
        const unitProduction = baseProduction.times(bonusMultiplier);
        
        // Add to total production
        totalProduction = totalProduction.plus(unitProduction);
      }
    }
  }
  
  // Apply upgrade multiplier to total production
  return totalProduction.times(upgradeMultiplier);
}

/**
 * Calculate click value based on production with active upgrade multipliers
 * Returns click value as a Decimal
 */
export function calculateClickValue(production: Decimal, activeUpgrades: ActiveUpgrade[]): Decimal {
  // Base click value: minimum + ratio of production
  const baseClick = new Decimal(MIN_CLICK_VALUE).plus(production.times(CLICK_VALUE_RATIO));
  
  // Apply click upgrade multiplier
  const multiplier = getActiveMultiplier(activeUpgrades, 'click');
  const finalClick = baseClick.times(multiplier);
  
  // Ensure minimum click value
  return Decimal.max(finalClick, MIN_CLICK_VALUE);
}

/**
 * Calculate unit cost based on owned count (exponential scaling)
 * Returns cost as a Decimal
 */
export function calculateUnitCost(units: Unit[], type: UnitType, baseCost: number, numToBuy: number = 1): Decimal {
  // Count total units of this type (including stacks)
  const count = units.filter(u => u.type === type).reduce((sum, u) => sum + u.stackedCount, 0);
  
  // Calculate cost for buying multiple effective units using geometric series sum
  // Sum = baseCost * multiplier^count * (multiplier^numToBuy - 1) / (multiplier - 1)
  const base = baseCost * Math.pow(UNIT_COST_MULTIPLIER, count);
  const geometricSum = (Math.pow(UNIT_COST_MULTIPLIER, numToBuy) - 1) / (UNIT_COST_MULTIPLIER - 1);
  const cost = base * geometricSum;
  return new Decimal(cost);
}

/**
 * Calculates the dynamic cost of an upgrade based on its net benefit.
 * Returns the cost as a Decimal.
 * Formula: cost = (production/click gain per second * duration * multiplier boost) * 0.4
 */
export function calculateUpgradeCost(
  upgradeId: string,
  pointsPerSecond: Decimal,
  clickValue: Decimal
): Decimal {
  const upgrade = UPGRADES.find(u => u.id === upgradeId);
  if (!upgrade) return new Decimal(0);
  
  // Determine which value to use based on upgrade kind
  const kind = getUpgradeKind(upgradeId);
  const currentValue = kind === 'production' ? pointsPerSecond : clickValue;
  
  // Calculate net benefit: current value * bonus multiplier * duration
  const netBenefit = currentValue.times(upgrade.multiplier - 1).times(upgrade.durationSeconds);
  
  // Cost is 40% of net benefit
  const cost = netBenefit.times(UPGRADE_COST_MULTIPLIER);
  
  return Decimal.max(cost, 0); // Ensure non-negative
}

/**
 * Get active multiplier for production or click upgrades
 */
export function getActiveMultiplier(
  activeUpgrades: ActiveUpgrade[], 
  kind: 'production' | 'click',
  now: Date = new Date()
): number {
  if (!activeUpgrades || activeUpgrades.length === 0) return 1;
  
  const byId = new Map(UPGRADES.map(u => [u.id, u]));
  
  return activeUpgrades
    .filter(pu => {
      const upgrade = byId.get(pu.upgradeId);
      if (!upgrade || getUpgradeKind(upgrade.id) !== kind) return false;
      const expiresAt = new Date(pu.purchasedAt.getTime() + upgrade.durationSeconds * 1000);
      return now < expiresAt;
    })
    .reduce((mult, pu) => {
      const upgrade = byId.get(pu.upgradeId);
      return upgrade ? mult * upgrade.multiplier : mult;
    }, 1);
}

/**
 * Filter out expired upgrades
 */
export function filterExpiredUpgrades(activeUpgrades: ActiveUpgrade[], now: Date = new Date()): ActiveUpgrade[] {
  if (!activeUpgrades || activeUpgrades.length === 0) return [];
  
  const nowMs = now.getTime();
  const byId = new Map(UPGRADES.map(u => [u.id, u]));
  
  return activeUpgrades.filter(entry => {
    const upgrade = byId.get(entry.upgradeId);
    if (!upgrade) return false;
    const expiresAt = entry.purchasedAt.getTime() + upgrade.durationSeconds * 1000;
    return expiresAt > nowMs;
  });
}
