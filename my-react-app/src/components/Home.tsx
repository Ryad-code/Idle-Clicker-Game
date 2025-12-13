import styled from "styled-components";
import { useGame } from "../contexts";
import { UNIT_CONFIG, UNIT_TYPES } from "../game/gameConfig";
import type { UnitType } from "../game/types";

const HomeContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: pink;
  padding: 20px;
  gap: 20px;
`;

const UnitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
  width: 100%;
  max-width: 400px;
`;

const UnitCard = styled.div<{ $color: string }>`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  background-color: ${props => props.$color};
  color: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const UnitStats = styled.div`
  display: flex;
  gap: 30px;
  font-size: 16px;
  flex-wrap: wrap;
  justify-content: center;
`;

const StatBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.5);
  padding: 8px 12px;
  border-radius: 8px;
`;

const StatEmoji = styled.span`
  font-size: 24px;
`;

function Home() {
  const { player } = useGame();
  
  return (
    <HomeContainer>
      <h2>HOME</h2>
      <h3>Units ({player.units.length})</h3>
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
      ) : (
        <div>No units yet. Buy some in Dashboard!</div>
      )}
    </HomeContainer>
  );
}

export default Home;