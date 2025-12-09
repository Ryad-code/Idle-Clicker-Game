import styled from "styled-components";
import { useAtom } from "jotai";
import { playerAtom, buyUnit, sellUnit } from "../game/gameLogic";

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
        <button onClick={() => setPlayer(buyUnit(player, "unit1", 5, 1))}>Unit1 - 5pts</button>
        <button onClick={() => setPlayer(buyUnit(player, "unit2", 10, 2))}>Unit2 - 10pts</button>
        <button onClick={() => setPlayer(buyUnit(player, "unit3", 20, 5))}>Unit3 - 20pts</button>
        <div>....................</div>
        <div>SELL</div>
        <button onClick={() => setPlayer(sellUnit(player, "unit1", 2))}>Sell Unit1 - 2pts</button>
        <button onClick={() => setPlayer(sellUnit(player, "unit2", 5))}>Sell Unit2 - 5pts</button>
        <button onClick={() => setPlayer(sellUnit(player, "unit3", 10))}>Sell Unit3 - 10pts</button>
      </ShopContainer>
    </DashboardContainer>
  );
}

export default Dashboard