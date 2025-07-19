const baseUrl = "https://zkillboard.com";
const baseImageSrc = "https://images.evetech.net";

const getUrl = (type: string, id: number, characterId?: number) => {
  switch (type) {
    case "character":
      return `${baseUrl}/character/${id}/`;
    case "faction":
    case "corporation":
      return `${baseUrl}/corporation/${id}/`;
    case "alliance":
      return `${baseUrl}/alliance/${id}/`;
    case "ship":
      return `${baseUrl}/character/${characterId}/shipTypeID/${id}/`;
    default:
      throw new Error("Unknown entity type");
  }
};

const getImageSrc = (type: string, id: number) => {
  switch (type) {
    case "character":
      return `${baseImageSrc}/characters/${id}/portrait?size=64`;
    case "faction":
    case "corporation":
      return `${baseImageSrc}/corporations/${id}/logo?size=64`;
    case "alliance":
      return `${baseImageSrc}/alliances/${id}/logo?size=64`;
    case "ship":
      return `${baseImageSrc}/types/${id}/render?size=64`;
    default:
      throw new Error("Unknown entity type");
  }
};

export function Entity({
  type,
  id,
  characterId,
  name,
  collapsed,
}: {
  type: "character" | "faction" | "corporation" | "alliance" | "ship";
  id: number;
  characterId?: number;
  name: string;
  collapsed?: boolean;
}) {
  return (
    <a
      href={getUrl(type, id, characterId)}
      className="flex gap-1.5 items-center"
    >
      <img
        src={getImageSrc(type, id)}
        alt={name}
        width={32}
        height={32}
        className="rounded bg-black"
      />
      {collapsed ? null : <div className="truncate">{name}</div>}
    </a>
  );
}
