export const fmt = {
  number(n: number, opts: Intl.NumberFormatOptions = {}) {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      maximumFractionDigits: 2,
      ...opts,
    }).format(n);
  },

  datetime(
    value: Date | string | number,
    opts: Intl.DateTimeFormatOptions = {}
  ) {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      ...opts,
    }).format(new Date(value));
  },
};
