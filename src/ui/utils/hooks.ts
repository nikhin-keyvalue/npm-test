import { MutableRef, useEffect } from 'preact/hooks';

function useOnOutsideClick(ref: MutableRef<HTMLDivElement | null>, handler: (event) => void) {
  const listener = (event) => {
    // TODO: add types
    if (ref.current && !ref.current.contains(event.target)) handler(event);
  };

  document.addEventListener('mousedown', listener);
  document.addEventListener('touchstart', listener);

  return () => {
    document.removeEventListener('mousedown', listener);
    document.removeEventListener('touchstart', listener);
  };
}

function useVisibilityChange(serverFallback: (isVisible: boolean) => void) {
  useEffect(() => {
    const listener = () => {
      serverFallback(document.visibilityState === 'visible');
    };

    window.addEventListener('visibilitychange', listener);

    return () => {
      window.removeEventListener('visibilitychange', listener);
    };
  }, []);
}

export { useOnOutsideClick, useVisibilityChange };
