import PointsDisplay from "./PointsDisplay";
import ActiveUpgrades from "./ActiveUpgrades";
import ClickButton from "./ClickButton";
import { Card } from "./ui/pixelact-ui/card";

function ClickerPanel() {
  return (
    <Card className="box-shadow-margin flex flex-col items-center p-6">
      <PointsDisplay />
      <ActiveUpgrades />
      <ClickButton />
    </Card>
  );
}

export default ClickerPanel;
