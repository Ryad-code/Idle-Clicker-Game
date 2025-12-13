import { useGame } from "../contexts";
import { UNIT_CONFIG, UNIT_TYPES } from "../game/gameConfig";
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
} from "../styles/components/home.styles";

function Home() {
  const { player } = useGame();
  
  return (
    <HomeContainer>
      <Title>My Units</Title>
      <UnitStats>
        {UNIT_TYPES.map((unitType: UnitType) => {
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

export default Home;