const baseUrl =
  process.env.REACT_APP_API_URL || "http://api.localthreat.localhost";

async function request(path, options) {
  const response = await fetch(baseUrl + path, options);
  if (response.ok) {
    return response.json();
  }
  throw response;
}

export default {
  create(body) {
    return request("/reports", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain"
      },
      body
    }).catch(console.error);
  },

  update(id, body) {
    return request("/reports/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "text/plain"
      },
      body
    }).catch(console.error);
  },

  fetch(id) {
    return request("/reports/" + id).catch(console.error);
  }
};
