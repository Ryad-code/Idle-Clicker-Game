import styled from "styled-components";
import { useAtom } from "jotai";
import { points } from "../gameLogic"
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

  
  const [pointsValue] = useAtom(points);

  return (
        <DashboardContainer>
          <h2>DASHBOARD</h2>
          <h3>{pointsValue}</h3>
          <ShopContainer>
              <div>BUY</div>
              <div>....................</div>
              <div>SELL</div>
          </ShopContainer>
        </DashboardContainer>
  )
}

export default Dashboard