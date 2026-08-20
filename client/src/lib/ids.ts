import { useCallback, useEffect, useMemo, useReducer } from "react";

// Keyed by name, value is the type it was queried as:
// a name that resolves under a different type must be banned for that query.
const queue = new Map<string, keyof State>();
const delay = 100;

// An invalid name may be added to the queue,
// in which case no corresponding ID will be
// returned from the API. We mark it as banned
// so it can't be added back to the queue.
const banned = new Set<string>();

type State = {
  character: Record<string, number>;
  corporation: Record<string, number>;
  alliance: Record<string, number>;
};

function reducer(state: State, patch: State) {
  return {
    character: { ...state.character, ...patch.character },
    corporation: { ...state.corporation, ...patch.corporation },
    alliance: { ...state.alliance, ...patch.alliance },
  };
}

const initialState: State = {
  character: {},
  corporation: {},
  alliance: {},
};

function createStatePatch(data: {
  [Key in "characters" | "corporations" | "alliances"]: Array<{
    id: number;
    name: string;
  }>;
}) {
  const state: State = {
    character: {},
    corporation: {},
    alliance: {},
  };

  for (const entry of data.characters ?? []) {
    state.character[entry.name] = entry.id;
  }

  for (const entry of data.corporations ?? []) {
    state.corporation[entry.name] = entry.id;
  }

  for (const entry of data.alliances ?? []) {
    state.alliance[entry.name] = entry.id;
  }

  return state;
}

export function useIds() {
  const [state, update] = useReducer(reducer, initialState);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (queue.size === 0) {
        return;
      }

      // The API allows a maximum of 500 names per request.
      const batch = Array.from(queue.entries()).slice(0, 499);
      for (const [name] of batch) {
        queue.delete(name);
      }

      const resp = await fetch("https://esi.evetech.net/latest/universe/ids/", {
        method: "POST",
        body: JSON.stringify(batch.map(([name]) => name)),
        headers: { "Content-Type": "application/json" },
      });

      if (!resp.ok) {
        throw resp;
      }

      const patch = createStatePatch(await resp.json());

      for (const [name, type] of batch) {
        if (!(name in patch[type])) {
          banned.add(name);
        }
      }

      update(patch);
    }, delay);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const query = useCallback(
    (type: keyof State, name: string) => {
      if (name in state[type]) {
        return state[type][name];
      }
      if (banned.has(name)) {
        return undefined;
      }
      queue.set(name, type);
    },
    [state],
  );

  return useMemo(() => ({ state, query }), [state, query]);
}
