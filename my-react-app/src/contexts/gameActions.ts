
/**
 * Places a new unit of the given type into the first available cell in the grid.
 * Returns a new grid with the unit placed, or the original grid if no space is available.
 */
export function placeUnitInGrid(
  grid: (Unit | null)[][],
  type: UnitType,
  value: number
): (Unit | null)[][] {
  // Collect all available cells
  const available: { x: number; y: number }[] = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === null) {
        available.push({ x, y });
      }
    }
  }
  if (available.length === 0) return grid;
  // Pick a random available cell
  const idx = Math.floor(Math.random() * available.length);
  const { x, y } = available[idx];
  // Place the unit in the selected cell
  return grid.map((row, rowIdx) =>
    row.map((cell, colIdx) => {
      if (rowIdx === y && colIdx === x) {
        return new Unit(crypto.randomUUID(), type, x, y, value);
      }
      return cell;
    })
  );
}
import type { Dispatch, SetStateAction } from 'react';
import type { GameState, UnitType } from '../game/core/types';
import { Unit } from '../game/core/types';
import { 
  calculateProduction, 
  calculateClickValue, 
  calculateUnitCost 
} from '../game/core/calculations';
import { UNIT_CONFIG } from '../game/config/units';
import { updateUnitsBonusState } from '../game/core/bonuses';
import { UPGRADES, getUpgradeKind } from '../game/config/upgrades';

/**
 * Action functions for game state updates
 */

export function clickAction(setState: Dispatch<SetStateAction<GameState>>) {
  setState(prev => ({
    ...prev,
    currency: {
      ...prev.currency,
      points: prev.currency.points + prev.production.clickValue,
      totalClicks: prev.currency.totalClicks + 1,
    },
  }));
}




export function buyUnitAction(
  setState: Dispatch<SetStateAction<GameState>>,
  type: UnitType
) {
  setState(prev => {
    // Get unit config for cost/value
    const config = UNIT_CONFIG[type];
    const grid = prev.grid;
    // Flatten grid to count all placed units
    const flatUnits = grid.flat().filter((u): u is Unit => u !== null);
    // Prevent adding more units than grid cells
    if (flatUnits.length >= grid.length * grid[0].length) return prev;
    // Calculate cost for this unit type
    const cost = calculateUnitCost(flatUnits, type, config.cost);
    // Prevent purchase if not enough points
    if (prev.currency.points < cost) return prev;
    // Place the new unit in a random available cell
    const placedGrid = placeUnitInGrid(grid, type, config.value);
    // Update each unit's bonusActive property based on the new grid
    const newGrid = updateUnitsBonusState(placedGrid);
    // Recalculate production/click values with new units
    const newProduction = calculateProduction(newGrid, prev.upgrades.active);
    const newClickValue = calculateClickValue(newProduction, prev.upgrades.active);
    // Return updated state
    return {
      ...prev,
      currency: {
        ...prev.currency,
        points: prev.currency.points - cost,
      },
      grid: newGrid,
      production: {
        pointsPerSecond: newProduction,
        clickValue: newClickValue,
      },
    };
  });
}

export function sellUnitAction(
  setState: Dispatch<SetStateAction<GameState>>,
  type: UnitType
) {
  setState(prev => {
    // Find last unit of type
    let lastPos: { x: number; y: number } | null = null;
    for (let y = prev.grid.length - 1; y >= 0; y--) {
      for (let x = prev.grid[y].length - 1; x >= 0; x--) {
        const unit = prev.grid[y][x];
        if (unit && unit.type === type) {
          lastPos = { x, y };
          break;
        }
      }
      if (lastPos) break;
    }
    if (!lastPos) return prev;
    const config = UNIT_CONFIG[type];
    // Remove unit from grid
    // Remove the unit from the grid
    const removedGrid = prev.grid.map((row, y) =>
      row.map((cell, x) => (x === lastPos!.x && y === lastPos!.y ? null : cell))
    );
    // Update each unit's bonusActive property based on the new grid
    const newGrid = updateUnitsBonusState(removedGrid);
    const newProduction = calculateProduction(newGrid, prev.upgrades.active);
    const newClickValue = calculateClickValue(newProduction, prev.upgrades.active);
    return {
      ...prev,
      currency: {
        ...prev.currency,
        points: prev.currency.points + config.refund,
      },
      grid: newGrid,
      production: {
        pointsPerSecond: newProduction,
        clickValue: newClickValue,
      },
    };
  });
}

