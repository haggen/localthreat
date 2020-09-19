import { useState } from "react";
import { CharacterData } from "types";

type Config = [string, -1 | 1];

const getComparison = ([key, direction]: Config): ((
  a: CharacterData,
  b: CharacterData
) => number) => {
  switch (key) {
    case "name":
    case "corpName":
    case "allyName":
      return (...players) => {
        const [a, b] = players.map((player) => player[key] ?? "");
        return a.localeCompare(b) * direction;
      };
    case "dangerRatio":
    case "gangRatio":
    case "shipsDestroyed":
    case "shipsLost":
      return (...players) => {
        const [a, b] = players.map((player) => player[key] || 0);
        return (a > b ? -1 : a < b ? 1 : 0) * direction;
      };
    default:
      throw new Error("Invalid sorting key");
  }
};

const defaultKey = "dangerRatio";
const defaultDirection = 1;

export const useSorting = () => {
  const [config, setConfig] = useState<Config>([defaultKey, defaultDirection]);

  const toggle = (key: string) => {
    setConfig(
      (config) =>
        [key, key === config[0] ? config[1] * -1 : defaultDirection] as Config
    );
  };

  return [getComparison(config), toggle] as const;
};
