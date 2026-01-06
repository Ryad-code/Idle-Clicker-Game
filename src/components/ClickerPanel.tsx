import { useGameStore } from "../game/gameStore";
import PointsDisplay from "./PointsDisplay";
import ActiveUpgrades from "./ActiveUpgrades";
import ClickButton from "./ClickButton";
import { ClickerContainer } from "../styles/components";
import ErrorMessage from "./UI/ErrorMessage";

function ClickerPanel() {
  const error = useGameStore(state => state.error);

  return (
    <ClickerContainer>
      {error && <ErrorMessage message={error} />}
      <PointsDisplay />
      <ActiveUpgrades />
      <ClickButton />
    </ClickerContainer>
  );
}

export default ClickerPanel;
