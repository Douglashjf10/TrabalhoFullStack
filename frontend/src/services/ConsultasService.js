import api from "./api";
import { jwtDecode } from "jwt-decode";

export const getConsultas = async (token) => {
  const decodedToken = jwtDecode(token);
  const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decodedToken.role;

  const endpoint = userRole === "Admin" ? "/consultas" : "/consultas/minhas";
  const response = await api.get(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};
export const createConsulta = async (consulta) => {
  const response = await api.post("/consultas", consulta);
  return response.data;
};

export const deleteConsulta = async (consultaId) => {
  await api.delete(`/consultas/${consultaId}`);
};