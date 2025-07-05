import { autoUpdate, FloatingPortal, useFloating } from "@floating-ui/react";
import c from "classnames";
import { useMemo, useState, type ReactNode } from "react";
import style from "./style.module.css";

export function useTooltip() {
  const [open, setOpen] = useState(false);

  const floating = useFloating({
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
  });

  return useMemo(
    () => ({
      open,
      setOpen,
      floating,
    }),
    [open, floating]
  );
}

type Props = {
  tooltip: any;
  children: ReactNode;
};

export const Tooltip = ({ tooltip, children }: Props) => {
  return (
    <FloatingPortal>
      <div
        ref={tooltip.floating.refs.setFloating}
        className={c(style.tooltip, { [style.open]: tooltip.open })}
        style={tooltip.floating.floatingStyles}
      >
        {children}
      </div>
    </FloatingPortal>
  );
};
