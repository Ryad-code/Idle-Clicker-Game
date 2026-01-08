import PointsDisplay from "./PointsDisplay";
import ActiveUpgrades from "./ActiveUpgrades";
import ClickButton from "./ClickButton";

function ClickerPanel() {
  return (
    <div className="flex flex-col items-center p-4">
      <PointsDisplay />
      <ActiveUpgrades />
      <ClickButton />
    </div>
  );
}

export default ClickerPanel;
