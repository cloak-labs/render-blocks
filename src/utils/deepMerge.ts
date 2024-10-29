// TODO: DELETE FILE
// import { DeepPartial } from "ts-essentials";

// /**
//  * Simple object check.
//  * @param item - The item to check
//  * @returns {boolean} True if the item is a non-null object (excluding arrays)
//  */
// export function isObject(item: unknown): item is Record<string, unknown> {
//   return item && typeof item === "object" && !Array.isArray(item);
// }

// /**
//  * Deep merge two or more objects.
//  * @param base - The base object to merge into
//  * @param sources - One or more objects to merge from
//  * @returns {T} The merged object
//  */
// export function deepMerge<T extends Record<string, unknown>>(
//   base: T,
//   ...sources: DeepPartial<T>[]
// ): T {
//   let result = { ...base };

//   for (const source of sources) {
//     for (const key in source) {
//       const sourceValue = source[key];
//       const resultValue = result[key];

//       if (isObject(resultValue) && isObject(sourceValue)) {
//         result[key] = deepMerge(
//           { ...resultValue },
//           sourceValue as DeepPartial<typeof resultValue>
//         );
//       } else {
//         result[key] = sourceValue as T[Extract<keyof DeepPartial<T>, string>];
//       }
//     }
//   }

//   return result as T;
// }
