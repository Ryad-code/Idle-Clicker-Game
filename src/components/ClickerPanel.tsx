import PointsDisplay from "./PointsDisplay";
import ActiveUpgrades from "./ActiveUpgrades";
import ClickButton from "./ClickButton";
import { Card } from "./ui/pixelact-ui/card";

function ClickerPanel() {
  return (
    <Card className="box-shadow-margin m-2 p-6 flex flex-col items-center overflow-y-auto overflow-x-hidden">
      <PointsDisplay />
      <ActiveUpgrades />
      <ClickButton />
    </Card>
  );
}

export default ClickerPanel;
