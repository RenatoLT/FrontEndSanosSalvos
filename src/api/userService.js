import { api } from "./api";

export const userService = {
    getAll: () =>
        api.get("/usuarios"),
    getById: (id) =>
    api.get(`/usuarios/${id}`),
    updateUser: (id, data) =>
        api.put(`/usuarios/perfil/${id}`, data),
    delete: (id) =>
        api.delete(`/usuarios/${id}`)
};