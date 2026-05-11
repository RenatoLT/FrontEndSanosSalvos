import { useNavigate } from "react-router-dom";
import "../assets/css/AccountPage.css";
import ConfirmModal from "../components/ConfimModal";
import { authService } from "../api/authService";
import { useEffect, useState } from "react";
import { userService } from "../api/userService";
import { useAuth } from "../context/AuthContext";
import { reportService } from "../api/reportService";
import { mapReport } from "../mappers/reportMapper";

function AccountPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [reportes, setReportes] = useState([]);

  const [modal, setModal] = useState({
    open: false,
    type: null,
    id: null
  });

  const confirmAction = async () => {
    try {
      if (modal.type === "delete") {
        await reportService.delete(modal.id);

        setReportes(prev =>
          prev.filter(r => r.id !== modal.id)
        );
      }

    } catch (err) {
      console.error(err);
    } finally {
      setModal({ open: false, type: null, id: null });
    }
  };

  const closeModal = () => {
    setModal({ open: false, type: null, id: null });
  };

  useEffect(() => {
    const loadReportes = async () => {
      try {
        const data = await reportService.getAll();

        const propios = data
          .map(mapReport)
          .filter(r => r.contacto === user.nombre);

        setReportes(propios);
      } catch (err) {
        console.error(err);
      }
    };

    if (user) loadReportes();
  }, [user]);

  const reportesActivos = reportes.filter(
    r => r.estado === "ACTIVO"
  );

  const handleEstadoChange = async (reporte, nuevoEstado) => {
    try {
      const payload = {
        id: reporte.id,
        tipo: reporte.tipo,
        estado: nuevoEstado,
        descripcion: reporte.descripcion,
        latitud: reporte.latitud,
        longitud: reporte.longitud
      };

      await reportService.updateEstado(reporte.id, payload);

      setReportes(prev =>
        prev.map(r =>
          r.id === reporte.id
            ? { ...r, estado: nuevoEstado }
            : r
        )
      );

    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.warn("Logout backend falló, continuando...");
    }

    logout();
    navigate("/login");
  };

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await userService.getById(user.idUsuario);
        setUserData(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (user) loadUser();
  }, [user]);

  return (
    <div className="account-container">

      <div className="account-card">

        <div className="account-header">
          <div className="account-avatar">
            {user.nombre?.charAt(0).toUpperCase()}
          </div>

          <h2>
            {user.nombre?.charAt(0).toUpperCase() +
              user.nombre?.slice(1) +
              " " +
              userData?.apellido1?.charAt(0).toUpperCase() +
              userData?.apellido1?.slice(1).toLowerCase()}
          </h2>

          <p className="account-role">{user.rol}</p>
        </div>

        <div className="account-info">
          <div className="account-row">
            <span>Correo</span>
            <p>{userData?.email || "No disponible"}</p>
          </div>
          <div className="account-row">
            <span>Fecha de Nacimiento</span>
            <p>{userData?.fechaNacimiento || "No disponible"}</p>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
        {/* REPORTES ABAJO */}
        <div className="reports-section">
          <h3>Mis reportes</h3>

          {reportesActivos.length === 0 && (
            <p className="empty">No tienes reportes activos</p>
          )}

          <div className="reports-list">
            {reportesActivos.map((r) => (
              <div key={r.id} className="report-card">

                <div className="report-info">
                  <h4>{r.mascota || "Sin nombre"}</h4>
                  <p>{r.descripcion}</p>
                  <span>{r.ubicacion}</span>
                </div>

                <div className="report-actions">

                  <select
                    className="status-select"
                    value={r.estado}
                      onChange={(e) =>
                      handleEstadoChange(r, e.target.value)
                    }
                  >
                    <option value="ACTIVO">Activo</option>
                    <option value="RESUELTO">Encontrado</option>
                    <option value="CANCELADO">Cerrado</option>
                  </select>

                  <button
                    className="btn danger"
                    onClick={() => {
                      setModal({ open: true, type: "delete", id: r.id });
                    }}
                  >
                    Eliminar
                  </button>

                </div>

              </div>
            ))}
          </div>
        </div>
      <ConfirmModal
        open={modal.open}
        title="Eliminar reporte"
        message="¿Seguro que quieres eliminar este reporte?"
        onConfirm={confirmAction}
        onCancel={closeModal}
      />
    </div>
  );
};

export default AccountPage;