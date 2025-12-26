/**
 * Formats a BigInt for display with spaces and word suffixes.
 * Handles large numbers elegantly for better user experience.
 *
 * Examples:
 * - 1000n -> "1 k"
 * - 1255n -> "1.255 k"
 * - 1000000n -> "1 million"
 * - 1255000n -> "1.255 millions"
 * - 2000000n -> "2 millions"
 * - 1000000000n -> "1 billion"
 * - 2000000000n -> "2 billions"
 * - 1000000000000n -> "1 trillion"
 * - 1000000000000000n -> "1 quadrillion"
 * - 1000000000000000000n -> "1 quintillion"
 * - 1000000000000000000000n -> "1 sextillion"
 * - 1000000000000000000000000n -> "1 septillion"
 * - 1000000000000000000000000000n -> "1 octillion"
 * - 1000000000000000000000000000000n -> "1 nonillion"
 * - 1000000000000000000000000000000000n -> "1 decillion"
 * - 1000000000000000000000000000000000000n -> "1 undecillion"
 *
 * @param value - The BigInt value to format
 * @returns A formatted string with spaces and suffix
 */
export function formatBigInt(value: bigint): string {
  // Handle small numbers without suffix
  if (value < 1000n) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  // Define suffixes for scaling (starting from Thousand)
  const suffixes = ["", "k", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion", "decillion", "undecillion"];
  const decimalPlaces = 3;
  let num = value;
  let suffixIndex = 0;

  // Scale down by dividing by 1000 until we find the appropriate suffix
  while (num >= 1000n && suffixIndex < suffixes.length - 1) {
    num /= 1000n;
    suffixIndex++;
  }

  // Calculate whole and fraction parts
  const divisor = 1000n ** BigInt(suffixIndex);
  const whole = value / divisor;
  const remainder = value % divisor;
  const fractionDivisor = 10n ** BigInt(Math.max(0, suffixIndex * 3 - decimalPlaces));
  const fraction = remainder / fractionDivisor;

  // Format the number
  let formatted: string;
  if (fraction > 0n) {
    const fractionStr = fraction.toString().padStart(decimalPlaces, '0');
    formatted = `${whole}.${fractionStr}`;
  } else {
    formatted = whole.toString();
  }

  // Add spaces for thousands separator
  formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  // Determine suffix
  let suffix = suffixes[suffixIndex];
  if (suffixIndex > 1) {
    suffix += "s";
  }

  return `${formatted} ${suffix}`;
}