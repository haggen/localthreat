import { useCallback, useEffect, useMemo, useReducer } from "react";

const queue = new Set<number>();

type State = {
  character: Record<number, string>;
  corporation: Record<number, string>;
  faction: Record<number, string>;
  alliance: Record<number, string>;
};

export function useNames() {
  const [state, update] = useReducer(
    (state: State, patch: Partial<State>) => ({
      character: { ...state.character, ...patch.character },
      corporation: { ...state.corporation, ...patch.corporation },
      faction: { ...state.faction, ...patch.faction },
      alliance: { ...state.alliance, ...patch.alliance },
    }),
    {
      character: {},
      corporation: {},
      faction: {},
      alliance: {},
    }
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (queue.size === 0) {
        return;
      }

      const batch = Array.from(queue);
      queue.clear();

      fetch("https://esi.evetech.net/latest/universe/names/", {
        method: "POST",
        body: JSON.stringify(batch),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then(
          (
            data: Array<{
              category: "character" | "corporation" | "alliance";
              id: number;
              name: string;
            }>
          ) => {
            const patch: State = {
              character: {},
              corporation: {},
              faction: {},
              alliance: {},
            };

            for (const entry of data) {
              patch[entry.category][entry.id] = entry.name;
            }

            update(patch);
          }
        )
        .catch((error) => {
          console.error(error);
        });
    }, 1000);

    return () => {
      clearInterval(interval);
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
