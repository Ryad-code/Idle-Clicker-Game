import { useGameState } from "../contexts";
import { UNIT_CONFIG, UNIT_TYPES } from "../game/config/units";
import type { UnitType } from "../game/core/types";
import ErrorMessage from "./UI/ErrorMessage";
import {
  HomeContainer,
  UnitStats,
  StatBox,
  StatEmoji,
  EmptyState,
  Subtitle
} from "../styles/components/unitPanel.styles";
import GameGrid from "./GameGrid";
import { buildGrid } from "../game/core/grid";

function UnitPanel() {
  const { inventory, ui } = useGameState();
  
  // Only show stats for units the player owns
  const ownedUnitTypes = UNIT_TYPES.filter(type => 
    inventory.units.filter(u => u.type === type).length > 0
  );
  
  return (
    <HomeContainer>
      {ui.error && <ErrorMessage message={ui.error} />}
      {ownedUnitTypes.length > 0 && (
        <UnitStats>
          {ownedUnitTypes.map((unitType: UnitType) => {
            const meta = UNIT_CONFIG[unitType];
            const count = inventory.units.filter(u => u.type === unitType).length;
            
            return (
              <StatBox key={unitType}>
                <StatEmoji>{meta.emoji}</StatEmoji>
                <span>{meta.name}: {count}</span>
              </StatBox>
            );
          })}
        </UnitStats>
      )}
      {/* Build grid outside of JSX for clarity */}
      <GameGrid grid={buildGrid(inventory.units)} />
      {inventory.units.length > 0 ? (
        <>
          <Subtitle>Total: {inventory.units.length} units</Subtitle>
        </>
      ) : (
        <EmptyState>No units yet. Visit the shop to buy some!</EmptyState>
      )}
    </HomeContainer>
  );
}

export default UnitPanel;