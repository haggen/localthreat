const baseUrl = "https://esi.evetech.net/latest";

async function request(path, options) {
  const response = await fetch(baseUrl + path, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    ...options
  });
  if (response.ok) {
    return response.json();
  }
  console.error(response);
  throw response;
}

export default {
  async fetchAffiliations(ids) {
    const json = await request(`/characters/affiliation/`, {
      method: "POST",
      body: JSON.stringify(ids)
    });
    return json.reduce((result, data) => {
      const affiliation = {
        corporationId: data.corporation_id
      };
      if (data.alliance_id) {
        affiliation.allianceId = data.alliance_id;
      }
      result[data.character_id] = affiliation;
      return result;
    }, {});
  },

  async fetchByIds(ids) {
    const json = await request("/universe/names/", {
      method: "POST",
      body: JSON.stringify(ids)
    });
    return json.reduce((result, data) => {
      if (result[data.id]) {
        console.log("ids are not unique between corporarion and alliance");
      }
      result[data.id] = data.name;
      return result;
    }, {});
  },

  async fetchByNames(names) {
    const json = await request("/universe/ids/", {
      method: "POST",
      body: JSON.stringify(names)
    });
    return json.characters.reduce((result, data) => {
      result[data.name] = data.id;
      return result;
    }, {});
  }
};
