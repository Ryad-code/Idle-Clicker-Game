import { useState } from "react";
import { useGameStore } from "../game/gameStore";
import { gameEngine } from "../game/gameEngine";
import { Unit } from "../game/core/types";
import { getMaxCapacity } from "../game/core/types";
import { UNIT_CONFIG } from "../game/config/units";
import { adjustColorByStack } from "../utils/colorUtils";
import { theme } from "../styles/theme";
import { GridCell, GridContainer } from "../styles/components";

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
    <GridContainer size={size}>
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
            <GridCell
              key={idx}
              $color={adjustedColor}
              style={{
                border: isSelected 
                  ? `2px solid ${theme.colors.primary}` 
                  : cell.bonusActive 
                  ? `3px solid ${theme.colors.success}` 
                  : `1px solid ${theme.colors.border}`,
                boxShadow: cell.bonusActive ? `0 0 8px ${theme.colors.success}99` : "none",
                cursor: "pointer",
              }}
              onClick={() => handleCellClick(x, y)}
              title={`Production: ${actualProduction}/s | Stacked: ${cell.stackedCount}/${maxCapacity} | Bonus: ${cell.bonusActive ? 'Active' : 'Inactive'}`}
            >
              {meta.emoji.startsWith('/') 
                ? <img src={meta.emoji} alt={meta.name} style={{width: '38px', height: '38px'}} /> 
                : meta.emoji}
            </GridCell>
          );
        } else {
          return (
            <GridCell
              key={idx}
              $color={theme.colors.text}
              style={{ 
                border: `1px solid ${theme.colors.text}`, 
                color: theme.colors.border, 
                cursor: "pointer" 
              }}
              onClick={() => handleCellClick(x, y)}
              title="Empty slot - Click to move units here"
            />
          );
        }
      })}
    </GridContainer>
  );
}

export default Grid;
