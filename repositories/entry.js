// const esi = (path, extra) => {
//   const url = `https://esi.evetech.net/latest/${path}`;
//   const options = Object.assign(
//     {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json"
//       }
//     },
//     extra
//   );
//   return fetch(url, options)
//     .then(response => response.json())
//     .catch(error => console.error(error));
// };
//
// const search = (query, categories, strict) => {
//   const params = [`search=${encodeURIComponent(query)}`];
//   if (categories) params.push(`categories=${categories}`);
//   if (strict) params.push(`strict=true`);
//   const path = `search/?${params.join("&")}`;
//   return esi(path);
// };
//
// const getCharacterAffiliation = id => {
//   const path = `characters/affiliation/`;
//   const method = "POST";
//   const body = `[${id}]`;
//   return esi(path, { method, body }).then(json => {
//     const ids = [json[0].corporation_id];
//     if (json[0].alliance_id) ids.push(json[0].alliance_id);
//     return ids;
//   });
// };
//
// const getCharacterKillboard = id => {
//   const url = `https://zkillboard.com/api/stats/characterID/${id}/`;
//   const options = {
//     // headers: {
//     //   'Accept': 'application/json',
//     //   'Content-Type': 'application/json'
//     // }
//   };
//   return fetch(url, options)
//     .then(response => response.json())
//     .catch(error => console.error(error));
// };
//
// const getCorporation = id => {
//   const path = `corporations/${id}/`;
//   return esi(path).then(json => {
//     return { id, name: json.corporation_name };
//   });
// };
//
// const getAlliance = id => {
//   const path = `alliances/${id}/`;
//   return esi(path).then(json => {
//     return { id, name: json.alliance_name };
//   });
// };
//
// const getIDs = names => {
//   const path = "universe/ids/";
//   const method = "POST";
//   const body = JSON.stringify(names);
//   return esi(path, { method, body });
// };
//
// const getNames = ids => {
//   const path = "universe/names/";
//   const method = "POST";
//   const body = `[${ids.join(",")}]`;
//   return esi(path, { method, body }).then(json => {
//     return ids.map(id => {
//       const result = json.find(result => {
//         return result.id === id;
//       });
//       return result ? result.name : "";
//     });
//   });
// };
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
