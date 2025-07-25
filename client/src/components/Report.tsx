import {
  useEffect,
  useMemo,
  type HTMLAttributes,
  type MouseEvent,
} from "react";
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
} from "~/lib/sorting";
import { useZKillboard } from "~/lib/zkillboard";

function Header({
  sorting,
  children,
  className,
  ...props
}: HTMLAttributes<HTMLTableCellElement> & {
  sorting?: [ReturnType<typeof useSorting<Row>>, keyof Row];
}) {
  const sortable = sorting !== undefined;
  const direction = sortable ? sorting[0].current[sorting[1]] : undefined;

  // onMouseDown is used to prevent the default text selection behavior.
  const onMouseDown = (event: MouseEvent) => {
    if (sortable) {
      event.preventDefault();
      sorting?.[0].set(sorting[1]);
    }
  };

  return (
    <th
      className={`p-1.5 text-foreground/50 ${
        sortable ? "cursor-pointer" : ""
      } ${className}`}
      onMouseDown={onMouseDown}
      {...props}
    >
      {children}

      {sortable ? (
        <span className="absolute ml-1">
          {direction === Ascending ? "↑" : direction === Descending ? "↓" : ""}
        </span>
      ) : null}
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

const comparers = {
  character: compareEntityName,
  corporation: compareEntityName,
  faction: compareEntityName,
  alliance: compareEntityName,
  dangerRatio: compareNumber,
  gangRatio: compareNumber,
  killCount: compareNumber,
  lossCount: compareNumber,
};

function sorted<T>(array: T[], compare: (a: T, b: T) => number) {
  array.sort(compare);
  return array;
}

export function Report({ params }: { params: { reportId: string } }) {
  const { data, error, execute } = useAsync<Report>();

  useEffect(() => {
    execute(() => request("GET", `/v1/reports/${params.reportId}`));
  }, [params.reportId, execute]);

  usePaste((text) => {
    execute(() => request("PATCH", `/v1/reports/${params.reportId}`, text));
  });

  useHistoryRecorder(data);

  const sorting = useSorting<Row>(comparers, { dangerRatio: Descending });

  const ids = useIds();
  const names = useNames();
  const affiliations = useAffiliations();
  const zkillboard = useZKillboard();

  const table = useMemo(
    () =>
      sorted(
        (data?.content ?? []).map((name) => {
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
            typeof characterId === "number"
              ? zkillboard.query(characterId)
              : {};

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
        }),
        sorting.sorter
      ),
    [data?.content, ids, affiliations, names, zkillboard, sorting.sorter]
  );

  const { factions, corporations, alliances } = useMemo(() => {
    const factions = new Map<number, string | undefined>();
    const corporations = new Map<number, string | undefined>();
    const alliances = new Map<number, string | undefined>();

    for (const row of table) {
      if (row.faction?.id) {
        factions.set(row.faction.id, row.faction.name);
      }

      if (row.corporation?.id) {
        corporations.set(row.corporation.id, row.corporation.name);
      }

      if (row.alliance?.id) {
        alliances.set(row.alliance.id, row.alliance.name);
      }
    }

    return {
      factions: sorted(
        Array.from(factions.keys()).map((id) => ({
          id,
          name: factions.get(id),
        })),
        compareEntityName
      ),
      corporations: sorted(
        Array.from(corporations.keys()).map((id) => ({
          id,
          name: corporations.get(id),
        })),
        compareEntityName
      ),
      alliances: sorted(
        Array.from(alliances.keys()).map((id) => ({
          id,
          name: alliances.get(id),
        })),
        compareEntityName
      ),
    };
  }, [table]);

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
      <div className="grid grid-cols-3 items-start gap-6">
        <section className="grid grid-rows-[auto_1fr] self-stretch">
          <h1 className="p-1.5 text-foreground/50 font-bold">Factions</h1>
          <div className="rounded bg-foreground/5 text-foreground/50 p-1.5">
            {factions.length ? (
              <ul className="flex gap-1.5 flex-wrap">
                {factions.map((faction) => (
                  <li key={faction.id}>
                    <Entity faction={faction} collapsed />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center place-self-center">Empty.</p>
            )}
          </div>
        </section>

        <section className="grid grid-rows-[auto_1fr] self-stretch">
          <h1 className="p-1.5 text-foreground/50 font-bold">Corporations</h1>
          <div className="rounded bg-foreground/5 text-foreground/50 p-1.5">
            {corporations.length ? (
              <ul className="flex gap-1.5 flex-wrap">
                {corporations.map((corporation) => (
                  <li key={corporation.id}>
                    <Entity corporation={corporation} collapsed />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center place-self-center">Empty.</p>
            )}
          </div>
        </section>

        <section className="grid grid-rows-[auto_1fr] self-stretch">
          <h1 className="p-1.5 text-foreground/50 font-bold">Alliances</h1>
          <div className="rounded bg-foreground/5 text-foreground/50 p-1.5">
            {alliances.length ? (
              <ul className="flex gap-1.5 flex-wrap">
                {alliances.map((alliance) => (
                  <li key={alliance.id}>
                    <Entity alliance={alliance} collapsed />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center place-self-center">Empty.</p>
            )}
          </div>
        </section>

        <table className="col-span-3 table-fixed">
          <colgroup span={4} className="w-1/7" />
          <colgroup />
          <colgroup span={2} className="w-20" />
          <colgroup span={2} className="w-24" />
          <thead>
            <tr>
              <Header sorting={[sorting, "character"]} className="text-left">
                Character
              </Header>
              <Header sorting={[sorting, "faction"]} className="text-left">
                Faction
              </Header>
              <Header sorting={[sorting, "corporation"]} className="text-left">
                Corporation
              </Header>
              <Header sorting={[sorting, "alliance"]} className="text-left">
                Alliance
              </Header>
              <Header className="text-left">Ships</Header>
              <Header
                sorting={[sorting, "dangerRatio"]}
                aria-label="Danger ratio"
              >
                ☠️
              </Header>
              <Header sorting={[sorting, "gangRatio"]} aria-label="Group ratio">
                👥
              </Header>
              <Header
                sorting={[sorting, "killCount"]}
                aria-label="Ships destroyed"
              >
                🎯
              </Header>
              <Header sorting={[sorting, "lossCount"]} aria-label="Ships lost">
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
                <Cell className="text-center">
                  <Stat value={row.killCount} />
                </Cell>
                <Cell className="text-center">
                  <Stat value={row.lossCount} />
                </Cell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
