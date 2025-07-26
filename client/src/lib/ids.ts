import { useCallback, useEffect, useMemo, useReducer } from "react";

const queue = new Set<string>();
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
      const batch = Array.from(queue).slice(0, 499);
      for (const name of batch) {
        queue.delete(name);
      }

      const resp = await fetch("https://esi.evetech.net/latest/universe/ids/", {
        method: "POST",
        body: JSON.stringify(batch),
        headers: { "Content-Type": "application/json" },
      });

      if (!resp.ok) {
        throw resp;
      }

      const patch = createStatePatch(await resp.json());

      for (const name of batch) {
        if (name in patch.character) {
          continue;
        }
        if (name in patch.corporation) {
          continue;
        }
        if (name in patch.alliance) {
          continue;
        }
        banned.add(name);
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
      queue.add(name);
    },
    [state]
  );

  return useMemo(() => ({ state, query }), [state, query]);
}
