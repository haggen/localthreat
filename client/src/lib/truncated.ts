import { useCallback, useLayoutEffect, useState } from "react";

export function useTruncated() {
  const [element, setElement] = useState<HTMLElement>();
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    if (!element) {
      return;
    }

    setTruncated(element.offsetWidth < element.scrollWidth);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setTruncated(
          entry.contentBoxSize[0].inlineSize < entry.target.scrollWidth
        );
      }
    });
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element]);

  const ref = useCallback((node: HTMLElement | null) => {
    if (node) {
      setElement(node);
    }
  }, []);

  return { ref, truncated };
}
