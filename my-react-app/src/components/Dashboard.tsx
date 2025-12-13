import styled from "styled-components";
import { UNIT_CONFIG, UNIT_TYPES } from "../game/gameConfig";
import { useGame } from "../contexts";
import type { UnitType } from "../game/types";

const DashboardContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: orange;
`;

const ShopContainer = styled.div`
  height: stretch;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: grey;
  gap: 2%;
`;

const ActionButton = styled.button<{ $disabled?: boolean }>`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.5 : 1};
  transition: all 0.2s ease;
  background: ${props => props.$disabled ? '#ccc' : '#4CAF50'};
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 200px;
  justify-content: space-between;

  &:hover {
    transform: ${props => props.$disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.$disabled ? 'none' : '0 4px 8px rgba(0,0,0,0.2)'};
  }

  &:active {
    transform: ${props => props.$disabled ? 'none' : 'translateY(0)'};
  }
`;

const SellButton = styled(ActionButton)`
  background: ${props => props.$disabled ? '#ccc' : '#f44336'};
`;

const ButtonLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ButtonPrice = styled.span`
  font-size: 12px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
`;

const ButtonInfo = styled.span`
  font-size: 11px;
  opacity: 0.8;
`;

const SectionTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin: 12px 0 8px;
  color: #333;
`;

function Dashboard() {
  const { player, buyUnit, sellUnit, save } = useGame();

  const handleManualSave = async () => {
    await save();
  };

  return (
    <DashboardContainer>
      <h2>DASHBOARD</h2>
      <button onClick={handleManualSave} style={{ 
        padding: '8px 16px', 
        marginBottom: '12px',
        background: '#4ba3f5',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}>
        💾 Save Progress
      </button>
      <ShopContainer>
        <SectionTitle>BUY UNITS</SectionTitle>
        {UNIT_TYPES.map((unitType: UnitType) => {
          const meta = UNIT_CONFIG[unitType];
          const cost = player.calculateUnitCost(unitType, meta.cost);
          const canAfford = player.canAfford(cost);
          const owned = player.getUnitCount(unitType);
          
          return (
            <ActionButton 
              key={`buy-${unitType}`}
              onClick={() => buyUnit(unitType)}
              $disabled={!canAfford}
              title={meta.description}
            >
              <ButtonLabel>
                <span>{meta.emoji}</span>
                <span>{meta.name}</span>
                <ButtonInfo>({owned} owned)</ButtonInfo>
              </ButtonLabel>
              <ButtonPrice>{cost} pts</ButtonPrice>
            </ActionButton>
          );
        })}
        
        <SectionTitle>SELL UNITS</SectionTitle>
        {UNIT_TYPES.map((unitType: UnitType) => {
          const meta = UNIT_CONFIG[unitType];
          const owned = player.getUnitCount(unitType);
          const canSell = owned > 0;
          
          return (
            <SellButton 
              key={`sell-${unitType}`}
              onClick={() => sellUnit(unitType)}
              $disabled={!canSell}
            >
              <ButtonLabel>
                <span>{meta.emoji}</span>
                <span>Sell {meta.name}</span>
              </ButtonLabel>
              <ButtonPrice>+{meta.refund} pts</ButtonPrice>
            </SellButton>
          );
        })}
      </ShopContainer>
    </DashboardContainer>
  );
}

export default Dashboard