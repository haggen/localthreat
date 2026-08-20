import { useCallback, useState } from "react";

export function useTruncated() {
  const [truncated, setTruncated] = useState(false);

  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) {
      return;
    }

    setTruncated(node.offsetWidth < node.scrollWidth);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setTruncated(
          entry.contentBoxSize[0].inlineSize < entry.target.scrollWidth,
        );
      }
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return { ref, truncated };
}
