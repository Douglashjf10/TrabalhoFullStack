import React, { useState } from "react";
import { login } from "../services/AuthService";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, senha);
      localStorage.setItem("token", data.token);

      const decodedToken = jwtDecode(data.token);
      const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decodedToken.role;

      if (userRole === "Admin") {
        navigate("/admin/consultas");
      } else if (userRole === "User") {
        navigate("/consultas");
      } else {
        setError("Role inválido. Contate o administrador.");
      }
    } catch (err) {
      setError("Login falhou. Verifique suas credenciais.");
    }
  };

  return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="senha" className="form-label">Senha</label>
              <input
                  type="password"
                  className="form-control"
                  id="senha"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3">Entrar</button>
          </form>
          {error && <p className="text-danger text-center">{error}</p>}
          <div className="text-center">
            <p className="mb-2">Não tem uma conta?</p>
            <Link to="/register" className="btn btn-link">Registre-se</Link>
          </div>
        </div>
      </div>
  );
};

export default Login;

