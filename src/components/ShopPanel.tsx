import { useGameStore } from "../game/gameStore";
import ErrorMessage from "./UI/ErrorMessage";
import UpgradeShop from "./UpgradeShop";
import UnitShop from "./UnitShop";
import { ShopContainer, ShopSection } from "../styles/components";

function ShopPanel() {
  const error = useGameStore(state => state.error);

  return (
    <ShopContainer>
      {error && <ErrorMessage message={error} />}
      <ShopSection>
        <UpgradeShop />
        <UnitShop />
      </ShopSection>
    </ShopContainer>
  );
}

export default ShopPanel;