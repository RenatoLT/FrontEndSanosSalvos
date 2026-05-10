import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../api/authService";
import { useAuth } from "../context/AuthContext";
import "../assets/css/Auth.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const { login } = useAuth();
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email) {
      return setError("Debes ingresar un correo");
    }

    if (!emailRegex.test(form.email)) {
      return setError("Correo inválido");
    }

    if (!form.password) {
      return setError("Debes ingresar la contraseña");
    }

    try {
      const response = await authService.login(form);
      login(response);

      navigate("/");

    } catch (err) {
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <AuthLayout 
      title="Bienvenido 🐾"
      subtitle="Inicia sesión para continuar"
    >
      <form className="auth-form" onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
        />

        <button className="submit-button" type="submit" disabled={!form.email || !form.password}>
          Iniciar sesión
        </button>

        <p className="auth-link">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>

        {error && <p className="form-message error">{error}</p>}

      </form>
    </AuthLayout>
  );
}

export default Login;