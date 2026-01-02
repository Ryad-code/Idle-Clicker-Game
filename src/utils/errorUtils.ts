/**
 * Simple error utilities for consistent error handling across the app
 */

/**
 * Log error with context for debugging
 */
export function logError(context: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[${context}] ${message}`);
}