/**
 * Calculates the dynamic cost of an upgrade as 40% of its net benefit.
 * Net benefit = currentValue * (multiplier - 1) * durationSeconds
 * Where currentValue is production for production upgrades, clickValue for click upgrades.
 */
export function calculateUpgradeCost(
  upgradeId: string,
  grid: (Unit | null)[][],
  activeUpgrades: { upgradeId: string; purchasedAt: Date }[]
): number {
  const upgrade = UPGRADES.find(u => u.id === upgradeId);
  if (!upgrade) return 0;

  const kind = getUpgradeKind(upgradeId);
  const currentProduction = calculateProduction(grid, activeUpgrades);
  const currentClickValue = calculateClickValue(currentProduction, activeUpgrades);

  // Use the relevant current value
  const currentValue = kind === 'production' ? currentProduction : currentClickValue;

  // Net benefit: extra value from the multiplier over duration
  const netBenefit = currentValue * (upgrade.multiplier - 1) * upgrade.durationSeconds;

  // Cost: 40% of net benefit, rounded to nearest integer
  return Math.round(netBenefit * 0.4);
}

export function buyUpgradeAction(
  setState: Dispatch<SetStateAction<GameState>>,
  upgradeId: string
) {
  setState(prev => {
    const upgrade = UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return prev;
    
    // Calculate dynamic cost as 40% of net benefit
    const cost = calculateUpgradeCost(upgradeId, prev.grid, prev.upgrades.active);
    if (prev.currency.points < cost) return prev;
    
    const newUpgrades = [...prev.upgrades.active, { upgradeId, purchasedAt: new Date() }];
    const newProduction = calculateProduction(prev.grid, newUpgrades);
    const newClickValue = calculateClickValue(newProduction, newUpgrades);
    
    return {
      ...prev,
      currency: {
        ...prev.currency,
        points: prev.currency.points - cost,
      },
      upgrades: {
        active: newUpgrades,
      },
      production: {
        pointsPerSecond: newProduction,
        clickValue: newClickValue,
      },
    };
  });
}

export function setPointsAction(
  setState: Dispatch<SetStateAction<GameState>>,
  points: number
) {
  setState(prev => ({
    ...prev,
    currency: {
      ...prev.currency,
      points,
    },
  }));
}

export function moveUnitAction(
  setState: Dispatch<SetStateAction<GameState>>,
  fromX: number, fromY: number,
  toX: number, toY: number
) {
  setState(prev => {
    const grid = prev.grid;
    const fromUnit = grid[fromY]?.[fromX];
    const toUnit = grid[toY]?.[toY];
    
    if (!fromUnit) return prev; // Must have a unit to move/swap
    
    // Create new grid by swapping positions (toUnit can be null)
    const newGrid = grid.map((row, y) =>
      row.map((cell, x) => {
        if (y === fromY && x === fromX) return toUnit ? { ...toUnit, position: { x: fromX, y: fromY } } as Unit : null;
        if (y === toY && x === toX) return { ...fromUnit, position: { x: toX, y: toY } } as Unit;
        return cell;
      })
    );
    
    // Update bonuses and recalculate
    const updatedGrid = updateUnitsBonusState(newGrid);
    const newProduction = calculateProduction(updatedGrid, prev.upgrades.active);
    const newClickValue = calculateClickValue(newProduction, prev.upgrades.active);
    
    return {
      ...prev,
      grid: updatedGrid,
      production: { pointsPerSecond: newProduction, clickValue: newClickValue },
    };
  });
}
