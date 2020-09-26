import React, { ReactNode } from "react";

import style from "./style.module.css";

type Props = {
  title: string;
  date?: Date;
  children: ReactNode;
};

export const Article = ({ title, date, children }: Props) => {
  return (
    <article className={style.article}>
      <header>
        <h1>{title}</h1>
        {date ? <small>{date.toLocaleDateString()}</small> : null}
      </header>
      {children}
    </article>
  );
};
