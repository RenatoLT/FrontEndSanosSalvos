import { api } from "./api";

export const userService = {
    getAll: () =>
        api.get("/usuarios"),
    getById: (id) =>
    api.get(`/usuarios/${id}`)
};