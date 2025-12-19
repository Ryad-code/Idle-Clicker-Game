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
import { logError, getErrorMessage } from '../utils/errorUtils';
import { savePlayerToDB } from '../game/services/database';

/**
 * Action functions for game state updates
 * Called directly by GameProvider
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
  scheduleSave: () => void,
  type: UnitType
) {
  setState(prev => {
    const config = UNIT_CONFIG[type];
    const cost = calculateUnitCost(prev.inventory.units, type, config.cost);
    
    if (prev.currency.points < cost) return prev;
    
    const newUnit = new Unit(crypto.randomUUID(), type, 0, 0, config.value);
    const newUnits = [...prev.inventory.units, newUnit];
    const newProduction = calculateProduction(newUnits, prev.upgrades.active);
    const newClickValue = calculateClickValue(newProduction, prev.upgrades.active);
    
    scheduleSave();
    
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
  scheduleSave: () => void,
  type: UnitType
) {
  setState(prev => {
    const lastUnit = [...prev.inventory.units].reverse().find(u => u.type === type);
    if (!lastUnit) return prev;
    
    const config = UNIT_CONFIG[type];
    const newUnits = prev.inventory.units.filter(u => u.id !== lastUnit.id);
    const newProduction = calculateProduction(newUnits, prev.upgrades.active);
    const newClickValue = calculateClickValue(newProduction, prev.upgrades.active);
    
    scheduleSave();
    
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
  scheduleSave: () => void,
  upgradeId: string
) {
  setState(prev => {
    const upgrade = UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return prev;
    if (prev.currency.points < upgrade.cost) return prev;
    
    const newUpgrades = [...prev.upgrades.active, { upgradeId, purchasedAt: new Date() }];
    const newProduction = calculateProduction(prev.inventory.units, newUpgrades);
    const newClickValue = calculateClickValue(newProduction, newUpgrades);
    
    scheduleSave();
    
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

export async function saveAction(
  setState: Dispatch<SetStateAction<GameState>>,
  userIdRef: React.RefObject<string | null>,
  stateRef: React.RefObject<GameState>
) {
  try {
    if (!userIdRef.current) return;
    
    setState(prev => ({ ...prev, ui: { ...prev.ui, isSaving: true } }));
    
    await savePlayerToDB(userIdRef.current, stateRef.current!);
    
    setState(prev => ({ 
      ...prev, 
      ui: { ...prev.ui, isSaving: false, error: null } 
    }));
  } catch (err) {
    logError('save', err);
    setState(prev => ({ 
      ...prev, 
      ui: { ...prev.ui, isSaving: false, error: getErrorMessage(err) } 
    }));
  }
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
