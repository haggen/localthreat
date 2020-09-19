import { Summary } from "components/summary";
import { Table } from "components/table";
import { usePaste } from "hooks/use-paste";
import React, { Reducer, useCallback, useEffect, useReducer } from "react";
import { Action, PlayerData, EntityData } from "types";
import style from "./style.module.css";

type Props = {
  params: Record<string, string>;
};

type State = {
  chars: Record<string, PlayerData>;
  corps: Record<number, EntityData>;
  allys: Record<number, EntityData>;
};

const reducer = (state: State, action: Action) => {
  const { chars, corps, allys } = state;
  switch (action.type) {
    case "add":
      for (const i in action.data) {
        const name = action.data[i];
        if (name in chars) {
          continue;
        }
        chars[name] = { name };
      }
      return {
        chars: { ...chars },
        corps,
        allys,
      };
    case "update":
      const char = { ...chars[action.data.name], ...action.data };
      const corp = char.corpId
        ? { id: char.corpId, name: char.corpName }
        : null;
      const ally = char.allyId
        ? { id: char.allyId, name: char.allyName }
        : null;
      return {
        chars: { ...chars, [char.name]: char },
        corps: corp ? { ...corps, [corp.id]: corp } : corps,
        allys: ally ? { ...allys, [ally.id]: ally } : allys,
      };
    default:
      return state;
  }
};

export const Report = ({ params: { id } }: Props) => {
  const [data, dispatch] = useReducer<Reducer<State, Action>>(reducer, {
    chars: {},
    corps: {},
    allys: {},
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/v1/reports/${id}`)
      .then((resp) => {
        if (!resp.ok) {
          throw new Error(`Unhandled status ${resp.status}`);
        }
        return resp.json();
      })
      .then((report) => {
        dispatch({ type: "add", data: report.data });
      })
      .catch((err) => {
        throw err;
      });
  }, [id]);

  const paste = usePaste();

  useEffect(() => {
    if (paste) {
      fetch(`${process.env.REACT_APP_API_URL}/v1/reports/${id}`, {
        method: "PATCH",
        body: paste,
      })
        .then((resp) => {
          if (!resp.ok) {
            throw new Error(`Unhandled status ${resp.status}`);
          }
          return resp.json();
        })
        .then((report) => {
          dispatch({ type: "add", data: report.data });
        })
        .catch((err) => {
          throw err;
        });
    }
  }, [paste, id]);

  const update = useCallback(
    (data: PlayerData) => {
      dispatch({ type: "update", data });
    },
    [dispatch]
  );

  return (
    <div className={style.report}>
      <div className={style.summaries}>
        <Summary type="corp" data={Object.values(data.corps)} />
        <Summary type="ally" data={Object.values(data.allys)} />
      </div>
      <Table data={Object.values(data.chars)} update={update} />
    </div>
  );
};
