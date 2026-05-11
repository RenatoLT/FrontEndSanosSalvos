import { api } from "./api";

export const userService = {
    getAll: () =>
        api.get("/usuarios"),
    getById: (id) =>
    api.get(`/usuarios/${id}`),
    admin: (id) =>
        api.put(`/usuarios/${id}/rol-admin`),
    delete: (id) =>
        api.delete(`/usuarios/${id}`)
};