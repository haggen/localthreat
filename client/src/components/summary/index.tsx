import { Link } from "components/link";
import React from "react";
import { Entity } from "types";

type Props = {
  type: "corp" | "ally";
  data: Entity[];
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
  return `${length} ${title[length !== 1 ? 0 : 1]}`;
};

export const Summary = ({ type, data }: Props) => {
  return (
    <aside>
      <h1>{getTitle(type, data.length)}</h1>
      <ul>
        {data.map(({ id, name }) => (
          <li key={id}>
            <Link type={type} ids={[id]} name={name} />
          </li>
        ))}
      </ul>
    </aside>
  );
};
