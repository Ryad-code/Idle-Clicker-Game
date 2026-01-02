// Lightweight grid bonus logic for units 1-3
// Each function is commented for clarity

import { Unit } from './types';
import { UNIT_CONFIG } from '../config/units';

// BONUS 1: Cursor Chain
// +10% Cursor value if 3 Cursors in a row or column
// Bonus for unit1 (Cursor)
export function unit1Bonus(grid: (Unit | null)[][], x: number, y: number): number {
  const unit = grid[y][x];
  if (!unit || unit.type !== 'unit1') return 0;
  // Chain: 3 in row or column
  if (
    grid[y]?.[x-1]?.type === 'unit1' &&
    grid[y]?.[x+1]?.type === 'unit1'
  ) return UNIT_CONFIG.unit1.bonus;
  if (
    grid[y-1]?.[x]?.type === 'unit1' &&
    grid[y+1]?.[x]?.type === 'unit1'
  ) return UNIT_CONFIG.unit1.bonus;
  return 0;
}

// BONUS 2: Grandma Corner
// +15% Grandma value if in a corner position with another Grandma adjacent
// Bonus for unit2 (Grandma)
export function unit2Bonus(grid: (Unit | null)[][], x: number, y: number): number {
  const unit = grid[y][x];
  if (!unit || unit.type !== 'unit2') return 0;
  // Corner: in corner with adjacent Grandma
  const isCorner = (x === 0 || x === 10) && (y === 0 || y === 10);
  if (isCorner) {
    const neighbors = [
      [x-1, y], [x+1, y], [x, y-1], [x, y+1]
    ];
    for (const [nx, ny] of neighbors) {
      if (grid[ny]?.[nx]?.type === 'unit2') {
        return UNIT_CONFIG.unit2.bonus;
      }
    }
  }
  return 0;
}

// BONUS 3: Farm Cluster
// +30% Farm value if surrounded by Cursors or Grandmas (all 8 neighbors)
// Bonus for unit3 (Farm)
export function unit3Bonus(grid: (Unit | null)[][], x: number, y: number): number {
  const unit = grid[y][x];
  if (!unit || unit.type !== 'unit3') return 0;
  // Cluster: surrounded by Cursors or Grandmas
  const neighbors = [
    [x-1, y-1], [x, y-1], [x+1, y-1],
    [x-1, y],           [x+1, y],
    [x-1, y+1], [x, y+1], [x+1, y+1]
  ];
  for (const [nx, ny] of neighbors) {
    const neighbor = grid[ny]?.[nx];
    if (!neighbor || (neighbor.type !== 'unit1' && neighbor.type !== 'unit2')) {
      return 0;
    }
  }
  return UNIT_CONFIG.unit3.bonus;
}

// BONUS 4: Mine Diagonal
// +15% Mine value if diagonally adjacent to another Mine
// Bonus for unit4 (Mine)
export function unit4Bonus(grid: (Unit | null)[][], x: number, y: number): number {
  const unit = grid[y][x];
  if (!unit || unit.type !== 'unit4') return 0;
  // Diagonal: diagonally adjacent to another Mine
  const diagonals = [
    [x-1, y-1], [x+1, y-1], [x-1, y+1], [x+1, y+1]
  ];
  for (const [nx, ny] of diagonals) {
    if (grid[ny]?.[nx]?.type === 'unit4') {
      return UNIT_CONFIG.unit4.bonus;
    }
  }
  return 0;
}

// BONUS 5: Factory Center
// +25% Factory value if in the center of the grid
// Bonus for unit5 (Factory)
export function unit5Bonus(grid: (Unit | null)[][], x: number, y: number): number {
  const unit = grid[y][x];
  if (!unit || unit.type !== 'unit5') return 0;
  // Center: in center
  if (x === 2 && y === 2) {
    return UNIT_CONFIG.unit5.bonus;
  }
  return 0;
}

// BONUS 6: Bank Symmetry
// +30% Bank value if symmetrically placed with another Bank
// Bonus for unit6 (Bank)
export function unit6Bonus(grid: (Unit | null)[][], x: number, y: number): number {
  const unit = grid[y][x];
  if (!unit || unit.type !== 'unit6') return 0;
  // Symmetry: symmetric with another Bank
  const symmetricX = 4 - x;
  const symmetricY = 4 - y;
  if (grid[symmetricY]?.[symmetricX]?.type === 'unit6') {
    return UNIT_CONFIG.unit6.bonus;
  }
  return 0;
}

