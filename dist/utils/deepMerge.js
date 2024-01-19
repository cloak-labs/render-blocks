"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepMerge = exports.isObject = void 0;
/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
function isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
}
exports.isObject = isObject;
/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
function deepMerge(base, ...sources) {
    let result = { ...base };
    for (const source of sources) {
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                const sourceValue = source[key];
                const resultValue = result[key];
                if (isObject(resultValue) && isObject(sourceValue)) {
                    // If both the result and source values are objects, merge them recursively
                    result[key] = deepMerge({ ...resultValue }, sourceValue);
                }
                else {
                    // Otherwise, directly assign the source value (including cases where it's undefined)
                    result[key] = sourceValue;
                }
            }
        }
    }
    return result;
}
exports.deepMerge = deepMerge;
