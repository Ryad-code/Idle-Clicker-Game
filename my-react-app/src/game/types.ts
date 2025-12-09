export type UnitType = "unit1" | "unit2" | "unit3";

export class Player {
  points: number;
  pointsPerSecond: number;
  clickValue: number;
  totalClicks: number;
  units: Unit[]

  constructor(
    initialPoints: number = 0,
    clickValue: number = 1,
    pointsPerSecond: number = 0
  ) {
    this.points = initialPoints;
    this.clickValue = clickValue;
    this.totalClicks = 0;
    this.pointsPerSecond = pointsPerSecond;
    this.units = [];
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
    return true;
  }

  sellUnit(unitId: string, refund: number): boolean {
    if (!this.removeUnit(unitId)) return false;
    this.addPoints(refund);
    return true;
  }

  calculatePointsPerSecond(): number {
    return this.units.reduce((total, unit) => total + unit.value, 0);
  }

  // Setters
  setPoints(value: number): void { this.points = value; }
  setClickValue(value: number): void { this.clickValue = value; }
  setPointsPerSecond(value: number): void { this.pointsPerSecond = value; }
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

  moveTo(x: number, y: number): void {
    this.position = { x, y };
  }

  // Setters
  setType(type: UnitType): void { this.type = type; }
  setValue(value: number): void { this.value = value; }
}


