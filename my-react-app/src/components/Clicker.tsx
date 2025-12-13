import styled from "styled-components";
import { useGame } from "../contexts";

const ClickerContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: blue;
`;

function Clicker() {
  const { player, click } = useGame();

  return (
        <ClickerContainer>
            <h2>POINTS</h2>
            <h1>{player.points}</h1>
            <div>
              <div>P/s: {player.calculatePointsPerSecond()}</div>
              <div>click value: {player.clickValue}</div>
              <div> total clicks: {player.totalClicks}</div>
              <button onClick={click}>CLICK</button>
            </div>
        </ClickerContainer>
  )
}

export default Clicker
