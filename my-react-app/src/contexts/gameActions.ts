import type { Dispatch, SetStateAction } from 'react';
import type { GameState, UnitType } from '../game/core/types';
import { Unit } from '../game/core/types';
import { 
  calculateProduction, 
  calculateClickValue, 
  calculateUnitCost 
} from '../game/core/calculations';
import { UNIT_CONFIG } from '../game/config/units';
import { UPGRADES } from '../game/config/upgrades';
import { GRID_ROWS, GRID_COLS } from '../game/config/grid';

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


function findNextAvailableGridPosition(units: Unit[]): { x: number; y: number } {
  const occupied = new Set(units.map(u => `${u.position.x},${u.position.y}`));
  for (let y = 0; y < GRID_ROWS; y++) {
    for (let x = 0; x < GRID_COLS; x++) {
      if (!occupied.has(`${x},${y}`)) {
        return { x, y };
      }
    }
  }
  return { x: 0, y: 0 }; // fallback, should not happen if grid has space
}

export function buyUnitAction(
  setState: Dispatch<SetStateAction<GameState>>,
  type: UnitType
) {
  setState(prev => {
    const config = UNIT_CONFIG[type];
    const cost = calculateUnitCost(prev.inventory.units, type, config.cost);
    if (prev.currency.points < cost) return prev;
    const pos = findNextAvailableGridPosition(prev.inventory.units);
    const newUnit = new Unit(crypto.randomUUID(), type, pos.x, pos.y, config.value);
    const newUnits = [...prev.inventory.units, newUnit];
    const newProduction = calculateProduction(newUnits, prev.upgrades.active);
    const newClickValue = calculateClickValue(newProduction, prev.upgrades.active);
    return {
      ...prev,
      currency: {
        ...prev.currency,
        points: prev.currency.points - cost,
      },
      inventory: {
        units: newUnits,
      },
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
    const lastUnit = [...prev.inventory.units].reverse().find(u => u.type === type);
    if (!lastUnit) return prev;
    
    const config = UNIT_CONFIG[type];
    const newUnits = prev.inventory.units.filter(u => u.id !== lastUnit.id);
    const newProduction = calculateProduction(newUnits, prev.upgrades.active);
    const newClickValue = calculateClickValue(newProduction, prev.upgrades.active);
    
    return {
      ...prev,
      currency: {
        ...prev.currency,
        points: prev.currency.points + config.refund,
      },
      inventory: {
        units: newUnits,
      },
      production: {
        pointsPerSecond: newProduction,
        clickValue: newClickValue,
      },
    };
  });
}

export function buyUpgradeAction(
  setState: Dispatch<SetStateAction<GameState>>,
  upgradeId: string
) {
  setState(prev => {
    const upgrade = UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return prev;
    if (prev.currency.points < upgrade.cost) return prev;
    
    const newUpgrades = [...prev.upgrades.active, { upgradeId, purchasedAt: new Date() }];
    const newProduction = calculateProduction(prev.inventory.units, newUpgrades);
    const newClickValue = calculateClickValue(newProduction, newUpgrades);
    
    return {
      ...prev,
      currency: {
        ...prev.currency,
        points: prev.currency.points - upgrade.cost,
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
