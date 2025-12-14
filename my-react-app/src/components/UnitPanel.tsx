import { useGame } from "../contexts";
import { UNIT_CONFIG, UNIT_TYPES } from "../game/unitConfig";
import type { UnitType } from "../game/types";
import {
  HomeContainer,
  UnitsGrid,
  UnitCard,
  UnitStats,
  StatBox,
  StatEmoji,
  EmptyState,
  Title,
  Subtitle
} from "../styles/components/unitPanel.styles";

function UnitPanel() {
  const { player } = useGame();
  
  // Only show stats for units the player owns
  const ownedUnitTypes = UNIT_TYPES.filter(type => player.getUnitCount(type) > 0);
  
  return (
    <HomeContainer>
      <Title>My Units</Title>
      {ownedUnitTypes.length > 0 && (
        <UnitStats>
          {ownedUnitTypes.map((unitType: UnitType) => {
            const meta = UNIT_CONFIG[unitType];
            const count = player.getUnitCount(unitType);
            
            return (
              <StatBox key={unitType}>
                <StatEmoji>{meta.emoji}</StatEmoji>
                <span>{meta.name}: {count}</span>
              </StatBox>
            );
          })}
        </UnitStats>
      )}
      {player.units.length > 0 ? (
        <>
          <Subtitle>Total: {player.units.length} units</Subtitle>
          <UnitsGrid>
            {player.units.map(unit => {
              const meta = UNIT_CONFIG[unit.type];
              return (
                <UnitCard 
                  key={unit.id} 
                  $color={meta.color}
                  title={`${meta.name} - ${meta.value} pts/s`}
                >
                  {meta.emoji}
                </UnitCard>
              );
            })}
          </UnitsGrid>
        </>
      ) : (
        <EmptyState>No units yet. Visit the shop to buy some!</EmptyState>
      )}
    </HomeContainer>
  );
}

export default UnitPanel;