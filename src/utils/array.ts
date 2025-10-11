/**
 * Array Utilities
 * Helper functions for array operations
 */

/**
 * Remove duplicates from array
 */
export const unique = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

/**
 * Group array by key
 */
export const groupBy = <T>(
  array: T[],
  key: keyof T
): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const group = String(item[key]);
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

/**
 * Sort array by key
 */
export const sortBy = <T>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Chunk array into smaller arrays
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Shuffle array
 */
export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Get random items from array
 */
export const sample = <T>(array: T[], count: number): T[] => {
  const shuffled = shuffle(array);
  return shuffled.slice(0, Math.min(count, array.length));
};

/**
 * Find item by property value
 */
export const findByProperty = <T>(
  array: T[],
  key: keyof T,
  value: any
): T | undefined => {
  return array.find(item => item[key] === value);
};

/**
 * Remove item from array
 */
export const remove = <T>(array: T[], item: T): T[] => {
  return array.filter(i => i !== item);
};

/**
 * Toggle item in array (add if not exists, remove if exists)
 */
export const toggle = <T>(array: T[], item: T): T[] => {
  return array.includes(item) ? remove(array, item) : [...array, item];
};

/**
 * Count occurrences in array
 */
export const countOccurrences = <T>(array: T[], item: T): number => {
  return array.filter(i => i === item).length;
};

/**
 * Get intersection of two arrays
 */
export const intersection = <T>(array1: T[], array2: T[]): T[] => {
  return array1.filter(item => array2.includes(item));
};

/**
 * Get difference between two arrays
 */
export const difference = <T>(array1: T[], array2: T[]): T[] => {
  return array1.filter(item => !array2.includes(item));
};

/**
 * Flatten nested array
 */
export const flatten = <T>(array: any[]): T[] => {
  return array.reduce(
    (flat, item) =>
      Array.isArray(item) ? flat.concat(flatten(item)) : flat.concat(item),
    []
  );
};

/**
 * Get sum of array values
 */
export const sum = (array: number[]): number => {
  return array.reduce((total, num) => total + num, 0);
};

/**
 * Get average of array values
 */
export const average = (array: number[]): number => {
  return array.length > 0 ? sum(array) / array.length : 0;
};

/**
 * Get min value from array
 */
export const min = (array: number[]): number => {
  return Math.min(...array);
};

/**
 * Get max value from array
 */
export const max = (array: number[]): number => {
  return Math.max(...array);
};
