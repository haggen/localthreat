import React, { useEffect, memo } from "react";
import { schedule as fetchId } from "lib/fetch-ids";
import { schedule as fetchAffiliation } from "lib/fetch-affiliation";
import { schedule as fetchName } from "lib/fetch-names";
import { schedule as fetchStats } from "lib/fetch-stats";
import { CharacterData } from "types";
import { Entity } from "components/entity";

type Props = CharacterData & { update: (data: CharacterData) => void };

export const Row = memo((props: Props) => {
  const {
    name,
    id,
    corpId,
    corpName,
    allyId,
    allyName,
    ships,
    dangerRatio,
    gangRatio,
    shipsDestroyed,
    shipsLost,
    update,
  } = props;

  useEffect(() => {
    if (id) {
      return;
    }
    fetchId(name).then((id) => update({ name, id }));
  }, [name, id, update]);

  useEffect(() => {
    if (!id || corpId) {
      return;
    }
    fetchAffiliation(id).then((affiliation) => {
      const { corporation_id: corpId, alliance_id: allyId } = affiliation;
      update({
        name,
        corpId,
        allyId,
      });
    });
  }, [name, id, corpId, update]);

  useEffect(() => {
    if (!corpId || corpName) {
      return;
    }
    fetchName(corpId).then((corpName) => {
      update({ name, corpName });
    });
  }, [name, corpId, corpName, update]);

  useEffect(() => {
    if (!allyId || allyName) {
      return;
    }
    fetchName(allyId).then((allyName) => {
      update({ name, allyName });
    });
  }, [name, allyId, allyName, update]);

  useEffect(() => {
    if (!id || dangerRatio) {
      return;
    }
    fetchStats(id).then((stats) => {
      update({
        name,
        ...stats,
      });
    });
  }, [name, id, dangerRatio, update]);

  return (
    <tr>
      <td>
        <Entity type="char" name={name} ids={[id]} />
      </td>
      <td>
        <Entity type="corp" name={corpName} ids={[corpId]} />
      </td>
      <td>
        <Entity type="ally" name={allyName} ids={[allyId]} />
      </td>
      <td>
        {ships?.map((ship) => (
          <Entity
            key={ship.id}
            type="ship"
            ids={[ship.id, id]}
            name={ship.name}
            truncate
          />
        ))}
      </td>
      <td>{dangerRatio}</td>
      <td>{gangRatio}</td>
      <td>{shipsDestroyed}</td>
      <td>{shipsLost}</td>
    </tr>
  );
});
