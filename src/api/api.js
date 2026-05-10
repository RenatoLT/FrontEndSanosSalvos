const API_URL = "http://localhost:8090/api/bff";

async function request(endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  if (!res.ok) {
    let message = "Error en la API";

    try {
      const data = await res.json();
      message = data.message || message;
    } catch {
    }
    throw new Error(message);
  }

  return res.json();
}

export const api = {
  get: (url) => request(url),
  post: (url, data) =>
    request(url, {
      method: "POST",
      body: JSON.stringify(data)
    }),
  put: (url, data) =>
    request(url, {
      method: "PUT",
      body: JSON.stringify(data)
    }),
  delete: (url) =>
    request(url, {
      method: "DELETE"
    })
};