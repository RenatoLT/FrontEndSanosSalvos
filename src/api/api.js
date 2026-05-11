const API_URL = "http://localhost:8090/api/bff";

async function request(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers
    },
    ...options
  });

  if (!res.ok) {
    let message = "Error en la API";

    try {
      const data = await res.json();
      message = data.message || message;
    } catch {}

    throw new Error(message);
  }

  if (res.status === 204) {
    return null;
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;

  return res.json();
}

export const api = {
  get: (url) => request(url),
  post: (url, data, isFormData = false) =>
    request(url, {
      method: "POST",
      body: isFormData ? data : JSON.stringify(data)
    }),
  put: (url, data, isFormData = false) =>
    request(url, {
      method: "PUT",
      body: isFormData ? data : JSON.stringify(data)
    }),
  delete: (url) =>
    request(url, {
      method: "DELETE"
    })
};