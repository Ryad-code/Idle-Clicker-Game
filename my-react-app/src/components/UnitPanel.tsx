import { useGameState } from "../contexts";
import { UNIT_CONFIG } from "../game/config/units";
import {
  HomeContainer,
  GridUnitCard,
  StatBox,
  StatEmoji,
  EmptyState
} from "../styles/components/unitPanel.styles";
import styled from "styled-components";


const UnitRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  align-items: center;
`;


function UnitPanel() {
  const state = useGameState();
  const grid = state.grid;
  

  // Render the current grid using styled components
  const renderGrid = () => {
    const size = grid.length;
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${size}, 32px)`,
          gridTemplateRows: `repeat(${size}, 32px)`,
          gap: 2,
          margin: "16px 0"
        }}
      >
        {grid.flat().map((cell, idx) => {
          if (cell) {
            const meta = UNIT_CONFIG[cell.type];
            return (
              <GridUnitCard
                key={idx}
                $color={meta.color}
                title={meta.description}
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
      </div>
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
                <div style={{ fontSize: 13, marginTop: 4 }}>
                  <b>Owned:</b> {unitCounts[type]} &nbsp;|&nbsp; <b>Value:</b> {meta.value}/s
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