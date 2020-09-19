export type Entity = {
  id: number;
  name: string;
};

export type Character = {
  name: string;
  id?: number;
  corpId?: number;
  corpName?: string;
  allyId?: number;
  allyName?: string;
  dangerRatio?: number;
  gangRatio?: number;
  shipsDestroyed?: number;
  shipsLost?: number;
  ships?: {
    id: number;
    name: string;
  }[];
};

export type Action = {
  type: "add" | "update";
  data: Character;
};
