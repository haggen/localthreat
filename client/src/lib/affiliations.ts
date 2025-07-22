import { useCallback, useEffect, useMemo, useReducer } from "react";

const queue = new Set<number>();
const delay = 100;

type State = {
  [Id in number]: {
    corporationId?: number;
    factionId?: number | null;
    allianceId?: number | null;
  };
};

export function useAffiliations() {
  const [state, update] = useReducer(
    (state: State, patch: State) => ({ ...state, ...patch }),
    {}
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (queue.size === 0) {
        return;
      }

      const batch = Array.from(queue);
      queue.clear();

      fetch("https://esi.evetech.net/latest/characters/affiliation/", {
        method: "POST",
        body: JSON.stringify(batch),
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
              character_id: number;
              corporation_id?: number;
              faction_id?: number;
              alliance_id?: number;
            }>
          ) => {
            const patch = Object.fromEntries(
              data.map((data) => [
                data.character_id,
                {
                  corporationId: data.corporation_id,
                  factionId: data.faction_id ?? null,
                  allianceId: data.alliance_id ?? null,
                },
              ])
            );

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
    (type: "corporation" | "alliance" | "faction", id: number) => {
      if (id in state) {
        return state[id][`${type}Id`];
      }
      queue.add(id);
    },
    [state]
  );

  return useMemo(() => ({ state, query }), [state, query]);
}
