import React, { useEffect, useCallback, useReducer, Reducer } from "react";
import { useRoute, useLocation } from "wouter";
import { nanoid } from "nanoid";
import { usePaste } from "hooks/use-paste";
import { Character, Action, Entity } from "types";
import { Table } from "components/table";
import { Summary } from "components/summary";

type State = {
  chars: Record<string, Character>;
  corps: Record<number, Entity>;
  allys: Record<number, Entity>;
};

const reducer = (state: State, action: Action) => {
  const { chars, corps, allys } = state;
  switch (action.type) {
    case "add":
      if (action.data.name in chars) {
        return state;
      }
      return {
        chars: { ...chars, [action.data.name]: action.data },
        corps,
        allys,
      };
    case "update":
      const char = { ...chars[action.data.name], ...action.data };
      const corp =
        char.corpId && char.corpName
          ? { id: char.corpId, name: char.corpName }
          : null;
      const ally =
        char.allyId && char.allyName
          ? { id: char.allyId, name: char.allyName }
          : null;
      return {
        chars: { ...chars, [char.name]: char },
        corps:
          corp && !(corp.id in corps) ? { ...corps, [corp.id]: corp } : corps,
        allys:
          ally && !(ally.id in allys) ? { ...allys, [ally.id]: ally } : allys,
      };
    default:
      return state;
  }
};

export const App = () => {
  const [match] = useRoute("/:id");
  const [, setLocation] = useLocation();
  const paste = usePaste();

  const [data, dispatch] = useReducer<Reducer<State, Action>>(reducer, {
    chars: {},
    corps: {},
    allys: {},
  });

  useEffect(() => {
    if (!match) {
      setLocation(`/${nanoid(8)}`);
    }
  }, [match, setLocation]);

  useEffect(() => {
    if (paste) {
      paste
        .split(/[\n\r]+/)
        .filter(Boolean)
        .map((name) => ({ name }))
        .forEach((data) => dispatch({ type: "add", data }));
    }
  }, [paste, dispatch]);

  const update = useCallback(
    (data: Character) => {
      dispatch({ type: "update", data });
    },
    [dispatch]
  );

  return (
    <>
      <Summary type="corp" data={Object.values(data.corps)} />
      <Summary type="ally" data={Object.values(data.allys)} />
      <Table data={Object.values(data.chars)} update={update} />
    </>
  );
};
