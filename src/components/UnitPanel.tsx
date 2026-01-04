import { useState } from "react";
import { useGameStore } from "../game/gameStore";
import { gameEngine } from "../game/gameEngine";
import { UNIT_CONFIG } from "../game/config/units";
import { Unit } from "../game/core/types";
import { getMaxCapacity } from "../game/core/types";
import { adjustColorByStack } from "../utils/colorUtils";
import { Card } from 'pixel-retroui';
import {
  ShopContainer,
  GridCell,
  EmptyState,
  GridContainer,
  UnitContainer
} from "../styles/components";


function UnitPanel() {
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

  // Render the current grid using styled components
  const renderGrid = () => {
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
                    border: isSelected ? "2px solid #2196F3" : cell.bonusActive ? "3px solid gold" : "1px solid #bbb",
                    boxShadow: cell.bonusActive ? "0 0 8px rgba(255,215,0,0.6)" : "none",
                    cursor: "pointer",
                  }}
                  onClick={() => handleCellClick(x, y)}
                  title={`Production: ${actualProduction}/s | Stacked: ${cell.stackedCount}/${maxCapacity} | Bonus: ${cell.bonusActive ? 'Active' : 'Inactive'}`}
                >
                  {meta.emoji}
                </GridCell>
            );
          } else {
            return (
                <GridCell
                  key={idx}
                  $color={"#fff"}
                  style={{ border: "1px solid #eee", color: "#bbb", cursor: "pointer" }}
                  onClick={() => handleCellClick(x, y)}
                  title="Empty slot - Click to move units here"
                />
            );
          }
        })}
      </GridContainer>
    );
  };

  // Render a summary of all units owned
  const renderUnitInfos = () => {
    // Count units by type
    const unitCounts: Record<string, number> = {};
    const bonusCounts: Record<string, number> = {};
    grid.flat().forEach((cell: Unit | null) => {
      if (cell) {
        unitCounts[cell.type] = (unitCounts[cell.type] || 0) + cell.stackedCount;
        if (cell.bonusActive) {
          bonusCounts[cell.type] = (bonusCounts[cell.type] || 0) + cell.stackedCount;
        }
      }
    });
    // Only show types that are present
    const ownedTypes = Object.keys(unitCounts);
    if (ownedTypes.length === 0) {
      return <EmptyState>No units owned yet.</EmptyState>;
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {ownedTypes.map(type => {
          const meta = UNIT_CONFIG[type as keyof typeof UNIT_CONFIG];
          const count = unitCounts[type];
          const bonusCount = bonusCounts[type] || 0;
          const level = unitLevels[type as keyof typeof unitLevels];
          const maxCapacity = getMaxCapacity(level);
          return (
              <Card 
                key={type}
                style={{ width: 320, maxWidth: '100%', display: 'flex', gap: '8px', alignItems: 'center' }}
              >
                <span title={`${meta.bonusDescription} - Bonus activates when 3+ units are placed together`}>{meta.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: meta.color }}>{meta.name}</div>
                  {/* <div style={{ fontSize: 13, color: '#666' }}>{meta.description}</div> */}
                  <div style={{ fontSize: 10, color: '#888' }}>{meta.bonusDescription}</div>
                  <div style={{ fontSize: 10, marginTop: 4 }}>
                    <b>Owned:</b> {count} &nbsp;|&nbsp; <b>Level:</b> {level} (cap: {maxCapacity}) &nbsp;|&nbsp; <b>production:</b> {meta.value}/s &nbsp;|&nbsp; <b>bonuses active:</b> {bonusCount}
                  </div>
                </div>
              </Card>
          );
        })}
      </div>
    );
  };

  // Only display the current grid and its dimensions
  return (
    <ShopContainer>
      <UnitContainer>
        {renderGrid()}
        {renderUnitInfos()}
      </UnitContainer>
    </ShopContainer>
  );
}

export default UnitPanel;