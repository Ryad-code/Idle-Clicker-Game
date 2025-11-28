import { useContext } from "react";
import { UnitsContext } from "../contexts/UnitsContext";

export const useUnits = () => {
  const ctx = useContext(UnitsContext);
  if (!ctx) throw new Error("useUnits must be used inside UnitsProvider");
  return ctx;
};
