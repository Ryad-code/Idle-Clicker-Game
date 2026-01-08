import ClickerPanel from '../components/ClickerPanel';
import UnitPanel from '../components/UnitPanel';
import DashboardPanel from '../components/DashboardPanel';

function HomePage() {
  return (
    <div className="w-full h-full overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full h-full">
        <ClickerPanel />
        <UnitPanel />
        <DashboardPanel />
      </div>
    </div>
  );
}

export default HomePage;
