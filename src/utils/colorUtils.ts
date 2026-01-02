/**
 * Adjusts a hex color's brightness based on stack count
 * Higher stack counts result in darker, more saturated colors
 * @param hexColor - Base color in hex format (e.g., "#4CAF50")
 * @param stackCount - Current stack count of the unit
 * @param maxCapacity - Maximum capacity for this unit type
 * @returns Adjusted hex color
 */
export function adjustColorByStack(hexColor: string, stackCount: number, maxCapacity: number): string {
  // Parse hex color to RGB
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate intensity factor based on stack percentage
  // Range from 1.0 (stack=1) to 1.5 (stack=maxCapacity)
  const stackRatio = Math.min(stackCount / maxCapacity, 1);
  const intensityFactor = 1 + (stackRatio * 0.5);

  // Darken and saturate the color
  const adjustedR = Math.min(255, Math.floor(r * intensityFactor));
  const adjustedG = Math.min(255, Math.floor(g * intensityFactor));
  const adjustedB = Math.min(255, Math.floor(b * intensityFactor));

  // Convert back to hex
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(adjustedR)}${toHex(adjustedG)}${toHex(adjustedB)}`;
}
