import { useCallback, useEffect, useReducer } from "react";
import { useHistory } from "~/components/history";
import { Summary } from "~/components/summary";
import { Table } from "~/components/table";
import { usePaste } from "~/hooks/use-paste";
import { clear as clearStatsRequests } from "~/lib/fetch-stats";
import type { EntityData, PlayerData } from "~/lib/types";
import style from "./style.module.css";

type Props = {
  params: Record<string, string>;
};

type State = {
  chars: Record<string, PlayerData>;
  corps: Record<number, EntityData>;
  allys: Record<number, EntityData>;
};

type Action =
  | {
      type: "add" | "reset";
      data: string[];
    }
  | {
      type: "update";
      data: PlayerData;
    };

const getInitialState = () => {
  return {
    chars: {},
    corps: {},
    allys: {},
  };
};

const reducer = (state: State, action: Action): State => {
  const { chars, corps, allys } = state;
  switch (action.type) {
    case "reset":
      return reducer(getInitialState(), { ...action, type: "add" });
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
  const [state, dispatch] = useReducer(reducer, null, getInitialState);

  const { push } = useHistory();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/v1/reports/${id}`)
      .then((resp) => {
        if (!resp.ok) {
          throw new Error(`Unhandled status ${resp.status}`);
        }
        return resp.json();
      })
      .then((report) => {
        dispatch({ type: "reset", data: report.data });
        push({
          id: report.id,
          time: report.time,
          data: report.data,
        });
      })
      .catch((err) => {
        throw err;
      });
  }, [id, push]);

  const paste = usePaste();

  useEffect(() => {
    if (paste) {
      fetch(`${import.meta.env.VITE_API_URL}/v1/reports/${id}`, {
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

  useEffect(
    () => () => {
      clearStatsRequests();
    },
    []
  );

  const update = useCallback(
    (data: PlayerData) => {
      dispatch({ type: "update", data });
    },
    [dispatch]
  );

  return (
    <div className={style.report}>
      <div className={style.summaries}>
        <Summary type="corp" data={Object.values(state.corps)} />
        <Summary type="ally" data={Object.values(state.allys)} />
      </div>
      <Table data={Object.values(state.chars)} update={update} />
    </div>
  );
};
