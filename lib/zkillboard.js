export default {
  getCharacterKB(id) {
    const url = `https://zkillboard.com/api/stats/characterID/${id}/`;
    const options = {};
    return fetch(url, options)
      .then(response => {
        if (response.ok) return response.json();
        throw response;
      })
      .catch(error => console.error(error));
  }
};
