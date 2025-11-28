import { useUnits } from "../hooks/useUnits";

export const UnitsView = () => {
  const { unitCounts} = useUnits();

  return (
    <div style={{ padding: 20 }}>
      <h2>Units</h2>

      <div style={{ marginBottom: 20 }}>
        <h3>Unit Counts</h3>
        <ul>
          <li>Unit1: {unitCounts.unit1}</li>
          <li>Unit2: {unitCounts.unit2}</li>
          <li>Unit3: {unitCounts.unit3}</li>
        </ul>
      </div>
      </div>
  );
};
