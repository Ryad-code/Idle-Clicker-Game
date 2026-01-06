/**
 * LocalStorage utility functions for managing game data persistence
 */

/**
 * Save data to localStorage
 * @param key - The key under which to store the data
 * @param value - The value to store (will be JSON stringified)
 * @returns Returns true if successful, false otherwise
 */
export const saveToLocalStorage = (key: string, value: unknown): boolean => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage (key: ${key}):`, error);
    return false;
  }
};

/**
 * Load data from localStorage
 * @param key - The key to retrieve
 * @param defaultValue - Default value to return if key doesn't exist
 * @returns The parsed value or defaultValue
 */
export const loadFromLocalStorage = <T = unknown>(key: string, defaultValue: T | null = null): T | null => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return defaultValue;
    }
    return JSON.parse(serializedValue);
  } catch (error) {
    console.error(`Error loading from localStorage (key: ${key}):`, error);
    return defaultValue;
  }
};

/**
 * Remove an item from localStorage
 * @param key - The key to remove
 * @returns Returns true if successful, false otherwise
 */
export const removeFromLocalStorage = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (key: ${key}):`, error);
    return false;
  }
};

/**
 * Clear all items from localStorage
 * @returns {boolean} - Returns true if successful, false otherwise
 */
export const clearLocalStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Check if a key exists in localStorage
 * @param key - The key to check
 * @returns Returns true if key exists, false otherwise
 */
export const hasKey = (key: string): boolean => {
  return localStorage.getItem(key) !== null;
};

/**
 * Get all keys from localStorage
 * @returns {string[]} - Array of all keys
 */
export const getAllKeys = () => {
  try {
    return Object.keys(localStorage);
  } catch (error) {
    console.error('Error getting localStorage keys:', error);
    return [];
  }
};

/**
 * Save multiple items to localStorage at once
 * @param items - Object with key-value pairs to save
 * @returns Returns true if all successful, false otherwise
 */
export const saveMultipleToLocalStorage = (items: Record<string, unknown>): boolean => {
  try {
    Object.entries(items).forEach(([key, value]) => {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    });
    return true;
  } catch (error) {
    console.error('Error saving multiple items to localStorage:', error);
    return false;
  }
};

/**
 * Load multiple items from localStorage at once
 * @param keys - Array of keys to retrieve
 * @param defaultValue - Default value for missing keys
 * @returns Object with key-value pairs
 */
export const loadMultipleFromLocalStorage = <T = unknown>(keys: string[], defaultValue: T | null = null): Record<string, T | null> => {
  try {
    const result: Record<string, T | null> = {};
    keys.forEach((key: string) => {
      const serializedValue = localStorage.getItem(key);
      result[key] = serializedValue !== null ? JSON.parse(serializedValue) : defaultValue;
    });
    return result;
  } catch (error) {
    console.error('Error loading multiple items from localStorage:', error);
    return {};
  }
};
