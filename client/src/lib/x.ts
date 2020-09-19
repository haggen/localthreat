import { createContext } from "react";
import { Character } from "types";

type Props = {
  data: Character[];
  update: (data: Character) => void;
};

export const Data = createContext<Props>({ data: [], update(_) {} });
