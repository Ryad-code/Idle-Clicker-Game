import styled from "styled-components";
import Button from "./UI/Button";
import { useClicker } from "../contexts/ClickerContext";
import { useUnits } from "../contexts/UnitsContext";

const DashboardContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: orange;
`;

const ShopContainer = styled.div`
  height: 30%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: red;
  gap: 2%;
`;

function Home() {

  const { removePoints } = useClicker();
  const { addUnit } = useUnits()

const buyUnit = (price: number) => {
  removePoints(price)
  if (price == 5)
    addUnit("knight")
  else if (price == 10)
    addUnit("archer")
  else if (price == 20)
    addUnit("mage")
}

  return (
        <DashboardContainer>
          <h2>DASHBOARD</h2>
          <ShopContainer>
              <Button onClick={() => buyUnit(5)} label="Archer 5pts"></Button>
              <Button onClick={() => buyUnit(10)} label="Knight 10pts"></Button>
              <Button onClick={() => buyUnit(20)} label="Mage 20pts"></Button>
          </ShopContainer>
        </DashboardContainer>
  )
}

export default Home