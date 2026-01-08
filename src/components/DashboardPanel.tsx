import UpgradeShop from "./UpgradeShop";
import UnitShop from "./UnitShop";

function DashboardPanel() {
  return (
    <div className="overflow-auto">
      <UpgradeShop />
      <UnitShop />
    </div>
  );
}

export default DashboardPanel;