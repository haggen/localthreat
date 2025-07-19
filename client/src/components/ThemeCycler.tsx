import { useCallback, type MouseEvent } from "react";
import { useTheme } from "~/lib/theme";

export function ThemeCycler() {
  const theme = useTheme();

  const onClick = useCallback(
    (event: MouseEvent) => {
      theme.cycle(event.shiftKey);
    },
    [theme]
  );

  return (
    <button className="p-1.5" onClick={onClick}>
      <span
        aria-label="Cycle theme"
        className="block w-4 h-4 bg-accent rounded"
      />
    </button>
  );
}
