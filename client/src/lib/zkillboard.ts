import { useCallback, useEffect, useMemo, useReducer } from "react";

const queue = new Set<number>();

type State = {
  [Id in number]: {
    killCount: number | null;
    lossCount: number | null;
    dangerRatio: number | null;
    gangRatio: number | null;
  };
};

type Data = {
  shipsDestroyed?: number;
  shipsLost?: number;
  dangerRatio?: number;
  gangRatio?: number;
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
    const interval = setInterval(() => {
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
              dangerRatio: data.dangerRatio ?? null,
              gangRatio: data.gangRatio ?? null,
            },
          };

          update(patch);
        })
        .catch((error) => {
          console.error(error);
        });
    }, 1000);

    return () => {
      clearInterval(interval);
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
