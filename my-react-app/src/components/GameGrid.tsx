import { useState, useEffect } from "react";
import { useGameState } from "../contexts";
import { UNIT_CONFIG } from "../game/config/units";

export default function GameGrid() {
  const [size, setSize] = useState(5);
  const { grid } = useGameState();
  // Optionally, you can slice or reshape grid for dynamic size
  const displayGrid = grid.slice(0, size).map(row => row.slice(0, size));

  useEffect(() => {
    // Log the grid to the console, showing unit types or null
    const typeGrid = displayGrid.map(row =>
      row.map(cell => (cell ? cell.type : null))
    );
    // Pretty print as rows
    console.log("Grid (unit types):");
    typeGrid.forEach(row => console.log(row));
  }, [displayGrid]);

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
          {displayGrid.flat().map((unit, i) =>
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