// BONUS 7: Temple Cross
// +20% Temple value if at the center of a cross pattern
// Bonus for unit7 (Temple)
export function unit7Bonus(grid: (Unit | null)[][], x: number, y: number): number {
  const unit = grid[y][x];
  if (!unit || unit.type !== 'unit7') return 0;
  // Cross: center of cross
  if (
    grid[y]?.[x-1]?.type === 'unit7' &&
    grid[y]?.[x+1]?.type === 'unit7' &&
    grid[y-1]?.[x]?.type === 'unit7' &&
    grid[y+1]?.[x]?.type === 'unit7'
  ) {
    return UNIT_CONFIG.unit7.bonus;
  }
  return 0;
}

// BONUS 8: Tower Height
// +25% Wizard Tower value if stacked vertically with another Tower
// Bonus for unit8 (Wizard Tower)
export function unit8Bonus(grid: (Unit | null)[][], x: number, y: number): number {
  const unit = grid[y][x];
  if (!unit || unit.type !== 'unit8') return 0;
  // Height: vertical stack
  if (
    (grid[y-1]?.[x]?.type === 'unit8' || grid[y+1]?.[x]?.type === 'unit8')
  ) {
    return UNIT_CONFIG.unit8.bonus;
  }
  return 0;
}

// BONUS 9: Shipment Route
// +35% Shipment value if in a horizontal line with other Shipments
// Bonus for unit9 (Shipment)
export function unit9Bonus(grid: (Unit | null)[][], x: number, y: number): number {
  const unit = grid[y][x];
  if (!unit || unit.type !== 'unit9') return 0;
  // Route: horizontal line with at least 2 others
  let count = 0;
  for (let i = 0; i < 5; i++) {
    if (grid[y]?.[i]?.type === 'unit9') count++;
  }
  if (count >= 3) return UNIT_CONFIG.unit9.bonus;
  return 0;
}

// BONUS 10: Lab Synergy
// +25% Alchemy Lab value if adjacent to a Shipment
// Bonus for unit10 (Alchemy Lab)
export function unit10Bonus(grid: (Unit | null)[][], x: number, y: number): number {
  const unit = grid[y][x];
  if (!unit || unit.type !== 'unit10') return 0;
  // Check orthogonal neighbors for a Shipment
  const neighbors = [
    [x-1, y], [x+1, y], [x, y-1], [x, y+1]
  ];
  for (const [nx, ny] of neighbors) {
    if (grid[ny]?.[nx]?.type === 'unit9') {
      return UNIT_CONFIG.unit10.bonus;
    }
  }
  return 0;
}

// BONUS 11: Portal Chain
// +35% Portal value if 3 Portals in a row or column
// Bonus for unit11 (Portal)
export function unit11Bonus(grid: (Unit | null)[][], x: number, y: number): number {
  const unit = grid[y][x];
  if (!unit || unit.type !== 'unit11') return 0;
  // Check horizontal
  if (
    grid[y]?.[x-1]?.type === 'unit11' &&
    grid[y]?.[x+1]?.type === 'unit11'
  ) return UNIT_CONFIG.unit11.bonus;
  // Check vertical
  if (
    grid[y-1]?.[x]?.type === 'unit11' &&
    grid[y+1]?.[x]?.type === 'unit11'
  ) return UNIT_CONFIG.unit11.bonus;
  return 0;
}

// BONUS 12: Machine Cluster
// +45% Time Machine value if surrounded by Portals or Alchemy Labs (all 8 neighbors)
// Bonus for unit12 (Time Machine)
export function unit12Bonus(grid: (Unit | null)[][], x: number, y: number): number {
  const unit = grid[y][x];
  if (!unit || unit.type !== 'unit12') return 0;
  // All 8 surrounding cells
  const neighbors = [
    [x-1, y-1], [x, y-1], [x+1, y-1],
    [x-1, y],           [x+1, y],
    [x-1, y+1], [x, y+1], [x+1, y+1]
  ];
  for (const [nx, ny] of neighbors) {
    const neighbor = grid[ny]?.[nx];
    if (!neighbor || (neighbor.type !== 'unit10' && neighbor.type !== 'unit11')) {
      return 0; // If any neighbor is missing or not the right type, no bonus
    }
  }
  return UNIT_CONFIG.unit12.bonus;
}

