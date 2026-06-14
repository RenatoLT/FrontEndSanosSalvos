import { api } from "./api";

const cleanUrl = (url) => {
  if (!url) return url;
  const prefix = "http://localhost:8090/api/bff/reportes/fotos/";
  if (url.startsWith(prefix)) {
    return url.replace(prefix, "");
  }
  return url;
};

const cleanReport = (r) => {
  if (r) {
    if (r.urlsFotos) {
      r.urlsFotos = r.urlsFotos.map(cleanUrl);
    }
    if (r.imagenUrl) {
      r.imagenUrl = cleanUrl(r.imagenUrl);
    }
  }
  return r;
};

export const reportService = {
  create: async (data) => {
    const res = await api.post("/reportes/integral", data);
    return cleanReport(res);
  },
  getAll: async () => {
    const data = await api.get("/reportes");
    return data ? data.map(cleanReport) : [];
  },
  getByType: async (tipo) => {
    const data = await api.get(`/reportes/tipo/${tipo}`);
    return data ? data.map(cleanReport) : [];
  },
  updateEstado: async (reporteId, payload) => {
    const res = await api.put(`/reportes/${reporteId}`, payload);
    return cleanReport(res);
  },
  getByUser: async (userId) => {
    const all = await api.get("/reportes");
    const filtered = all ? all.filter(r => r.nombreContacto === userId.nombre) : [];
    return filtered.map(cleanReport);
  },
  delete: (id) => api.delete(`/reportes/${id}`)
};