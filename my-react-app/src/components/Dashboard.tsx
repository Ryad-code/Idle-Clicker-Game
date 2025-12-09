import styled from "styled-components";
import { useAtom } from "jotai";
import { playerAtom, buyUnit, sellUnit, UNIT_CONFIG } from "../game/gameLogic";

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
  const [player, setPlayer] = useAtom(playerAtom);

  return (
    <DashboardContainer>
      <h2>DASHBOARD</h2>
      <h3>{player.points} pts</h3>
      <ShopContainer>
        <div>BUY</div>
        <button onClick={() => setPlayer(buyUnit(player, "unit1"))}>Unit1 - {UNIT_CONFIG.unit1.cost}pts</button>
        <button onClick={() => setPlayer(buyUnit(player, "unit2"))}>Unit2 - {UNIT_CONFIG.unit2.cost}pts</button>
        <button onClick={() => setPlayer(buyUnit(player, "unit3"))}>Unit3 - {UNIT_CONFIG.unit3.cost}pts</button>
        <div>....................</div>
        <div>SELL</div>
        <button onClick={() => setPlayer(sellUnit(player, "unit1"))}>Sell Unit1 - {UNIT_CONFIG.unit1.refund}pts</button>
        <button onClick={() => setPlayer(sellUnit(player, "unit2"))}>Sell Unit2 - {UNIT_CONFIG.unit2.refund}pts</button>
        <button onClick={() => setPlayer(sellUnit(player, "unit3"))}>Sell Unit3 - {UNIT_CONFIG.unit3.refund}pts</button>
      </ShopContainer>
    </DashboardContainer>
  );
}

export default Dashboard