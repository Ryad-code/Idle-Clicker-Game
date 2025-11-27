//import { useState } from "react"
import styled from "styled-components";
import { useClicker } from "../contexts/ClickerContext";

const ClickerContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: blue;
`;

function Clicker() {
  const { points, pointsPerSecond, handleClick } = useClicker();
  
  return (
        <ClickerContainer>
            <h2>POINTS</h2>
            <h1>{points}</h1>
            <h2>{pointsPerSecond}/s</h2>
            <button onClick={() => handleClick()}>CLICK HERE MTFCK</button>
        </ClickerContainer>
  )
}

export default Clicker
