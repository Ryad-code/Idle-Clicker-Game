import type { Unit, ActiveUpgrade, UnitType } from './types';
import { UPGRADES, getUpgradeKind } from '../config/upgrades';
import { UNIT_COST_MULTIPLIER, CLICK_VALUE_RATIO, MIN_CLICK_VALUE } from '../config/constants';
import { getUnitBonusMultiplier } from './bonuses';

/**
 * Calculate total production from units with grid bonuses and active upgrade multipliers
 */
export function calculateProduction(grid: (Unit | null)[][], activeUpgrades: ActiveUpgrade[]): bigint {
  console.log("calculation...");
  let totalProduction = 0n;
  const upgradeMultiplier = getActiveMultiplier(activeUpgrades, 'production');
  
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const unit = grid[y][x];
      if (unit) {
        const bonusMultiplier = getUnitBonusMultiplier(grid, x, y);
        const baseProduction = BigInt(unit.value) * BigInt(unit.stackedCount);
        const bonusBig = BigInt(Math.round(bonusMultiplier * 100));
        const unitProduction = (baseProduction * bonusBig) / 100n;
        totalProduction += unitProduction;
      }
    }
  }
  
  const upgradeBig = BigInt(Math.round(upgradeMultiplier * 100));
  return (totalProduction * upgradeBig) / 100n;
}

/**
 * Calculate click value based on production with active upgrade multipliers
 */
export function calculateClickValue(production: bigint, activeUpgrades: ActiveUpgrade[]): bigint {
  const prodNum = Number(production); // Convert to number for calculations, but cap if needed
  const baseClick = Math.max(MIN_CLICK_VALUE, MIN_CLICK_VALUE + Math.floor(prodNum * CLICK_VALUE_RATIO));
  const multiplier = getActiveMultiplier(activeUpgrades, 'click');
  return BigInt(Math.max(MIN_CLICK_VALUE, Math.floor(baseClick * multiplier)));
}

/**
 * Calculate unit cost based on owned count (exponential scaling)
 */
export function calculateUnitCost(units: Unit[], type: UnitType, baseCost: number): bigint {
  const count = units.filter(u => u.type === type).reduce((sum, u) => sum + u.stackedCount, 0);
  return BigInt(Math.round(baseCost * Math.pow(UNIT_COST_MULTIPLIER, count)));
}

/**
 * Calculates the dynamic cost of an upgrade based on its net benefit.
 * Returns the cost as a bigint.
 */
export function calculateUpgradeCost(
  upgradeId: string,
  pointsPerSecond: bigint,
  clickValue: bigint
): bigint {
  const upgrade = UPGRADES.find(u => u.id === upgradeId);
  if (!upgrade) return 0n;
  const kind = getUpgradeKind(upgradeId);
  const currentValue = kind === 'production' ? pointsPerSecond : clickValue;
  const netBenefitFloat = Number(currentValue) * (upgrade.multiplier - 1) * upgrade.durationSeconds;
  const costFloat = netBenefitFloat * 0.4;
  return BigInt(Math.max(0, Math.floor(costFloat)));
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
  console.log("filtering expired upgrades...");
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
