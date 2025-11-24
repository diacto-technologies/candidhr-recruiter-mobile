import { useState } from 'react';

type ThrottleFunction<T extends (...args: any[]) => void> = (
  func: T,
  delay: number,
) => (...args: Parameters<T>) => void;

const useThrottle = () => {
  const [timeout, setTimeoutState] = useState<NodeJS.Timeout | null>(null);

  const throttle: ThrottleFunction<(...args: any[]) => void> = (func, delay) => {
    return (...args: any[]) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      const newTimeout = setTimeout(() => {
        func(...args);
        if (newTimeout === timeout) {
          setTimeoutState(null);
        }
      }, delay);

      setTimeoutState(newTimeout);
    };
  };

  return { throttle };
};

export default useThrottle;
