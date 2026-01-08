import UpgradeShop from "./UpgradeShop";
import UnitShop from "./UnitShop";
import { Card } from "./ui/pixelact-ui/card";

function DashboardPanel() {
  return (
    <Card className="box-shadow-margin m-2 p-6 overflow-y-auto flex flex-col gap-4">
      <UpgradeShop />
      <UnitShop />
    </Card>
  );
}

export default DashboardPanel;