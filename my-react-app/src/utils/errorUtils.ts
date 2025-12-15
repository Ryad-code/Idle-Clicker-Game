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

/**
 * Convert technical errors to user-friendly messages
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes('auth')) return 'Authentication failed. Please log in again.';
    if (msg.includes('network')) return 'Network error. Check your connection.';
    if (msg.includes('database')) return 'Database error. Try again later.';
    if (msg.includes('not found')) return 'Data not found.';
  }
  return 'Something went wrong. Try again.';
}
