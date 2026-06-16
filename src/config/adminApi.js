import api from "./api";

const adminApi = {
    getAll: () => api.get("/api/users/getAllAdmin"),

    getById: (id) =>
        api.get(`/api/users/${id}`),

    create: (data) =>
        api.post("/api/users/register", data),

    update: (id, data) =>
        api.put(`/api/users/${id}`, data),

    delete: (id) =>
        api.delete(`/api/users/${id}`)
};

export default adminApi;