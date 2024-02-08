export function isJsonSerializable(obj, visited = new Set()) {
    // Avoid circular reference
    if (visited.has(obj))
        return false;
    visited.add(obj);
    // Base JSON serializable types
    if (obj === null || ["string", "number", "boolean"].includes(typeof obj))
        return true;
    // Arrays: Check if every element is serializable
    if (Array.isArray(obj)) {
        return obj.every((item) => isJsonSerializable(item, visited));
    }
    // Objects: Check if every value is serializable
    if (typeof obj === "object") {
        return Object.values(obj).every((value) => isJsonSerializable(value, visited));
    }
    // Not a serializable type (e.g., function, symbol, undefined)
    return false;
}
