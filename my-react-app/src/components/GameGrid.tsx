import { useState } from "react";
import { useGameState } from "../contexts";
import { UNIT_CONFIG } from "../game/config/units";
import type { Unit } from "../game/core/types";

// Dynamic buildGrid for any size
function buildGridDynamic(units: Unit[], size: number): (Unit | null)[][] {
  const grid: (Unit | null)[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null)
  );
  for (const unit of units) {
    const { x, y } = unit.position;
    if (
      typeof x === "number" &&
      typeof y === "number" &&
      x >= 0 && x < size &&
      y >= 0 && y < size
    ) {
      grid[y][x] = unit;
    }
  }
  return grid;
}

export default function GameGrid() {
  const [size, setSize] = useState(5);
  const { inventory } = useGameState();
  const grid = buildGridDynamic(inventory.units, size);

  return (
    <div>
      <select value={size} onChange={e => setSize(Number(e.target.value))}>
        {[3, 5, 7, 10].map(n => (
          <option key={n} value={n}>{n} x {n}</option>
        ))}
      </select>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gap: 4,
          marginTop: 16
        }}
      >
        {grid.flat().map((unit, i) =>
          unit ? (
            <div
              key={unit.id}
              title={UNIT_CONFIG[unit.type].name}
              style={{
                width: 40,
                height: 40,
                background: UNIT_CONFIG[unit.type].color,
                color: "#fff",
                border: "1px solid #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 4,
                fontSize: 22
              }}
            >
              {UNIT_CONFIG[unit.type].emoji}
            </div>
          ) : (
            <div
              key={i}
              style={{
                width: 40,
                height: 40,
                background: "#eee",
                border: "1px solid #ccc",
                borderRadius: 4
              }}
            />
          )
        )}
      </div>
    </div>
  );
}
