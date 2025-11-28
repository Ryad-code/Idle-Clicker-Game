import styled from "styled-components";
import Button from "./UI/Button";
import { useClicker } from "../hooks/useClicker";
import { useUnits } from "../hooks/useUnits";
//import { useState } from "react";

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

  

  //const {error, setError} = useState<string>("");
  const { removePoints, addPoints } = useClicker();
  const { addUnit, removeUnit/*, isUnitAvailable*/ } = useUnits();

const buyUnit = (price: number) => {
  /*if (!isUnitAvailable)
  {
    setError({type} + " is not available")
    return;
  }*/
  removePoints(price)
  if (price == 5)
    addUnit("unit1", {x: 0, y: 0}, 1)
  else if (price == 10)
    addUnit("unit2", {x: 0, y: 0}, 1)
  else if (price == 20)
    addUnit("unit3", {x: 0, y: 0}, 1)
}

const sellUnit = (price: number) => {
  addPoints(price)
  if (price == 5)
    removeUnit("unit1")
  else if (price == 10)
    removeUnit("unit2")
  else if (price == 20)
    removeUnit("unit3")
}

  return (
        <DashboardContainer>
          <h2>DASHBOARD</h2>
          <ShopContainer>
              <div>BUY</div>
              <Button onClick={() => buyUnit(5)} label="Unit1 5pts"></Button>
              <Button onClick={() => buyUnit(10)} label="Unit2 10pts"></Button>
              <Button onClick={() => buyUnit(20)} label="Unit3 20pts"></Button>
              <div>....................</div>
              <div>SELL</div>
              <Button onClick={() => sellUnit(5)} label="Unit1 5pts"></Button>
              <Button onClick={() => sellUnit(10)} label="Unit2 10pts"></Button>
              <Button onClick={() => sellUnit(20)} label="Unit3 20pts"></Button>
          </ShopContainer>
        </DashboardContainer>
  )
}

export default Dashboard