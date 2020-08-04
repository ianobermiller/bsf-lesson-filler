import {useEffect, useRef} from 'react';

// https://usehooks.com/useOnClickOutside/
export function useOnClickOutside(
  ref: React.MutableRefObject<HTMLElement | null>,
  callback: (event: MouseEvent | TouchEvent) => void,
) {
  const savedCallback = useRef<(event: MouseEvent | TouchEvent) => void>(
    callback,
  );

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      if (
        !ref.current ||
        !(event.target instanceof HTMLElement) ||
        ref.current.contains(event.target)
      ) {
        return;
      }

      savedCallback.current(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref]);
}
