const baseUrl = "https://zkillboard.com/api";

async function request(path, options) {
  const response = await fetch(baseUrl + path, options);
  if (response.ok) {
    return response.json();
  }
  console.error(response);
  throw response;
}

export default {
  fetchStats(id) {
    return request(`/stats/characterID/${id}/`);
  }
};
