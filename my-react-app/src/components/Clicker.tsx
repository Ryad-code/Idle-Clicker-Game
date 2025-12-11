import styled from "styled-components";
import { useAtom } from "jotai";
import { playerAtom } from "../game/gameLogic";
import { Player } from "../game/types";

const ClickerContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: blue;
`;

function Clicker() {
  const [ player, setPlayer ] = useAtom(playerAtom);

  const handleClick = () => {
    setPlayer((prev) => {
      const newPlayer = Object.assign(new Player(), prev);
      newPlayer.click();
      return newPlayer;
    });
  };

  return (
        <ClickerContainer>
            <h2>POINTS</h2>
            <h1>{player.points}</h1>
            <div>
              <div>P/s: {player.calculatePointsPerSecond()}</div>
              <div>click value: {player.clickValue}</div>
              <div> total clicks: {player.totalClicks}</div>
              <button onClick={handleClick}>CLICK</button>
            </div>
        </ClickerContainer>
  )
}

export default Clicker
