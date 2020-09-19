import React from "react";
import { Row } from "components/row";
import { PlayerData } from "types";
import { useSorting } from "hooks/use-sorting";
import style from "./style.module.css";

type Props = {
  data: PlayerData[];
  update: (data: PlayerData) => void;
};

export const Table = ({ data, update }: Props) => {
  const [compare, toggleSorting] = useSorting("shipsDestroyed");

  return (
    <table className={style.table}>
      <thead>
        <tr>
          <th>
            <button onClick={() => toggleSorting("name")}>Character</button>
          </th>
          <th>
            <button onClick={() => toggleSorting("corpName")}>
              Corporation
            </button>
          </th>
          <th>
            <button onClick={() => toggleSorting("allyName")}>Alliance</button>
          </th>
          <th>Ships</th>
          <th>
            <button
              onClick={() => toggleSorting("dangerRatio")}
              title="Danger level (0–100)"
            >
              D
            </button>
          </th>
          <th>
            <button
              onClick={() => toggleSorting("gangRatio")}
              title="Gang ratio (0–100)"
            >
              G
            </button>
          </th>
          <th>
            <button
              onClick={() => toggleSorting("shipsDestroyed")}
              title="Ships destroyed"
            >
              K
            </button>
          </th>
          <th>
            <button
              onClick={() => toggleSorting("shipsLost")}
              title="Ships lost"
            >
              L
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.sort(compare).map((player) => (
          <Row key={player.name} update={update} {...player} />
        ))}
      </tbody>
    </table>
  );
};
