import { DeepPartial } from "ts-essentials";
/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export declare function isObject(item: any): boolean;
/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export declare function deepMerge<T extends Record<string, any>>(base: T, ...sources: DeepPartial<T>[]): T;
