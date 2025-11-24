import { useRef, useEffect } from 'react';

type DebounceFunction<T extends (...args: any[]) => void> = (
  func: T,
  wait: number,
) => (...args: Parameters<T>) => void;

export const useDebounce = () => {
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const debounce: DebounceFunction<(...args: any[]) => void> = (func, wait) => {
    return (...args: any[]) => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      timeout.current = setTimeout(() => func(...args), wait);
    };
  };

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  return { debounce };
};
