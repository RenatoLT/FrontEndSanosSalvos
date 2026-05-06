import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  return (
    <AuthLayout 
      title="Bienvenido 🐾"
      subtitle="Inicia sesión para continuar"
    >
      <form className="auth-form">
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
        />

        <button type="submit">
          Iniciar sesión
        </button>

        <p className="auth-link">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Login;