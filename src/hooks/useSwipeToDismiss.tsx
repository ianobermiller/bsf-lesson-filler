import React, {useRef} from 'react';

type TouchState = {
  startTime: number;
  startX: number;
  startY: number;
};

export default function useSwipeToDismiss(onSwipeClose: () => void) {
  const ref = useRef<HTMLDivElement | null>(null);
  const touchStateRef = useRef<TouchState>({
    startTime: 0,
    startX: 0,
    startY: 0,
  });

  function onTouchStart(evt: React.TouchEvent<HTMLDivElement>) {
    const touch = evt.changedTouches[0];
    touchStateRef.current.startX = touch.pageX;
    touchStateRef.current.startY = touch.pageY;
    touchStateRef.current.startTime = Date.now();
  }

  function onTouchMove(evt: React.TouchEvent<HTMLDivElement>) {
    const root = ref.current;
    if (!root) {
      return;
    }

    const touch = evt.changedTouches[0];
    const delta = touch.pageX - touchStateRef.current.startX;
    root.style.transform = `translateX(${delta}px)`;
    root.style.transition = 'none';
  }

  function onTouchEnd(evt: React.TouchEvent<HTMLDivElement>) {
    const root = ref.current;
    if (!root) {
      return;
    }
    const touch = evt.changedTouches[0];
    const deltaX = touch.pageX - touchStateRef.current.startX;
    const deltaY = touch.pageY - touchStateRef.current.startY;
    const deltaTime = Date.now() - touchStateRef.current.startTime;

    // We want a primarily horizontal drag
    if (deltaX > deltaY) {
      // Then check for a drag more than halfway across or a quick drag with a minimum distance
      if (deltaX > window.innerWidth / 2 || (deltaX > 60 && deltaTime < 500)) {
        onSwipeClose();
      }
    }

    touchStateRef.current.startX = 0;
    touchStateRef.current.startTime = 0;
    root.style.transform = '';
    root.style.transition = '';
  }

  function onTouchCancel(evt: React.TouchEvent<HTMLDivElement>) {
    const root = ref.current;
    if (!root) {
      return;
    }
    touchStateRef.current.startX = 0;
    touchStateRef.current.startTime = 0;
    root.style.transform = '';
    root.style.transition = '';
  }

  return {onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, ref};
}
