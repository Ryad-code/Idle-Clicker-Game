import { useUnits } from "../contexts/UnitsContext";

export const UnitsView = () => {
  const { unitCounts} = useUnits();

  return (
    <div style={{ padding: 20 }}>
      <h2>Units</h2>

      <div style={{ marginBottom: 20 }}>
        <h3>Unit Counts</h3>
        <ul>
          <li>Archers: {unitCounts.archer}</li>
          <li>Knights: {unitCounts.knight}</li>
          <li>Mages: {unitCounts.mage}</li>
        </ul>
      </div>
      </div>
  );
};
