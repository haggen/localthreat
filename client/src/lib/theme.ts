import { useCallback, useEffect, useMemo, type MouseEvent } from "react";

const initial = "seo";
const available = ["seo", "gallente", "minmatar", "amarr", "caldari"];

export function useTheme() {
  const set = useCallback((theme: string) => {
    const element = document.querySelector("html");
    if (!element) {
      throw new Error("HTML element not found");
    }
    element.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, []);

  const cycle = useCallback(
    (event: MouseEvent) => {
      const element = document.querySelector("html");
      if (!element) {
        throw new Error("HTML element not found");
      }
      const theme = element.dataset.theme ?? initial;
      const index = available.indexOf(theme);
      const offset = event.shiftKey ? -1 : 1;
      set(available[(index + offset + available.length) % available.length]);
    },
    [set]
  );

  useEffect(() => {
    const theme = localStorage.getItem("theme") ?? initial;
    const element = document.querySelector("html");
    if (!element) {
      throw new Error("HTML element not found");
    }
    set(theme);
  }, [set]);

  return useMemo(() => {
    return {
      set,
      cycle,
    };
  }, [set, cycle]);
}
