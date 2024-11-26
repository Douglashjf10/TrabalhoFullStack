import api from "./api";

export const login = async (email, senha) => {
    const response = await api.post("/auth/login", { email, senha });
    return response.data;
};

export const getUsuarios = async () => {
    const response = await api.get("/usuarios");
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post("/usuarios", userData);
    return response.data;
};