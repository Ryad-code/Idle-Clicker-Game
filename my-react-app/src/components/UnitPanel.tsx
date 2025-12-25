import { useEffect } from "react";
import { useGameState } from "../contexts";
import { UNIT_CONFIG } from "../game/config/units";
import {
  HomeContainer,
  GridUnitCard,
  StatBox,
  StatEmoji,
  EmptyState,
  UnitRows,
  GridContainer
} from "../styles/components/unitPanel.styles";


function UnitPanel() {
  const state = useGameState();
  const grid = state.grid;

  useEffect(() => {
      console.log('Current grid state:', grid);
    }, [grid]);
  

  // Render the current grid using styled components
  const renderGrid = () => {
    const size = grid.length;
    return (
      <GridContainer size={size}>
        {grid.flat().map((cell, idx) => {
          if (cell) {
            const meta = UNIT_CONFIG[cell.type];
            return (
              <GridUnitCard
                key={idx}
                $color={cell.bonusActive ? meta.bonusColor : meta.color}
                title={`${meta.value * (cell.bonusActive ? meta.bonus : 1)}`}
              >
                {meta.emoji}
              </GridUnitCard>
            );
          } else {
            return (
              <GridUnitCard
                key={idx}
                $color={"#fff"}
                style={{ border: "1px solid #eee", color: "#bbb" }}
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
    grid.flat().forEach(cell => {
      if (cell) {
        unitCounts[cell.type] = (unitCounts[cell.type] || 0) + 1;
      }
    });
    // Only show types that are present
    const ownedTypes = Object.keys(unitCounts);
    if (ownedTypes.length === 0) {
      return <EmptyState>No units owned yet.</EmptyState>;
    }
    return (
      <UnitRows>
        {ownedTypes.map(type => {
          const meta = UNIT_CONFIG[type as keyof typeof UNIT_CONFIG];
          return (
            <StatBox key={type} style={{ width: 320, maxWidth: '100%' }}>
              <StatEmoji>{meta.emoji}</StatEmoji>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: meta.color }}>{meta.name}</div>
                <div style={{ fontSize: 13, color: '#666' }}>{meta.description}</div>
                <div style={{ fontSize: 13, color: '#888' }}>{meta.bonusDescription}</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>
                  <b>Owned:</b> {unitCounts[type]} &nbsp;|&nbsp; <b>production:</b> {meta.value}/s
                </div>
              </div>
            </StatBox>
          );
        })}
      </UnitRows>
    );
  };

  // Only display the current grid and its dimensions
  return (
    <HomeContainer>
      {renderGrid()}
      {renderUnitInfos()}
    </HomeContainer>
  );
}

export default UnitPanel;