// BONUS 13: Condenser Synergy
// +30% Antimatter Condenser value if adjacent to a Time Machine
// Bonus for unit13 (Antimatter Condenser)
export function unit13Bonus(grid: (Unit | null)[][], x: number, y: number): number {
  const unit = grid[y][x];
  if (!unit || unit.type !== 'unit13') return 0;
  // Check orthogonal neighbors for a Time Machine
  const neighbors = [
    [x-1, y], [x+1, y], [x, y-1], [x, y+1]
  ];
  for (const [nx, ny] of neighbors) {
    if (grid[ny]?.[nx]?.type === 'unit12') {
      return UNIT_CONFIG.unit13.bonus;
    }
  }
  return 0;
}

// BONUS 14: Prism Chain
// +40% Prism value if 3 Prisms in a row or column
// Bonus for unit14 (Prism)
export function unit14Bonus(grid: (Unit | null)[][], x: number, y: number): number {
  const unit = grid[y][x];
  if (!unit || unit.type !== 'unit14') return 0;
  // Check horizontal
  if (
    grid[y]?.[x-1]?.type === 'unit14' &&
    grid[y]?.[x+1]?.type === 'unit14'
  ) return UNIT_CONFIG.unit14.bonus;
  // Check vertical
  if (
    grid[y-1]?.[x]?.type === 'unit14' &&
    grid[y+1]?.[x]?.type === 'unit14'
  ) return UNIT_CONFIG.unit14.bonus;
  return 0;
}

// BONUS 15: Chancemaker Cluster
// +50% Chancemaker value if surrounded by Prisms or Antimatter Condensers (all 8 neighbors)
// Bonus for unit15 (Chancemaker)
export function unit15Bonus(grid: (Unit | null)[][], x: number, y: number): number {
  const unit = grid[y][x];
  if (!unit || unit.type !== 'unit15') return 0;
  // All 8 surrounding cells
  const neighbors = [
    [x-1, y-1], [x, y-1], [x+1, y-1],
    [x-1, y],           [x+1, y],
    [x-1, y+1], [x, y+1], [x+1, y+1]
  ];
  for (const [nx, ny] of neighbors) {
    const neighbor = grid[ny]?.[nx];
    if (!neighbor || (neighbor.type !== 'unit13' && neighbor.type !== 'unit14')) {
      return 0; // If any neighbor is missing or not the right type, no bonus
    }
  }
  return UNIT_CONFIG.unit15.bonus;
}

// BONUS 16: Engine Synergy
// +35% Fractal Engine value if adjacent to a Chancemaker
// Bonus for unit16 (Fractal Engine)
export function unit16Bonus(grid: (Unit | null)[][], x: number, y: number): number {
  const unit = grid[y][x];
  if (!unit || unit.type !== 'unit16') return 0;
  // Check orthogonal neighbors for a Chancemaker
  const neighbors = [
    [x-1, y], [x+1, y], [x, y-1], [x, y+1]
  ];
  for (const [nx, ny] of neighbors) {
    if (grid[ny]?.[nx]?.type === 'unit15') {
      return UNIT_CONFIG.unit16.bonus;
    }
  }
  return 0;
}

// BONUS 17: Console Chain
// +45% Javascript Console value if 3 Javascript Consoles in a row or column
// Bonus for unit17 (Javascript Console)
export function unit17Bonus(grid: (Unit | null)[][], x: number, y: number): number {
  const unit = grid[y][x];
  if (!unit || unit.type !== 'unit17') return 0;
  // Check horizontal
  if (
    grid[y]?.[x-1]?.type === 'unit17' &&
    grid[y]?.[x+1]?.type === 'unit17'
  ) return UNIT_CONFIG.unit17.bonus;
  // Check vertical
  if (
    grid[y-1]?.[x]?.type === 'unit17' &&
    grid[y+1]?.[x]?.type === 'unit17'
  ) return UNIT_CONFIG.unit17.bonus;
  return 0;
}

