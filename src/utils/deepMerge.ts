import { DeepPartial } from "ts-essentials";

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function deepMerge<T extends Record<string, any>>(
  base: T,
  ...sources: DeepPartial<T>[]
): T {
  let result = { ...base };

  for (const source of sources) {
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        const sourceValue = source[key];
        const resultValue = result[key];

        if (isObject(resultValue) && isObject(sourceValue)) {
          // If both the result and source values are objects, merge them recursively
          result[key] = deepMerge(
            { ...resultValue },
            sourceValue as DeepPartial<typeof resultValue>
          );
        } else {
          // Otherwise, directly assign the source value (including cases where it's undefined)
          result[key] = sourceValue as T[Extract<keyof DeepPartial<T>, string>];
        }
      }
    }
  }

  return result as T;
}
