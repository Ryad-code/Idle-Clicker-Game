import { useState } from "react";
import { useGameStore } from "../game/gameStore";
import { gameEngine } from "../game/gameEngine";
import { Unit } from "../game/core/types";
import { getMaxCapacity } from "../game/core/types";
import { UNIT_CONFIG } from "../game/config/units";
import { adjustColorByStack } from "../utils/colorUtils";

function Grid() {
  const grid = useGameStore(state => state.grid);
  const unitLevels = useGameStore(state => state.unitLevels);
  const syncWithEngine = useGameStore(state => state.syncWithEngine);
  const [selected, setSelected] = useState<{ x: number; y: number } | null>(null);

  const handleCellClick = (x: number, y: number) => {
    const cell = grid[y][x];
    if (!selected) {
      if (cell) setSelected({ x, y }); // Select the unit
    } else {
      const { x: sx, y: sy } = selected;
      if (x === sx && y === sy) {
        setSelected(null); // Deselect if same
      } else {
        gameEngine.moveUnit(sx, sy, x, y); // Move or swap
        syncWithEngine();
        setSelected(null);
      }
    }
  };

  const size = grid.length;

  return (
    <div className="grid gap-1 my-4" style={{ gridTemplateColumns: `repeat(${size}, 48px)`, gridTemplateRows: `repeat(${size}, 48px)` }}>
      {grid.flat().map((cell: Unit | null, idx: number) => {
        const x = idx % size;
        const y = Math.floor(idx / size);
        const isSelected = selected && selected.x === x && selected.y === y;

        if (cell) {
          const meta = UNIT_CONFIG[cell.type];
          const actualProduction = meta.value * cell.stackedCount * (cell.bonusActive ? (meta.bonus) : 1);
          const maxCapacity = getMaxCapacity(unitLevels[cell.type]);
          const adjustedColor = adjustColorByStack(meta.color, cell.stackedCount, maxCapacity);

          return (
            <div
              key={idx}
              className="w-12 h-12 flex items-center justify-center text-4xl cursor-pointer"
              style={{
                backgroundColor: adjustedColor,
                border: isSelected 
                  ? '2px solid hsl(var(--primary))' 
                  : cell.bonusActive 
                  ? '3px solid hsl(var(--success))' 
                  : '1px solid hsl(var(--border))',
                boxShadow: cell.bonusActive ? '0 0 8px hsl(var(--success) / 0.6)' : 'none',
              }}
              onClick={() => handleCellClick(x, y)}
              title={`Production: ${actualProduction}/s | Stacked: ${cell.stackedCount}/${maxCapacity} | Bonus: ${cell.bonusActive ? 'Active' : 'Inactive'}`}
            >
              {meta.emoji.startsWith('/') 
                ? <img src={meta.emoji} alt={meta.name} className="w-[38px] h-[38px]" /> 
                : meta.emoji}
            </div>
          );
        } else {
          return (
            <div
              key={idx}
              className="w-12 h-12 flex items-center justify-center border border-foreground text-border cursor-pointer"
              onClick={() => handleCellClick(x, y)}
              title="Empty slot - Click to move units here"
            />
          );
        }
      })}
    </div>
  );
}

export default Grid;
