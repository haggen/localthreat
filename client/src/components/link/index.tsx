import React from "react";
import style from "./index.module.css";

type Type = "char" | "corp" | "ally" | "ship";

type Props = {
  type: Type;
  ids: (number | undefined)[];
  name?: string;
  truncate?: boolean;
};

const baseKillboardUrl = "https://zkillboard.com";
const baseImageSrc = "https://images.evetech.net";

const getEntityUrl = (type: Type, ids: Props["ids"]) => {
  if (!ids[0]) {
    return "";
  }
  switch (type) {
    case "char":
      return `${baseKillboardUrl}/character/${ids[0]}/`;
    case "corp":
      return `${baseKillboardUrl}/corporation/${ids[0]}/`;
    case "ally":
      return `${baseKillboardUrl}/alliance/${ids[0]}/`;
    case "ship":
      return `${baseKillboardUrl}/character/${ids[1]}/shipTypeID/${ids[0]}/`;
    default:
      throw new Error("Unrecognized entity type");
  }
};

const getImageSrc = (type: Type, ids: Props["ids"]) => {
  switch (type) {
    case "char":
      return `${baseImageSrc}/characters/${ids[0]}/portrait?size=32`;
    case "corp":
      return `${baseImageSrc}/corporations/${ids[0]}/logo?size=32`;
    case "ally":
      return `${baseImageSrc}/alliances/${ids[0]}/logo?size=32`;
    case "ship":
      return `${baseImageSrc}/types/${ids[0]}/render?size=32`;
    default:
      throw new Error("Unrecognized entity type");
  }
};

export const Link = ({ type, name, ids, truncate }: Props) => {
  if (!ids.every(Boolean)) {
    return null;
  }
  return (
    <a
      className={style.link}
      href={getEntityUrl(type, ids)}
      target="blank"
      rel="noopener noreferrer"
    >
      <img
        src={getImageSrc(type, ids)}
        width="32"
        height="32"
        alt={name ?? "…"}
        title={name ?? "…"}
      />
      {truncate ? null : <span>{name ?? "…"}</span>}
    </a>
  );
};
