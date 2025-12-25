// Lightweight grid bonus logic for units 1-3
// Each function is commented for clarity

import { Unit } from './types';

// BONUS 1: Cursor Synergy (Easy)
// +10% Cursor value if adjacent to a Grandma
// Bonus for unit1 (Cursor)
export function unit1Bonus(grid: (Unit | null)[][], x: number, y: number): number {
  const unit = grid[y][x];
  if (!unit || unit.type !== 'unit1') return 0;
  // Check orthogonal neighbors for a Grandma
  const neighbors = [
    [x-1, y], [x+1, y], [x, y-1], [x, y+1]
  ];
  for (const [nx, ny] of neighbors) {
    if (grid[ny]?.[nx]?.type === 'unit2') {
      return 0.1; // 10% bonus
    }
  }
  return 0;
}

// BONUS 2: Grandma Chain (Medium)
// +20% Grandma value if 3 Grandmas in a row or column
// Bonus for unit2 (Grandma)
export function unit2Bonus(grid: (Unit | null)[][], x: number, y: number): number {
  const unit = grid[y][x];
  if (!unit || unit.type !== 'unit2') return 0;
  // Check horizontal
  if (
    grid[y]?.[x-1]?.type === 'unit2' &&
    grid[y]?.[x+1]?.type === 'unit2'
  ) return 0.2;
  // Check vertical
  if (
    grid[y-1]?.[x]?.type === 'unit2' &&
    grid[y+1]?.[x]?.type === 'unit2'
  ) return 0.2;
  return 0;
}

// BONUS 3: Farm Cluster (Hard)
// +30% Farm value if surrounded by Cursors or Grandmas (all 8 neighbors)
// Bonus for unit3 (Farm)
export function unit3Bonus(grid: (Unit | null)[][], x: number, y: number): number {
  const unit = grid[y][x];
  if (!unit || unit.type !== 'unit3') return 0;
  // All 8 surrounding cells
  const neighbors = [
    [x-1, y-1], [x, y-1], [x+1, y-1],
    [x-1, y],           [x+1, y],
    [x-1, y+1], [x, y+1], [x+1, y+1]
  ];
  for (const [nx, ny] of neighbors) {
    const neighbor = grid[ny]?.[nx];
    if (!neighbor || (neighbor.type !== 'unit1' && neighbor.type !== 'unit2')) {
      return 0; // If any neighbor is missing or not the right type, no bonus
    }
  }
  return 0.3;
}

// AGGREGATE FUNCTION
// Returns the total bonus multiplier for a unit at (x, y)
export function getUnitBonusMultiplier(grid: (Unit | null)[][], x: number, y: number): number {
  // Add all applicable bonuses for the unit at (x, y)
  return (
    1 +
    unit1Bonus(grid, x, y) +
    unit2Bonus(grid, x, y) +
    unit3Bonus(grid, x, y)
  );
}

/*
USAGE:
- Call getUnitBonusMultiplier(grid, x, y) when calculating a unit's production.
- Multiply the unit's value by this multiplier to get the effective value.
- This implementation is lightweight: no state is stored, only local checks are performed.
*/

/**
 * Updates the bonusActive property for each unit in the grid.
 * This function should be called after any grid change (placement, move, removal).
 * It returns a new grid with updated Unit instances (immutably).
 */
export function updateUnitsBonusState(grid: (Unit | null)[][]): (Unit | null)[][] {
  return grid.map((row, y) =>
    row.map((unit, x) => {
      if (!unit) return null;
      // Determine if the bonus is active for this unit
      let isActive = false;
      if (unit.type === 'unit1') isActive = unit1Bonus(grid, x, y) > 0;
      if (unit.type === 'unit2') isActive = unit2Bonus(grid, x, y) > 0;
      if (unit.type === 'unit3') isActive = unit3Bonus(grid, x, y) > 0;
      // Return a new Unit instance with updated bonusActive
      return new Unit(unit.id, unit.type, unit.position.x, unit.position.y, unit.value, isActive);
    })
  );
}
