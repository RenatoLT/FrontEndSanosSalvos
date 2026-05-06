import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
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
      title="Crear cuenta 🐶"
      subtitle="Únete para ayudar a encontrar mascotas"
    >
      <form className="auth-form">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          onChange={handleChange}
        />

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
          Registrarse
        </button>

        <p className="auth-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Register;