import { api } from "./api";

export const reportService = {
  create: (data) => api.post("/reportes/integral", data),
  getAll: () => api.get("/reportes"),
  getByType: (tipo) => api.get(`/reportes/tipo/${tipo}`),
  updateEstado: (reporteId, payload) =>
    api.put(`/reportes/${reporteId}`, payload),
  getByUser: async (userId) => {
    const all = await api.get("/reportes");
    return all.filter(r => r.nombreContacto === userId.nombre);
  },
  delete: (id) => api.delete(`/reportes/${id}`)
};