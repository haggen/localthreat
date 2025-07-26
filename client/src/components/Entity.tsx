import { twMerge } from "tailwind-merge";
import { Tooltip } from "~/components/Tooltip";
import { useTooltip } from "~/lib/tooltip";

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
      throw new Error(`Unknown entity type: ${type}`);
  }
};

type Entity = {
  id?: number;
  name?: string;
};

function getEntity(props: {
  character?: Entity;
  faction?: null | Entity;
  corporation?: Entity;
  alliance?: null | Entity;
  ship?: Entity;
}) {
  // Ship must be tested first because it'll get the `character` prop too.
  if ("ship" in props) {
    return { type: "ship", ...props.ship };
  }
  if ("character" in props) {
    return { type: "character", ...props.character };
  }
  if ("faction" in props) {
    return { type: "faction", null: props.faction === null, ...props.faction };
  }
  if ("corporation" in props) {
    return { type: "corporation", ...props.corporation };
  }
  if ("alliance" in props) {
    return {
      type: "alliance",
      null: props.alliance === null,
      ...props.alliance,
    };
  }
}

export function Entity({
  collapsed,
  className,
  ...props
}: {
  character?: Entity;
  faction?: null | Entity;
  corporation?: Entity;
  alliance?: null | Entity;
  ship?: Entity;
  collapsed?: boolean;
  className?: string;
}) {
  const tooltip = useTooltip();

  const onMouseOver = () => {
    if (collapsed) {
      tooltip.open();
    }
  };

  const onMouseOut = () => {
    if (collapsed) {
      tooltip.close();
    }
  };

  const entity = getEntity(props);

  if (entity === undefined) {
    return "⋯";
  }

  if ("null" in entity && entity.null) {
    return "-";
  }

  const name = entity.name ?? "⋯";

  return (
    <a
      href={
        entity.id
          ? getUrl(entity.type, entity.id, props.character?.id)
          : undefined
      }
      className={twMerge("flex gap-1.5 items-center", className)}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      ref={tooltip.refs.setReference}
      target="_blank"
    >
      {/* We still want to render the generic protrait for characters. */}
      {entity.type === "character" || entity.id ? (
        <img
          src={getImageSrc(entity.type, entity.id ?? 1)}
          alt={name}
          width={32}
          height={32}
          className="bg-black rounded"
        />
      ) : null}
      {collapsed ? (
        <Tooltip context={tooltip}>{name}</Tooltip>
      ) : (
        <div className="truncate">{name}</div>
      )}
    </a>
  );
}
