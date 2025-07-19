import { useReducer } from "react";

export const Ascending = 1;
export const Descending = -1;

export type Direction = typeof Ascending | typeof Descending;

type State<T> = { [K in keyof T]?: Direction };

function createReducer<T>() {
  return (state: State<T>, key: State<T> | keyof T) => {
    if (typeof key === "object") {
      return key;
    }

    if (state[key] === Ascending) {
      return { [key]: Descending } as State<T>;
    }

    if (state[key] === Descending) {
      return { [key]: Ascending } as State<T>;
    }

    return { [key]: Descending } as State<T>;
  };
}

export function useSorting<T>(
  comparers: { [K in keyof T]: (a: T[K], b: T[K]) => number },
  initial: State<T> = {}
) {
  const [current, set] = useReducer(createReducer<T>(), initial);

  const sorter = (a: T, b: T) => {
    for (const key in current) {
      const direction = current[key];
      if (direction) {
        const compare = comparers[key as keyof T];
        if (compare) {
          return compare(a[key as keyof T], b[key as keyof T]) * direction;
        }
      }
    }
    return 0;
  };

  return { current, sorter, set };
}
