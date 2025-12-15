import { Player } from './types';
import type { UnitType } from './types';
import { UNIT_CONFIG } from './unitConfig';
import { UPGRADES } from './upgradeConfig';

export function buyUnit(player: Player, unitType: UnitType): Player {
  const config = UNIT_CONFIG[unitType];
  const cost = player.calculateUnitCost(unitType, config.cost);
  // Create a safe copy to avoid mutating the original player's units array
  const newPlayer = Object.assign(new Player(), player);
  newPlayer.units = [...player.units];
  if (newPlayer.buyUnit(unitType, cost, config.value)) {
    return newPlayer;
  }
  return player;
}

export function sellUnit(player: Player, unitType: UnitType): Player {
  const config = UNIT_CONFIG[unitType];
  // Create a safe copy to avoid mutating the original player's units array
  const newPlayer = Object.assign(new Player(), player);
  newPlayer.units = [...player.units];
  const lastUnit = [...newPlayer.units].reverse().find(u => u.type === unitType);
  if (lastUnit && newPlayer.sellUnit(lastUnit.id, config.refund)) {
    return newPlayer;
  }
  return player;
}

export function buyUpgrade(player: Player, upgradeId: string): Player {
  const upgrade = UPGRADES.find(u => u.id === upgradeId);
  if (!upgrade) return player;
  if (!player.canAfford(upgrade.cost)) return player;

  const newPlayer = Object.assign(new Player(), player);
  newPlayer.units = [...player.units];
  newPlayer.activeUpgrades = [...(player.activeUpgrades || [])];

  newPlayer.removePoints(upgrade.cost);
  newPlayer.activeUpgrades.push({ upgradeId, purchasedAt: new Date() });
  newPlayer.refreshDerivedStats();
  return newPlayer;
}


