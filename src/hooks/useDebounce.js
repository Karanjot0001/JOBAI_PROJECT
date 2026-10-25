import { useState, useEffect } from "react";

/**
 * Custom Hook: useDebounce
 * Syllabus Concept: Custom Hooks, useEffect, setTimeout & clearTimeout, Performance Optimization
 * Delays updating a value until a specified delay has passed without new inputs.
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
