import styled from "styled-components";
import { useAtom } from "jotai";
import { points } from "../gameLogic";

const HomeContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: pink;
`;

function Home() {

 const [ pointsValue ] = useAtom(points);
  
  return (
        <HomeContainer>
            <h2>HOME</h2>
            <div>pts = {pointsValue}</div>
        </HomeContainer>
  )
}

export default Home