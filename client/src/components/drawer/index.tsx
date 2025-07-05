import React, { ReactNode, createContext, useContext, useState } from "react";
import c from "classnames";
import { useEscape } from "~/hooks/use-escape";

import style from "./style.module.css";

type State = {
  state: {
    [key: string]: boolean;
  };
  set: (name: string, value: boolean) => void;
};

export const Context = createContext<State>({
  state: {},
  set: () => {},
});

export const useDrawer = (name: string) => {
  const { state, set } = useContext(Context);
  const open = () => {
    set(name, true);
  };
  const close = () => {
    set(name, false);
  };
  return { state: state[name], open, close };
};

type DrawerProviderProps = {
  children: ReactNode;
};

export const Provider = ({ children }: DrawerProviderProps) => {
  const [state, setState] = useState<State["state"]>({});

  const set: State["set"] = (name, value) => {
    setState((state) =>
      state[name] === value ? state : { ...state, [name]: value }
    );
  };

  return <Context.Provider value={{ state, set }}>{children}</Context.Provider>;
};

type DrawerProps = {
  name: string;
  side: "left" | "right";
  title: ReactNode;
  children: ReactNode;
};

export const Drawer = ({ name, title, side, children }: DrawerProps) => {
  const { state, close } = useDrawer(name);

  useEscape(close);

  return (
    <aside
      className={c(style.drawer, style[side], {
        [style.active]: state,
      })}
    >
      <header className={style.header}>
        <h1>{title}</h1>
        <button onClick={() => close()}>×</button>
      </header>
      <div className={style.content}>
        {state === undefined ? null : children}
      </div>
    </aside>
  );
};
