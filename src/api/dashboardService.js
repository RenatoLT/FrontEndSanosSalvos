import { api } from "./api";

export const dashboardService = {
  getResumen: (id) => api.get(`/dashboard/resumen/${id}`)
};