import debounce from 'debounce';
import {useEffect, useMemo, useRef} from 'react';

type Debounced<TArgs extends unknown[]> = ((...args: TArgs) => void) & {
  clear(): void;
} & {
  flush(): void;
};

export default function useDebounced<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delay: number,
): Debounced<TArgs> {
  const callbackRef = useRef(callback);

  // Store the callback in a ref so the callback can change while debounce is
  // still pending.
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debounced = useMemo<Debounced<TArgs>>(
    () => debounce((...args) => callbackRef.current(...args), delay),
    [delay],
  );

  // Don't call the debounced callback after unmounting
  useEffect(() => debounced.clear, [debounced]);

  return debounced;
}
