import { useCallback, useEffect, useMemo, useReducer } from "react";

const queue = new Set<number>();
const delay = 100;

type State = {
  character: Record<number, string>;
  corporation: Record<number, string>;
  faction: Record<number, string>;
  alliance: Record<number, string>;
};

function reducer(state: State, patch: Partial<State>) {
  return {
    character: { ...state.character, ...patch.character },
    corporation: { ...state.corporation, ...patch.corporation },
    faction: { ...state.faction, ...patch.faction },
    alliance: { ...state.alliance, ...patch.alliance },
  };
}

const initialState: State = {
  character: {},
  corporation: {},
  faction: {},
  alliance: {},
};

function createStatePatch(
  data: Array<{
    category: "character" | "corporation" | "alliance" | "faction";
    id: number;
    name: string;
  }>
) {
  const state: State = {
    character: {},
    corporation: {},
    faction: {},
    alliance: {},
  };

  for (const entry of data) {
    state[entry.category][entry.id] = entry.name;
  }

  return state;
}

export function useNames() {
  const [state, update] = useReducer(reducer, initialState);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (queue.size === 0) {
        return;
      }

      // The API allows a maximum of 1000 IDs per request.
      const batch = Array.from(queue).slice(0, 999);
      for (const id of batch) {
        queue.delete(id);
      }

      const resp = await fetch(
        "https://esi.evetech.net/latest/universe/names/",
        {
          method: "POST",
          body: JSON.stringify(batch),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!resp.ok) {
        throw resp;
      }

      const patch = createStatePatch(await resp.json());
      update(patch);
    }, delay);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const query = useCallback(
    (type: keyof State, id: number) => {
      if (id in state[type]) {
        return state[type][id];
      }
      queue.add(id);
    },
    [state]
  );

  return useMemo(() => ({ state, query }), [state, query]);
}
