import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Consultas from "./pages/Consultas";
import AdminConsultas from "./pages/AdminConsultas";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/consultas" element={<Consultas />} />
          <Route path="/login" element={<Login />} />
        <Route path="/admin/consultas" element={<AdminConsultas />} />
      </Routes>
    </Router>
  );
};

export default App;