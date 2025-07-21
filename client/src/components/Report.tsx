import { useEffect, type HTMLAttributes } from "react";
import { Entity } from "~/components/Entity";
import { Stat } from "~/components/Stat";
import { useAffiliations } from "~/lib/affiliations";
import { request } from "~/lib/api";
import { useAsync } from "~/lib/async";
import { usePaste } from "~/lib/clipboard";
import { useHistoryRecorder } from "~/lib/history";
import { useIds } from "~/lib/ids";
import { useNames } from "~/lib/names";
import type { Report } from "~/lib/report";
import {
  Ascending,
  compareEntityName,
  compareNumber,
  Descending,
  useSorting,
  type Direction,
} from "~/lib/sorting";
import { useZKillboard } from "~/lib/zkillboard";

function Header({
  sorting,
  children,
  className,
  ...props
}: HTMLAttributes<HTMLTableCellElement> & {
  sorting?: Direction;
}) {
  return (
    <th
      className={`p-1.5 text-foreground/50 ${
        "onClick" in props ? "cursor-pointer" : ""
      } ${className}`}
      {...props}
    >
      {children}
      <span className="absolute pl-1">
        {sorting === Ascending ? "▲" : sorting === Descending ? "▼" : ""}
      </span>
    </th>
  );
}

function Cell({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={`p-1.5 first:rounded-l-md last:rounded-r-md ${className}`}
      {...props}
    >
      {children}
    </td>
  );
}

/**
 * Data structure for a row in the report table.
 *
 * - `undefined` means we haven't received that part of the data yet.
 * - `null` means we got it but the field is empty. e.g. The character has no faction.
 */
type Row = {
  character: { id?: number; name: string };
  corporation?: { id: number; name?: string };
  faction?: null | { id: number; name?: string };
  alliance?: null | { id: number; name?: string };
  ships?: null | { id: number; name: string }[];
  dangerRatio?: number | null;
  gangRatio?: number | null;
  killCount?: number | null;
  lossCount?: number | null;
};

export function Report({ params }: { params: { reportId: string } }) {
  const { data, error, execute } = useAsync<Report>();

  useEffect(() => {
    execute(() => request("GET", `/v1/reports/${params.reportId}`));
  }, [params.reportId, execute]);

  usePaste((text) => {
    execute(() => request("PATCH", `/v1/reports/${params.reportId}`, text));
  });

  useHistoryRecorder(data);

  const sorting = useSorting<Row>(
    {
      character: compareEntityName,
      corporation: compareEntityName,
      faction: compareEntityName,
      alliance: compareEntityName,
      dangerRatio: compareNumber,
      gangRatio: compareNumber,
      killCount: compareNumber,
      lossCount: compareNumber,
    },
    { dangerRatio: Descending }
  );

  const ids = useIds();
  const names = useNames();
  const affiliations = useAffiliations();
  const zkillboard = useZKillboard();

  const table =
    data?.content?.map((name) => {
      const characterId = ids.query("character", name);

      const corporationId = characterId
        ? affiliations.query("corporation", characterId)
        : undefined;

      const corporation = corporationId
        ? {
            id: corporationId,
            name: names.query("corporation", corporationId),
          }
        : undefined;

      const factionId = characterId
        ? affiliations.query("faction", characterId)
        : undefined;

      const faction = factionId
        ? {
            id: factionId,
            name: names.query("faction", factionId),
          }
        : factionId;

      const allianceId = characterId
        ? affiliations.query("alliance", characterId)
        : undefined;

      const alliance = allianceId
        ? {
            id: allianceId,
            name: names.query("alliance", allianceId),
          }
        : allianceId;

      const killboard =
        typeof characterId === "number" ? zkillboard.query(characterId) : {};

      return {
        character: {
          name,
          id: characterId,
        },
        corporation,
        faction,
        alliance,
        ...killboard,
      } as Row;
    }) ?? [];

  table.sort(sorting.sorter);

  if (error) {
    return (
      <main className="self-center p-6">
        <article className="flex flex-col gap-3 items-center text-center">
          <h1 className="text-2xl font-bold opacity-50">Error</h1>
          <p className="max-w-1/2">
            An error occurred while processing your input. Please try again.
          </p>
        </article>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="self-center p-6">
        <article className="flex flex-col gap-3 items-center text-center">
          <h1 className="text-2xl font-bold opacity-50">Loading…</h1>
          <p className="max-w-1/2">Fetching information, please wait.</p>
        </article>
      </main>
    );
  }

  return (
    <main className="p-6">
      <table className="w-full table-fixed">
        <colgroup span={5}></colgroup>
        <colgroup span={2} className="w-20"></colgroup>
        <colgroup span={2} className="w-24"></colgroup>
        <thead>
          <tr>
            <Header
              sorting={sorting.current.character}
              onClick={() => sorting.set("character")}
              className="text-left"
            >
              Character
            </Header>
            <Header
              sorting={sorting.current.faction}
              onClick={() => sorting.set("faction")}
              className="text-left"
            >
              Faction
            </Header>
            <Header
              sorting={sorting.current.corporation}
              onClick={() => sorting.set("corporation")}
              className="text-left"
            >
              Corporation
            </Header>
            <Header
              sorting={sorting.current.alliance}
              onClick={() => sorting.set("alliance")}
              className="text-left"
            >
              Alliance
            </Header>
            <Header className="text-left">Ships</Header>
            <Header
              sorting={sorting.current.dangerRatio}
              onClick={() => sorting.set("dangerRatio")}
              aria-label="Danger ratio"
            >
              ☠️
            </Header>
            <Header
              sorting={sorting.current.gangRatio}
              onClick={() => sorting.set("gangRatio")}
              aria-label="Group ratio"
            >
              👥
            </Header>
            <Header
              sorting={sorting.current.killCount}
              onClick={() => sorting.set("killCount")}
              aria-label="Ships destroyed"
              className="text-right"
            >
              🎯
            </Header>
            <Header
              sorting={sorting.current.lossCount}
              onClick={() => sorting.set("lossCount")}
              aria-label="Ships lost"
              className="text-right"
            >
              💥
            </Header>
          </tr>
        </thead>
        <tbody>
          {table.map((row, i) => (
            <tr
              key={row.character.name}
              className={i % 2 === 0 ? "bg-foreground/5" : ""}
            >
              <Cell>
                <Entity character={row.character} />
              </Cell>
              <Cell>
                <Entity faction={row.faction} />
              </Cell>
              <Cell>
                <Entity corporation={row.corporation} />
              </Cell>
              <Cell>
                <Entity alliance={row.alliance} />
              </Cell>
              <Cell>
                <div className="overflow-x-scroll scrollbar-none">
                  <div className="flex gap-1.5">
                    {row.ships?.length
                      ? row.ships.map((ship) => (
                          <Entity
                            key={ship.id}
                            ship={ship}
                            character={row.character}
                            className="min-w-fit"
                            collapsed
                          />
                        ))
                      : row.ships === undefined
                      ? "⋯"
                      : "-"}
                  </div>
                </div>
              </Cell>
              <Cell className="text-center">
                <Stat value={row.dangerRatio} style="percent" />
              </Cell>
              <Cell className="text-center">
                <Stat value={row.gangRatio} style="percent" />
              </Cell>
              <Cell className="text-right">
                <Stat value={row.killCount} />
              </Cell>
              <Cell className="text-right">
                <Stat value={row.lossCount} />
              </Cell>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
