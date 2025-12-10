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
            <h2>P/s: {player.calculatePointsPerSecond()}</h2>
            <h2>click value: {player.clickValue}</h2>
            <button onClick={handleClick}>CLICK</button>
        </ClickerContainer>
  )
}

export default Clicker
