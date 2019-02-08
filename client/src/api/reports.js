const baseUrl =
  process.env.REACT_APP_API_URL || "http://api.localthreat.localhost";

async function request(path, options) {
  try {
    const response = await fetch(baseUrl + path, options);
    if (response.ok) {
      return response.json();
    }
    throw response;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export default {
  create(body) {
    return request("/reports", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain"
      },
      body
    });
  },

  update(id, body) {
    return request("/reports/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "text/plain"
      },
      body
    });
  },

  fetch(id) {
    return request("/reports/" + id);
  }
};
