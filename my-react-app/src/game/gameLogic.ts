import { atom } from 'jotai';
import { Player } from './types';
import type { UnitType } from './types';

export const UNIT_CONFIG: Record<UnitType, { cost: number; value: number; refund: number }> = {
  unit1: { cost: 5, value: 1, refund: 2 },
  unit2: { cost: 10, value: 2, refund: 5 },
  unit3: { cost: 20, value: 5, refund: 10 },
};

export const playerAtom = atom(new Player());

export function buyUnit(player: Player, unitType: UnitType): Player {
  const config = UNIT_CONFIG[unitType];
  const newPlayer = Object.assign(new Player(), player);
  if (newPlayer.buyUnit(unitType, config.cost, config.value)) {
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


