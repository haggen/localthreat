import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { Drawer } from "~/components/drawer";
import { Link } from "wouter";

import style from "./style.module.css";

type Report = {
  id: string;
  time: string;
  data: string[];
};

type State = {
  history: Report[];
  push: (report: Report) => void;
};

const Context = createContext<State>({
  history: [],
  push: () => {},
});

type HistoryProviderProps = {
  children: ReactNode;
};

const reducer = (history: Report[], report: Report) => {
  if (history.some(({ id }) => id === report.id)) {
    return history;
  }
  return [report, ...history];
};

const storageKey = "history";

const getStoredHistory = () => {
  const item = localStorage.getItem(storageKey);
  return item ? JSON.parse(item) : [];
};

export const Provider = ({ children }: HistoryProviderProps) => {
  const [history, push] = useReducer(reducer, null, getStoredHistory);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(history));
  }, [history]);

  return (
    <Context.Provider value={{ history, push }}>{children}</Context.Provider>
  );
};

export const useHistory = () => useContext(Context);

type ItemProps = {
  report: Report;
};

const getExcerpt = (data: string[], limit: number) => {
  const excerpt = [];

  while (limit - excerpt.join("").length > 0 && excerpt.length < data.length) {
    excerpt.push(data[excerpt.length]);
  }

  const delta = data.length - excerpt.length;

  if (delta > 1) {
    return `${excerpt.join(", ")} and ${delta} others`;
  } else if (delta > 0) {
    return `${excerpt.join(", ")} and 1 other`;
  }
  return excerpt.join(", ");
};

const Item = ({ report }: ItemProps) => {
  const time = new Date(report.time);

  return (
    <li>
      <Link href={`/${report.id}`}>
        <a>
          <strong>
            {time.toLocaleDateString()} {time.toLocaleTimeString()}
          </strong>
          <small>{getExcerpt(report.data, 24)}</small>
        </a>
      </Link>
    </li>
  );
};

const compare = (a: Report, b: Report) => {
  return b.time.localeCompare(a.time);
};

export const History = () => {
  const { history } = useHistory();

  return (
    <Drawer name="history" title="History" side="right">
      <ul className={style.list}>
        {history.sort(compare).map((report, index) => (
          <Item key={index} report={report} />
        ))}
      </ul>
    </Drawer>
  );
};
