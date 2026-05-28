import { useState, useEffect, useRef } from 'react';

// Used for debouncing state values (e.g., search text)
export function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Used for debouncing function calls
export function useDebounce() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debounce = (func: Function, delay: number) => {
    return (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  return { debounce };
}
