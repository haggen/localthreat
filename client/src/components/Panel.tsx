import { type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export function Panel({
  title,
  id,
  side,
  children,
}: {
  side: "left" | "right";
  id: string;
  title: string;
  children?: ReactNode;
}) {
  const className =
    side === "left"
      ? "right-auto not-open:-translate-x-full"
      : "left-auto not-open:translate-x-full";

  return (
    <aside
      id={id}
      popover="auto"
      className={twMerge(
        "block fixed inset-0 z-20 w-md h-dvh p-1.5 bg-transparent transform transition-transform ease-in-out overflow-visible",
        className
      )}
    >
      <div className="grid grid-rows-[auto_1fr] h-full bg-foreground/5 rounded-lg text-foreground backdrop-blur-2xl shadow-2xl inset-ring inset-ring-foreground/5">
        <header className="flex items-center justify-between h-12 px-6">
          <h1 className="text-xl font-bold">{title}</h1>
          <button
            className="text-2xl font-bold p-1.5"
            aria-label="Close drawer"
            popoverTarget={id}
          >
            &times;
          </button>
        </header>

        {children}
      </div>
    </aside>
  );
}
