import React from "react";
import { Row } from "components/row";
import { Character } from "types";
import { useSorting } from "./sorting";

type Props = {
  data: Character[];
  update: (data: Character) => void;
};

export const Table = ({ data, update }: Props) => {
  const [compare, toggleSorting] = useSorting();

  return (
    <table>
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
            <button onClick={() => toggleSorting("dangerRatio")}>D</button>
          </th>
          <th>
            <button onClick={() => toggleSorting("gangRatio")}>G</button>
          </th>
          <th>
            <button onClick={() => toggleSorting("shipsDestroyed")}>K</button>
          </th>
          <th>
            <button onClick={() => toggleSorting("shipsLost")}>L</button>
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
