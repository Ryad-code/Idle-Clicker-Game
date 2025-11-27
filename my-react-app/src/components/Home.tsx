import styled from "styled-components";
import { useClicker } from "../contexts/ClickerContext";
import { UnitsView } from "./UnitsView";

const HomeContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: pink;
`;

function Home() {

 const { points } = useClicker();

  return (
        <HomeContainer>
            <h2>HOME</h2>
            <div>pts = {points}</div>
            <UnitsView/>
        </HomeContainer>
  )
}

export default Home