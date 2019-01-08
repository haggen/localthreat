// ESI API base endpoint.
// See https://esi.evetech.net/ui/.
const endpoint = "https://esi.evetech.net";

// API version to use.
const version = "/latest";

// Default options shared for all requests.
const defaults = {
  method: "GET",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
};

// Make a request to ESI.
function request(path, options) {
  const url = endpoint + version + path;

  return fetch(url, Object.assign({}, defaults, options))
    .then(response => {
      if (response.ok) return response.json();
      throw response;
    })
    .catch(error => console.error(error));
}

export default {
  search(query, categories, strict) {
    const params = [`search=${encodeURIComponent(query)}`];
    if (categories) params.push(`categories=${categories}`);
    if (strict) params.push(`strict=true`);
    const path = `/search/?${params.join("&")}`;
    return request(path);
  },

  getCharacterAffiliation(id) {
    const path = `/characters/affiliation/`;
    const method = "POST";
    const body = `[${id}]`;
    return request(path, { method, body }).then(json => {
      const ids = [json[0].corporation_id];
      if (json[0].alliance_id) ids.push(json[0].alliance_id);
      return ids;
    });
  },

  getCorporation(id) {
    const path = `/corporations/${id}/`;
    return request(path).then(json => {
      return { id, name: json.corporation_name };
    });
  },

  getAlliance(id) {
    const path = `/alliances/${id}/`;
    return request(path).then(json => {
      return { id, name: json.alliance_name };
    });
  },

  getNames(ids) {
    const path = "/universe/names/";
    const method = "POST";
    const body = JSON.stringify(ids);
    return request(path, { method, body }).then(json => {
      return ids.map(id => {
        const result = json.find(result => {
          return result.id === id;
        });
        return result ? result.name : "";
      });
    });
  },

  getIDs(names) {
    const path = "/universe/ids/";
    const method = "POST";
    const body = JSON.stringify(names);
    return request(path, { method, body });
  }
};
