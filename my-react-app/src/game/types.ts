export type UnitType = "unit1" | "unit2" | "unit3" | "unit4" | "unit5" | "unit6" | "unit7" | "unit8" | "unit9" | "unit10" | "unit11" | "unit12" | "unit13" | "unit14" | "unit15" | "unit16" | "unit17" | "unit18";

import { UPGRADES, getUpgradeKind } from './upgradeConfig';

export class Player {
  points: number;
  pointsPerSecond: number;
  clickValue: number;
  totalClicks: number;
  units: Unit[];
  createdAt: Date;
  activeUpgrades: Array<{ upgradeId: string; purchasedAt: Date }>;

  constructor(
    initialPoints: number = 0,
    clickValue: number = 1,
    pointsPerSecond: number = 0,
    createdAt: Date = new Date()
  ) {
    this.points = initialPoints;
    this.clickValue = clickValue;
    this.totalClicks = 0;
    this.pointsPerSecond = pointsPerSecond;
    this.units = [];
    this.createdAt = createdAt;
    this.activeUpgrades = [];
  }

  click(): void {
    this.points += this.clickValue;
    this.totalClicks += 1;
  }

  addPoints(amount: number): void {
    this.points += amount;
  }

  removePoints(amount: number): boolean {
    if (this.points < amount) {
      return false;
    }
    this.points -= amount;
    return true;
  }

  canAfford(cost: number): boolean {
    return this.points >= cost;
  }

  addUnit(unit: Unit): void {
    this.units.push(unit);
  }

  removeUnit(unitId: string): boolean {
    const index = this.units.findIndex(u => u.id === unitId);
    if (index === -1) return false;
    this.units.splice(index, 1);
    return true;
  }

  buyUnit(type: UnitType, cost: number, value: number): boolean {
    if (!this.canAfford(cost)) return false;
    this.removePoints(cost);
    const unit = new Unit(crypto.randomUUID(), type, 0, 0, value);
    this.addUnit(unit);
    this.refreshDerivedStats();
    return true;
  }

  sellUnit(unitId: string, refund: number): boolean {
    if (!this.removeUnit(unitId)) return false;
    this.addPoints(refund);
    this.refreshDerivedStats();
    return true;
  }

  calculatePointsPerSecond(): number {
    const base = this.units.reduce((total, unit) => total + unit.value, 0);
    return base * this.getActiveMultiplier('production');
  }

  getUnitCount(type: UnitType): number {
    return this.units.filter(u => u.type === type).length;
  }

  calculateUnitCost(type: UnitType, baseCost: number): number {
    const count = this.getUnitCount(type);
    return Math.round(baseCost * Math.pow(1.15, count));
  }

  refreshDerivedStats(): void {
    const baseProduction = this.units.reduce((total, unit) => total + unit.value, 0);
    const productionMultiplier = this.getActiveMultiplier('production');
    const clickMultiplier = this.getActiveMultiplier('click');

    const production = baseProduction * productionMultiplier;
    this.pointsPerSecond = production;

    const baseClick = Math.max(1, 1 + Math.floor(baseProduction * 0.05));
    this.clickValue = Math.max(1, Math.floor(baseClick * clickMultiplier));
  }

  getActiveMultiplier(kind: 'production' | 'click', now: Date = new Date()): number {
    if (!this.activeUpgrades || this.activeUpgrades.length === 0) return 1;
    const byId = new Map(UPGRADES.map(u => [u.id, u]));
    return this.activeUpgrades
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

  // Setters
  setPoints(value: number): void { this.points = value; }
}

export class Unit {
  id: string;
  type: UnitType;
  position: { x: number; y: number };
  value: number;

  constructor(
    id: string,
    type: UnitType,
    x: number,
    y: number,
    value: number
  ) {
    this.id = id;
    this.type = type;
    this.position = { x, y };
    this.value = value;
  }

}


