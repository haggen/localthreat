import { Entity } from "components/entity";
import React from "react";
import { EntityData } from "types";
import style from "./style.module.css";

type Props = {
  type: "corp" | "ally";
  data: EntityData[];
};

const getTitle = (type: Props["type"], length: number) => {
  let title;
  switch (type) {
    case "corp":
      title = ["corporations", "corporation"];
      break;
    case "ally":
      title = ["alliances", "alliance"];
      break;
    default:
      throw new Error("Unrecognized summary type");
  }
  return [length, title[length !== 1 ? 0 : 1]] as const;
};

export const Summary = ({ type, data }: Props) => {
  const [total, title] = getTitle(type, data.length);
  return (
    <aside className={style.summary}>
      <h1>
        <span>{total}</span>
        {title}
      </h1>
      <ul>
        {data.map(({ id, name }) => (
          <li key={id}>
            <Entity type={type} ids={[id]} name={name} truncate />
          </li>
        ))}
      </ul>
    </aside>
  );
};
