import { Player } from './types';
import type { UnitType } from './types';
import { UNIT_CONFIG } from './gameConfig';

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


