import { useCallback, useEffect, useMemo, useState } from "react";

const storageKey = "theme";
const attribute = "data-theme";
const initial = "seo";
const available = ["seo", "gallente", "minmatar", "caldari", "amarr"];

export function useTheme() {
  const [theme, setTheme] = useState(
    localStorage.getItem(storageKey) ?? initial
  );

  const cycle = useCallback(
    (reverse: boolean) => {
      const index = available.indexOf(theme);
      const offset = reverse ? -1 : 1;
      setTheme(
        available[(available.length + index + offset) % available.length]
      );
    },
    [theme]
  );

  useEffect(() => {
    const element = document.querySelector("html");
    if (!element) {
      throw new Error("HTML element not found");
    }
    element.setAttribute(attribute, theme);
    localStorage.setItem(storageKey, theme);
  }, [theme]);

  return useMemo(() => {
    return { theme, set: setTheme, cycle, available };
  }, [theme, cycle]);
}
