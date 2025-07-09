import { type ReactNode } from "react";

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
      className={`block bg-transparent p-1.5 w-md fixed inset-0 h-full transform transition-transform ease-in-out ${className}`}
      popover="auto"
      id={id}
    >
      <div className="grid grid-rows-[auto_1fr] h-full rounded-lg bg-foreground/5 text-foreground backdrop-blur-2xl shadow-2xl">
        <header className="flex items-center justify-between px-6 h-18">
          <h1 className="font-bold text-xl">{title}</h1>
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
