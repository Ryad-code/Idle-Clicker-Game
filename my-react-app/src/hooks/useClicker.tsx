import { useContext } from "react";
import { ClickerContext } from "../contexts/ClickerContext";

export function useClicker() {
  const ctx = useContext(ClickerContext);
  if (!ctx) throw new Error("useClicker must be used inside ClickerProvider");
  return ctx;
}
