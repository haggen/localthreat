import { useCallback, useEffect, useMemo, useReducer } from "react";

const queue = new Set<number>();
const delay = 100;

type State = {
  [Id in number]: {
    killCount: number | null;
    lossCount: number | null;
    dangerRatio: number | null;
    gangRatio: number | null;
    ships: Array<{ id: number; name: string }> | null;
  };
};

type Data = {
  shipsDestroyed?: number;
  shipsLost?: number;
  dangerRatio?: number;
  gangRatio?: number;
  topLists?: Array<{
    type: string;
    values: Array<{ id: number; name: string }>;
  }>;
};

export function useZKillboard() {
  const [state, update] = useReducer(
    (state: State, patch: State) => ({
      ...state,
      ...patch,
    }),
    {}
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      const characterId = queue.values().next().value;

      if (!characterId) {
        return;
      }

      queue.delete(characterId);

      fetch(`https://zkillboard.com/api/stats/characterID/${characterId}/`)
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((data: Data) => {
          const patch: State = {
            [characterId]: {
              killCount: data.shipsDestroyed ?? null,
              lossCount: data.shipsLost ?? null,
              dangerRatio:
                typeof data.dangerRatio === "number"
                  ? data.dangerRatio / 100
                  : null,
              gangRatio:
                typeof data.gangRatio === "number"
                  ? data.gangRatio / 100
                  : null,
              ships:
                data.topLists
                  ?.find(({ type }) => type === "shipType")
                  ?.values.map(({ id, name }) => ({
                    id,
                    name,
                  })) ?? null,
            },
          };

          update(patch);
        })
        .catch((error) => {
          console.error(error);
        });
    }, delay);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const query = useCallback(
    (id: number) => {
      if (id in state) {
        return state[id];
      }
      queue.add(id);
    },
    [state]
  );

  return useMemo(() => ({ state, query }), [state, query]);
}
