/** Given an object, */
export const removeUndefinedProperties = <T>(obj: T): T => {
  const handleValue = (value: any): any => {
    if (value === undefined) {
      // Skip undefined values entirely
      return undefined;
    } else if (Array.isArray(value)) {
      // Recursively apply to elements if value is an array
      return value.map(handleValue).filter((item) => item !== undefined); // Also filter out undefined items in arrays
    } else if (value !== null && typeof value === "object") {
      // Recursively apply to nested objects
      return removeUndefinedProperties(value);
    }
    return value;
  };

  if (Array.isArray(obj)) {
    // If the top-level object is an array, handle it appropriately
    // Make sure to filter out undefined after mapping
    return obj.map(handleValue).filter((item) => item !== undefined) as T;
  }

  return Object.entries(obj).reduce((acc, [key, value]) => {
    // Only add key-value pairs if value is not undefined
    if (value !== undefined) {
      const safeKey = key as keyof T;
      acc[safeKey] = handleValue(value);
    }
    return acc;
  }, {} as T); // Assert the accumulator as T for objects
};
