import { useCallback, useEffect, useMemo, useReducer } from "react";

const queue = new Set<string>();
const delay = 100;

type State = {
  character: Record<string, number>;
  corporation: Record<string, number>;
  alliance: Record<string, number>;
};

export function useIds() {
  const [state, update] = useReducer(
    (state: State, patch: State) => ({
      character: { ...state.character, ...patch.character },
      corporation: { ...state.corporation, ...patch.corporation },
      alliance: { ...state.alliance, ...patch.alliance },
    }),
    {
      character: {},
      corporation: {},
      alliance: {},
    }
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (queue.size === 0) {
        return;
      }

      const batch = Array.from(queue);
      queue.clear();

      fetch("https://esi.evetech.net/latest/universe/ids/", {
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
          (data: {
            [Key in "characters" | "corporations" | "alliances"]: Array<{
              id: number;
              name: string;
            }>;
          }) => {
            const patch: State = {
              character: {},
              corporation: {},
              alliance: {},
            };

            for (const entry of data.characters ?? []) {
              patch.character[entry.name] = entry.id;
            }

            for (const entry of data.corporations ?? []) {
              patch.corporation[entry.name] = entry.id;
            }

            for (const entry of data.alliances ?? []) {
              patch.alliance[entry.name] = entry.id;
            }

            update(patch);
          }
        )
        .catch((error) => {
          console.error(error);
        });
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
