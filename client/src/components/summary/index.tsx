import { Entity } from "~/components/entity";
import type { EntityData } from "~/lib/types";
import style from "./style.module.css";

type Props = {
  type: "corp" | "ally";
  data: EntityData[];
};

const titles = {
  corp: "Corporations",
  ally: "Alliances",
};

export const Summary = ({ type, data }: Props) => {
  return (
    <aside className={style.summary}>
      <h1>{titles[type]}</h1>
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
