import ESI from "../lib/esi";
import ZKB from "../lib/zkillboard";

export const EntryRepository = {
  fetch(names, callback) {
    const entries = names.map(name => {
      return {
        char: {
          name,
          id: 0
        },
        corp: {
          id: 0,
          name: ""
        },
        ally: {
          id: 0,
          name: ""
        },
        ships: [],
        danger: 0,
        gangs: 0,
        kills: 0,
        losses: 0
      };
    });

    ESI.getIDs(names).then(results => {
      if (!results.characters) return;
      results.characters.forEach(character => {
        const entry = entries.find(entry => entry.char.name === character.name);
        if (!entry) return;

        entry.char.id = character.id;

        ESI.getCharacterAffiliation(entry.char.id).then(affiliation => {
          entry.corp.id = affiliation[0];
          if (affiliation.length > 1) entry.ally.id = affiliation[1];
          else entry.ally.id = null;

          ESI.getNames(affiliation).then(names => {
            entry.corp.name = names[0];
            if (names.length > 1) entry.ally.name = names[1];
            callback();
          });
        });

        ZKB.getCharacterKB(entry.char.id).then(killboard => {
          if (!killboard) return;
          entry.danger = killboard.dangerRatio || 0;
          entry.gangs = killboard.gangRatio || 0;
          entry.kills = killboard.shipsDestroyed || 0;
          entry.losses = killboard.shipsLost || 0;
          if (killboard.topLists) {
            const ships = killboard.topLists.find(list => {
              return list.type === "shipType";
            });
            if (ships) {
              entry.ships = ships.values.map(({ id, name }) => {
                return { id, name };
              });
            }
          }
          callback();
        });
      });
      callback();
    });

    return entries;
  }
};
