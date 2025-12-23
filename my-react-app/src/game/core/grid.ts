import type { Unit } from "../../game/core/types";
import { GRID_ROWS, GRID_COLS } from "../config/grid";

// Takes units and maps them into a 2D grid array
export function buildGrid(units: Unit[]): (Unit | null)[][] {
  const grid: (Unit | null)[][] = Array.from({ length: GRID_ROWS }, () =>
    Array.from({ length: GRID_COLS }, () => null)
  );
  for (const unit of units) {
    const { x, y } = unit.position;
    if (
      typeof x === "number" &&
      typeof y === "number" &&
      x >= 0 && x < GRID_COLS &&
      y >= 0 && y < GRID_ROWS
    ) {
      grid[y][x] = unit;
    }
  }
  return grid;
}
