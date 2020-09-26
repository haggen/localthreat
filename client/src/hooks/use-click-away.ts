import { useEffect, useRef } from "react";

export const useClickAway = (callback: () => void) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as HTMLElement)) {
        callback();
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
    };
  }, [callback]);

  return ref;
};
