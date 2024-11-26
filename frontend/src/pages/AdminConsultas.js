import React, { useState, useEffect } from "react";
import { createConsulta, getConsultas, deleteConsulta } from "../services/ConsultasService";
import { getUsuarios } from "../services/AuthService";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminConsultas = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [consultas, setConsultas] = useState([]);
  const [formData, setFormData] = useState({
    descricao: "",
    dataHora: "",
    usuarioId: "",
  });
  const [editFormData, setEditFormData] = useState({
    id: "",
    descricao: "",
    dataHora: "",
    usuarioId: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Acesso negado. Faça login.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decodedToken.role;

      if (userRole === "Admin") {
        setIsAdmin(true);
        const fetchUsuarios = async () => {
          const usuarios = await getUsuarios(token);
          setUsuarios(usuarios);
        };
        fetchUsuarios();
        const fetchConsultas = async () => {
          const consultas = await getConsultas(token);
          setConsultas(consultas);
        };
        fetchConsultas();
      } else {
        setMessage("Acesso negado. Somente administradores podem registrar consultas.");
      }
    } catch (error) {
      setMessage("Erro ao validar o token.");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await createConsulta(formData, token);
      setMessage("Consulta registrada com sucesso!");
      const updatedConsultas = await getConsultas(token);
      setConsultas(updatedConsultas);
    } catch (err) {
      setMessage("Erro ao registrar consulta.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${apiUrl}/consultas/${editFormData.id}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Consulta editada com sucesso!");
      const updatedConsultas = await getConsultas(token);
      setConsultas(updatedConsultas);
    } catch (err) {
      setMessage("Erro ao editar consulta.");
    }
    setEditFormData({
      id: "",
      descricao: "",
      dataHora: "",
      usuarioId: "",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDelete = async (consultaId) => {
    try {
      const token = localStorage.getItem("token");
      await deleteConsulta(consultaId, token);
      setMessage("Consulta excluída com sucesso!");
      const updatedConsultas = await getConsultas(token);
      setConsultas(updatedConsultas);
    } catch (err) {
      setMessage("Erro ao excluir consulta.");
    }
  };

  const startEdit = (consulta) => {
    setEditFormData({
      id: consulta.id,
      descricao: consulta.descricao,
      dataHora: consulta.dataHora,
      usuarioId: consulta.usuarioId,
    });
  };

  if (!isAdmin) {
    return <p className="text-center mt-5">{message}</p>;
  }

  return (
      <div className="container mt-5">
        <h2 className="text-center mb-4">Registrar Consulta</h2>
        <button className="btn btn-danger float-end" onClick={handleLogout}>Logout</button>
        {message && <p className="text-center">{message}</p>}
        <form onSubmit={handleSubmit} className="card p-4 shadow">
          <div className="mb-3">
            <label htmlFor="descricao" className="form-label">Descrição</label>
            <input
                type="text"
                id="descricao"
                name="descricao"
                className="form-control"
                value={formData.descricao}
                onChange={handleChange}
                required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="dataHora" className="form-label">Data e Hora</label>
            <input
                type="datetime-local"
                id="dataHora"
                name="dataHora"
                className="form-control"
                value={formData.dataHora}
                onChange={handleChange}
                required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="usuarioId" className="form-label">Usuário</label>
            <select
                id="usuarioId"
                name="usuarioId"
                className="form-select"
                value={formData.usuarioId}
                onChange={handleChange}
                required
            >
              <option value="">Selecione o usuário</option>
              {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nome}
                  </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Registrar Consulta
          </button>
        </form>
        <div className="mt-5">
          <h3 className="text-center mb-4">Lista de Consultas</h3>
          <table className="table table-bordered">
            <thead>
            <tr>
              <th>Descrição</th>
              <th>Data e Hora</th>
              <th>Usuário</th>
              <th>Ações</th>
            </tr>
            </thead>
            <tbody>
            {consultas.map((consulta) => (
                <tr key={consulta.id}>
                  <td>{consulta.descricao}</td>
                  <td>{new Date(consulta.dataHora).toLocaleString()}</td>
                  <td>{consulta.usuario.nome}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => startEdit(consulta)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(consulta.id)}>Excluir</button>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5">
          <h3 className="text-center mb-4">Editar Consulta</h3>
          <form onSubmit={handleEditSubmit} className="card p-4 shadow">
            <div className="mb-3">
              <label htmlFor="descricao" className="form-label">Descrição</label>
              <input
                  type="text"
                  id="descricao"
                  name="descricao"
                  className="form-control"
                  value={editFormData.descricao}
                  onChange={handleEditChange}
                  required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="dataHora" className="form-label">Data e Hora</label>
              <input
                  type="datetime-local"
                  id="dataHora"
                  name="dataHora"
                  className="form-control"
                  value={editFormData.dataHora}
                  onChange={handleEditChange}
                  required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="usuarioId" className="form-label">Usuário</label>
              <select
                  id="usuarioId"
                  name="usuarioId"
                  className="form-select"
                  value={editFormData.usuarioId}
                  onChange={handleEditChange}
                  required
              >
                <option value="">Selecione o usuário</option>
                {usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nome}
                    </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Atualizar Consulta
            </button>
          </form>
        </div>
      </div>
  );
};

export default AdminConsultas;


