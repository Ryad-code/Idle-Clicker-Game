import styled from "styled-components";
import { useGame } from "../contexts";

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

const UnitCard = styled.div<{ $type: string }>`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  background-color: ${props => {
    switch(props.$type) {
      case "unit1": return "#4CAF50";
      case "unit2": return "#2196F3";
      case "unit3": return "#FF9800";
      default: return "#999";
    }
  }};
  color: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
`;

const UnitStats = styled.div`
  display: flex;
  gap: 30px;
  font-size: 16px;
`;

const StatBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatEmoji = styled.span`
  font-size: 24px;
`;

function Home() {
  const { player } = useGame();
  
  const unit1Count = player.units.filter(u => u.type === "unit1").length;
  const unit2Count = player.units.filter(u => u.type === "unit2").length;
  const unit3Count = player.units.filter(u => u.type === "unit3").length;
  
  return (
    <HomeContainer>
      <h2>HOME</h2>
      <h3>Units ({player.units.length})</h3>
      <UnitStats>
        <StatBox>
          <StatEmoji>🟢</StatEmoji>
          <span>Unit1: {unit1Count}</span>
        </StatBox>
        <StatBox>
          <StatEmoji>🔵</StatEmoji>
          <span>Unit2: {unit2Count}</span>
        </StatBox>
        <StatBox>
          <StatEmoji>🟠</StatEmoji>
          <span>Unit3: {unit3Count}</span>
        </StatBox>
      </UnitStats>
      {player.units.length > 0 ? (
        <UnitsGrid>
          {player.units.map(unit => (
            <UnitCard key={unit.id} $type={unit.type}>
              {unit.type === "unit1" ? "🟢" : unit.type === "unit2" ? "🔵" : "🟠"}
            </UnitCard>
          ))}
        </UnitsGrid>
      ) : (
        <div>No units yet. Buy some in Dashboard!</div>
      )}
    </HomeContainer>
  );
}

export default Home;