// BONUS 18: Idleverse Cluster
// +55% Idleverse value if surrounded by Javascript Consoles or Fractal Engines (all 8 neighbors)
// Bonus for unit18 (Idleverse)
export function unit18Bonus(grid: (Unit | null)[][], x: number, y: number): number {
  const unit = grid[y][x];
  if (!unit || unit.type !== 'unit18') return 0;
  // All 8 surrounding cells
  const neighbors = [
    [x-1, y-1], [x, y-1], [x+1, y-1],
    [x-1, y],           [x+1, y],
    [x-1, y+1], [x, y+1], [x+1, y+1]
  ];
  for (const [nx, ny] of neighbors) {
    const neighbor = grid[ny]?.[nx];
    if (!neighbor || (neighbor.type !== 'unit16' && neighbor.type !== 'unit17')) {
      return 0; // If any neighbor is missing or not the right type, no bonus
    }
  }
  return UNIT_CONFIG.unit18.bonus;
}

// AGGREGATE FUNCTION
// Returns the total bonus multiplier for a unit at (x, y)
export function getUnitBonusMultiplier(grid: (Unit | null)[][], x: number, y: number): number {
  const unit = grid[y]?.[x];
  if (!unit) return 1;

  let bonus = 0;
  
  // Only call the relevant bonus function for this unit type
  switch (unit.type) {
    case 'unit1': bonus = unit1Bonus(grid, x, y); break;
    case 'unit2': bonus = unit2Bonus(grid, x, y); break;
    case 'unit3': bonus = unit3Bonus(grid, x, y); break;
    case 'unit4': bonus = unit4Bonus(grid, x, y); break;
    case 'unit5': bonus = unit5Bonus(grid, x, y); break;
    case 'unit6': bonus = unit6Bonus(grid, x, y); break;
    case 'unit7': bonus = unit7Bonus(grid, x, y); break;
    case 'unit8': bonus = unit8Bonus(grid, x, y); break;
    case 'unit9': bonus = unit9Bonus(grid, x, y); break;
    case 'unit10': bonus = unit10Bonus(grid, x, y); break;
    case 'unit11': bonus = unit11Bonus(grid, x, y); break;
    case 'unit12': bonus = unit12Bonus(grid, x, y); break;
    case 'unit13': bonus = unit13Bonus(grid, x, y); break;
    case 'unit14': bonus = unit14Bonus(grid, x, y); break;
    case 'unit15': bonus = unit15Bonus(grid, x, y); break;
    case 'unit16': bonus = unit16Bonus(grid, x, y); break;
    case 'unit17': bonus = unit17Bonus(grid, x, y); break;
    case 'unit18': bonus = unit18Bonus(grid, x, y); break;
  }
  return bonus? bonus : 1;
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
      if (unit.type === 'unit4') isActive = unit4Bonus(grid, x, y) > 0;
      if (unit.type === 'unit5') isActive = unit5Bonus(grid, x, y) > 0;
      if (unit.type === 'unit6') isActive = unit6Bonus(grid, x, y) > 0;
      if (unit.type === 'unit7') isActive = unit7Bonus(grid, x, y) > 0;
      if (unit.type === 'unit8') isActive = unit8Bonus(grid, x, y) > 0;
      if (unit.type === 'unit9') isActive = unit9Bonus(grid, x, y) > 0;
      if (unit.type === 'unit10') isActive = unit10Bonus(grid, x, y) > 0;
      if (unit.type === 'unit11') isActive = unit11Bonus(grid, x, y) > 0;
      if (unit.type === 'unit12') isActive = unit12Bonus(grid, x, y) > 0;
      if (unit.type === 'unit13') isActive = unit13Bonus(grid, x, y) > 0;
      if (unit.type === 'unit14') isActive = unit14Bonus(grid, x, y) > 0;
      if (unit.type === 'unit15') isActive = unit15Bonus(grid, x, y) > 0;
      if (unit.type === 'unit16') isActive = unit16Bonus(grid, x, y) > 0;
      if (unit.type === 'unit17') isActive = unit17Bonus(grid, x, y) > 0;
      if (unit.type === 'unit18') isActive = unit18Bonus(grid, x, y) > 0;
      // Return a new Unit instance with updated bonusActive
      return new Unit(unit.id, unit.type, unit.position.x, unit.position.y, unit.value, isActive, unit.stackedCount);
    })
  );
}
