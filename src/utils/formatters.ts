import Decimal from 'break_infinity.js';

/**
 * Formats a Decimal for display with 4 significant digits.
 * Shows decimals until 1000, then uses suffixes (k, million, billion, etc.) up to undecillion.
 * Removes trailing zeros for whole numbers.
 *
 * Examples:
 * - 0 -> "0"
 * - 1 -> "1"
 * - 1.5 -> "1.5"
 * - 12.5 -> "12.5"
 * - 123.4 -> "123.4"
 * - 999.9 -> "999.9"
 * - 1000 -> "1 k"
 * - 1234 -> "1.234 k"
 * - 1000000 -> "1 million"
 * - 1234567890 -> "1.234 billion"
 *
 * @param value - The Decimal value to format
 * @returns A formatted string with up to 4 digits and optional suffix
 */
export function formatDecimal(value: Decimal): string {
  // Handle zero as a special case
  if (value.eq(0)) return "0";
  
  // Handle negative values
  const isNegative = value.lt(0);
  const absValue = value.abs();
  
  // For values below 1000, show with decimals to make 4 digits total
  if (absValue.lt(1000)) {
    const num = absValue.toNumber();
    let formatted: string;
    
    // Check if it's a whole number
    if (num === Math.floor(num)) {
      formatted = num.toString();
    } else if (num < 10) {
      // 1 digit before decimal: X.XXX (e.g., "1.234")
      formatted = num.toFixed(3).replace(/\.?0+$/, '');
    } else if (num < 100) {
      // 2 digits before decimal: XX.XX (e.g., "12.34")
      formatted = num.toFixed(2).replace(/\.?0+$/, '');
    } else {
      // 3 digits before decimal: XXX.X (e.g., "123.4")
      formatted = num.toFixed(1).replace(/\.?0+$/, '');
    }
    
    return isNegative ? `-${formatted}` : formatted;
  }

  // Define suffixes for large numbers (thousands through undecillion)
  const suffixes = [
    { value: 1e36, name: "undecillion" },
    { value: 1e33, name: "decillion" },
    { value: 1e30, name: "nonillion" },
    { value: 1e27, name: "octillion" },
    { value: 1e24, name: "septillion" },
    { value: 1e21, name: "sextillion" },
    { value: 1e18, name: "quintillion" },
    { value: 1e15, name: "quadrillion" },
    { value: 1e12, name: "trillion" },
    { value: 1e9, name: "billion" },
    { value: 1e6, name: "million" },
    { value: 1e3, name: "k" }
  ];
  
  // Find the appropriate suffix
  for (const suffix of suffixes) {
    if (absValue.gte(suffix.value)) {
      const scaled = absValue.dividedBy(suffix.value).toNumber();
      let formatted: string;
      
      // Check if it's a whole number
      if (scaled === Math.floor(scaled)) {
        formatted = scaled.toString();
      } else if (scaled < 10) {
        // 1 digit before decimal: X.XXX
        formatted = scaled.toFixed(3).replace(/\.?0+$/, '');
      } else if (scaled < 100) {
        // 2 digits before decimal: XX.XX
        formatted = scaled.toFixed(2).replace(/\.?0+$/, '');
      } else {
        // 3 digits before decimal: XXX.X
        formatted = scaled.toFixed(1).replace(/\.?0+$/, '');
      }
      
      const sign = isNegative ? "-" : "";
      return `${sign}${formatted} ${suffix.name}`;
    }
  }
  
  // Fallback (should never reach here if value >= 1000)
  return isNegative ? `-${absValue.toNumber()}` : absValue.toNumber().toString();
}

/**
 * Legacy function for BigInt formatting (kept for backwards compatibility)
 * @deprecated Use formatDecimal instead
 */
export function formatBigInt(value: bigint): string {
  return formatDecimal(new Decimal(value.toString()));
}