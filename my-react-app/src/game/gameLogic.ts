import { atom } from 'jotai';
import { Player } from './types';
import type { UnitType } from './types';

export const playerAtom = atom(new Player());

export function buyUnit(player: Player, unitType: UnitType, cost: number, value: number): Player {
  const newPlayer = Object.assign(new Player(), player);
  if (newPlayer.buyUnit(unitType, cost, value)) {
    return newPlayer;
  }
  return player;
}

export function sellUnit(player: Player, unitType: UnitType, refund: number): Player {
  const newPlayer = Object.assign(new Player(), player);
  const lastUnit = [...newPlayer.units].reverse().find(u => u.type === unitType);
  if (lastUnit && newPlayer.sellUnit(lastUnit.id, refund)) {
    return newPlayer;
  }
  return player;
}


