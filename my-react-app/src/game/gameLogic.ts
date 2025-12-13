import { Player } from './types';
import type { UnitType } from './types';

//Move this to a game settings file
export const UNIT_CONFIG: Record<UnitType, { cost: number; value: number; refund: number }> = {
  unit1: { cost: 15, value: 1, refund: 7 },     // 15s to earn back—forces clicking longer
  unit2: { cost: 100, value: 3, refund: 50 },   // 33s ROI, only 3x stronger—requires grind
  unit3: { cost: 500, value: 12, refund: 250 }, // 41s ROI, 4x stronger—long-term goal
};

export function buyUnit(player: Player, unitType: UnitType): Player {
  const config = UNIT_CONFIG[unitType];
  const cost = player.calculateUnitCost(unitType, config.cost);
  const newPlayer = Object.assign(new Player(), player);
  if (newPlayer.buyUnit(unitType, cost, config.value)) {
    return newPlayer;
  }
  return player;
}

export function sellUnit(player: Player, unitType: UnitType): Player {
  const config = UNIT_CONFIG[unitType];
  const newPlayer = Object.assign(new Player(), player);
  const lastUnit = [...newPlayer.units].reverse().find(u => u.type === unitType);
  if (lastUnit && newPlayer.sellUnit(lastUnit.id, config.refund)) {
    return newPlayer;
  }
  return player;
}


