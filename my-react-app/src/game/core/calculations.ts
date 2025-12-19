import type { Unit, ActiveUpgrade, UnitType } from './types';
import { UPGRADES, getUpgradeKind } from '../config/upgrades';
import { UNIT_COST_MULTIPLIER, CLICK_VALUE_RATIO, MIN_CLICK_VALUE } from '../config/constants';

/**
 * Calculate total production from units with active upgrade multipliers
 */
export function calculateProduction(units: Unit[], activeUpgrades: ActiveUpgrade[]): number {
  const baseProduction = units.reduce((total, unit) => total + unit.value, 0);
  const multiplier = getActiveMultiplier(activeUpgrades, 'production');
  return baseProduction * multiplier;
}

/**
 * Calculate click value based on production with active upgrade multipliers
 */
export function calculateClickValue(production: number, activeUpgrades: ActiveUpgrade[]): number {
  const baseClick = Math.max(MIN_CLICK_VALUE, MIN_CLICK_VALUE + Math.floor(production * CLICK_VALUE_RATIO));
  const multiplier = getActiveMultiplier(activeUpgrades, 'click');
  return Math.max(MIN_CLICK_VALUE, Math.floor(baseClick * multiplier));
}

/**
 * Calculate unit cost based on owned count (exponential scaling)
 */
export function calculateUnitCost(units: Unit[], type: UnitType, baseCost: number): number {
  const count = units.filter(u => u.type === type).length;
  return Math.round(baseCost * Math.pow(UNIT_COST_MULTIPLIER, count));
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
