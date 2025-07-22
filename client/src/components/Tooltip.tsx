import { type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { useTooltip } from "~/lib/tooltip";

export function Tooltip({
  context,
  children,
}: {
  context: ReturnType<typeof useTooltip>;
  children: ReactNode;
}) {
  return createPortal(
    <div
      ref={context.refs.setFloating}
      style={context.floatingStyles}
      className="bg-accent/50 backdrop-blur-lg shadow-lg text-foreground rounded-full px-3 py-0.5 max-w-sm opacity-0 starting:opacity-100 open:opacity-100 open:starting:opacity-0 transition-opacity transition-discrete ease-in-out"
      popover="auto"
    >
      {children}
    </div>,
    document.body
  );
}
