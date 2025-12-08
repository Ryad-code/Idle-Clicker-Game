import styled from "styled-components";
import { useAtom } from "jotai";
import { points } from "../gameLogic";

const ClickerContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: blue;
`;

function Clicker() {
  const [ pointed, setPointed ] = useAtom(points);
  
  return (
        <ClickerContainer>
            <h2>POINTS</h2>
            <h1>{pointed}</h1>
            <button onClick={() => setPointed(pointed + 1)}>CLICK</button>
        </ClickerContainer>
  )
}

export default Clicker
