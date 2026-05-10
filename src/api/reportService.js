import { api } from "./api";

export const reportService = {
  create: (data) => api.post("/reportes/integral", data),
  getAll: () => api.get("/reportes"),
  getByType: (tipo) => api.get(`/reportes/tipo/${tipo}`)
};