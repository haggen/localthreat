import { autoUpdate, flip, offset, useFloating } from "@floating-ui/react-dom";
import { useCallback, useMemo, useReducer } from "react";

function reducer(state: boolean, patch?: boolean) {
  return patch ?? !state;
}

export function useTooltip() {
  const [state, set] = useReducer(reducer, false);

  const floating = useFloating({
    open: state,
    middleware: [flip({ fallbackAxisSideDirection: "start" }), offset(4)],
    whileElementsMounted: autoUpdate,
  });

  const open = useCallback(() => {
    set(true);
    floating.refs.floating.current?.showPopover();
  }, [floating.refs.floating]);

  const close = useCallback(() => {
    set(false);
    floating.refs.floating.current?.hidePopover();
  }, [floating.refs.floating]);

  return useMemo(
    () => ({ ...floating, state, open, close }),
    [floating, state, open, close]
  );
}
