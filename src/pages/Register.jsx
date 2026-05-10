import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../api/authService";
import "../assets/css/Auth.css"

function Register() {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    run: "",
    nombre: "",
    apellido1: "",
    apellido2: "",
    dia: "",
    mes: "",
    anio: "",
    email: "",
    telefono: "",
    password: ""
  });

  const validarRun = (run) => {
    if (!run) return false;

    run = run.replace(/\./g, "").replace(/-/g, "").toUpperCase();

    const cuerpo = run.slice(0, -1);
    let dv = run.slice(-1);

    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += multiplo * parseInt(cuerpo[i]);
      multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }

    let dvEsperado = 11 - (suma % 11);
    dvEsperado =
      dvEsperado === 11 ? "0" :
      dvEsperado === 10 ? "K" :
      dvEsperado.toString();

    return dv === dvEsperado;
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const telefonoRegex = /^9\d{8}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/;

  const fechaNacimiento =
    form.dia && form.mes && form.anio
      ? `${form.dia}-${form.mes}-${form.anio}`
      : "";

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarRun(form.run)) {
      setError("RUN inválido");
      return;
    }

    if (!emailRegex.test(form.email)) {
      setError("Email inválido");
      return;
    }

    if (!telefonoRegex.test(form.telefono)) {
      setError("Teléfono inválido (Chile: 9XXXXXXXX)");
      return;
    }

    if (!passwordRegex.test(form.password)) {
      setError("Contraseña débil (min 8, mayús, minús, número y símbolo)");
      return;
    }

    if (!nombreRegex.test(form.nombre)) {
      setError("Nombre inválido (solo letras y espacios, mínimo 2 caracteres)");
      return;
    }

    if (!nombreRegex.test(form.apellido1)) {
      setError("Apellido paterno inválido (solo letras y espacios, mínimo 2 caracteres)");
      return;
    }

    if (!form.dia || !form.mes || !form.anio) {
      setError("Fecha de nacimiento incompleta");
      return;
    }

    const payload = {
      run: form.run,
      nombre: form.nombre,
      apellido1: form.apellido1,
      apellido2: form.apellido2,
      email: form.email,
      telefono: Number(form.telefono),
      password: form.password,
      fechaNacimiento
    };

    try {
      await authService.register(payload);
      setSuccess("Cuenta creada correctamente");
      setError("");
        setTimeout(() => {
      navigate("/login");
    }, 1200);
    } catch (err) {
      setError(err.message || "Error al crear cuenta");
      setSuccess("");
    }
  };

  const dias = Array.from({ length: 31 }, (_, i) => i + 1);
  const meses = Array.from({ length: 12 }, (_, i) => i + 1);
  const anios = Array.from({ length: 100 }, (_, i) => 2026 - i);

  return (
    <AuthLayout
      title="Crear cuenta 🐶"
      subtitle="Únete para ayudar a encontrar mascotas"
    >
      <form className="auth-form" onSubmit={handleSubmit}>

        <input name="run" placeholder="RUN" value={form.run} onChange={handleChange} />

        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
        <input name="apellido1" placeholder="Apellido paterno" value={form.apellido1} onChange={handleChange} />
        <input name="apellido2" placeholder="Apellido materno" value={form.apellido2} onChange={handleChange} />

        {/* FECHA NACIMIENTO (DROPDOWNS) */}
        <div style={{ display: "flex", gap: 8 }}>
          <select name="dia" value={form.dia} onChange={handleChange}>
            <option value="">Día</option>
            {dias.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select name="mes" value={form.mes} onChange={handleChange}>
            <option value="">Mes</option>
            {meses.map(m => <option key={m} value={m}>{m}</option>)}
          </select>

          <select name="anio" value={form.anio} onChange={handleChange}>
            <option value="">Año</option>
            {anios.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="telefono"
          placeholder="Teléfono (9XXXXXXXX)"
          value={form.telefono}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit">Registrarse</button>

        <p className="auth-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>

        {error && (
          <p className="form-message error">
            {error}
          </p>
        )}

        {success && (
          <p className="form-message success">
            {success}
          </p>
        )}
      </form>


    </AuthLayout>
  );
}

export default Register;