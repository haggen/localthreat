export type EntityData = {
  id: number;
  name: string;
};

export type CharacterData = {
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
  data: CharacterData;
};
