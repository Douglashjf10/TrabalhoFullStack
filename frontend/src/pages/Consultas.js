import React, { useEffect, useState } from "react";
import { getConsultas } from "../services/ConsultasService";
import { useNavigate } from "react-router-dom";

const Consultas = () => {
  const [consultas, setConsultas] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await getConsultas(token);
        setConsultas(data);
      } catch (error) {
        console.error("Erro ao buscar consultas:", error);
        setMessage("Não foi possível carregar as consultas. Verifique sua autenticação.");
      }
    };

    fetchConsultas();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
      <div className="container mt-5">
        <div className="d-flex justify-content-between">
          <h2 className="text-center mb-4">Minhas Consultas</h2>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
        {message && <p className="text-danger text-center">{message}</p>}
        {consultas.length === 0 && !message ? (
            <p className="text-center">Nenhuma consulta encontrada.</p>
        ) : (
            <table className="table table-striped">
              <thead>
              <tr>
                <th>ID</th>
                <th>Descrição</th>
                <th>Data e Hora</th>
              </tr>
              </thead>
              <tbody>
              {consultas.map((consulta) => (
                  <tr key={consulta.id}>
                    <td>{consulta.id}</td>
                    <td>{consulta.descricao}</td>
                    <td>{new Date(consulta.dataHora).toLocaleString()}</td>
                  </tr>
              ))}
              </tbody>
            </table>
        )}
      </div>
  );
};

export default Consultas;
