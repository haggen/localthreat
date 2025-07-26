import { fmt } from "~/lib/fmt";

export function Stat({
  value,
  style,
}: {
  value: number | null | undefined;
  style?: Intl.NumberFormatOptions["style"];
}) {
  if (value === null) {
    return "-";
  }

  if (value === undefined) {
    return "⋯";
  }

  return <span className={`font-mono`}>{fmt.number(value, { style })}</span>;
}
