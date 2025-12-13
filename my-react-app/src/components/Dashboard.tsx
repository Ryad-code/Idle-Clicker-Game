import styled from "styled-components";
import { UNIT_CONFIG } from "../game/gameLogic";
import { useGame } from "../contexts";

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
        <div>BUY</div>
        <button onClick={() => buyUnit("unit1")}>Unit1 - {player.calculateUnitCost("unit1", UNIT_CONFIG.unit1.cost)}pts</button>
        <button onClick={() => buyUnit("unit2")}>Unit2 - {player.calculateUnitCost("unit2", UNIT_CONFIG.unit2.cost)}pts</button>
        <button onClick={() => buyUnit("unit3")}>Unit3 - {player.calculateUnitCost("unit3", UNIT_CONFIG.unit3.cost)}pts</button>
        <div>....................</div>
        <div>SELL</div>
        <button onClick={() => sellUnit("unit1")}>Sell Unit1 - {UNIT_CONFIG.unit1.refund}pts</button>
        <button onClick={() => sellUnit("unit2")}>Sell Unit2 - {UNIT_CONFIG.unit2.refund}pts</button>
        <button onClick={() => sellUnit("unit3")}>Sell Unit3 - {UNIT_CONFIG.unit3.refund}pts</button>
      </ShopContainer>
    </DashboardContainer>
  );
}

export default Dashboard