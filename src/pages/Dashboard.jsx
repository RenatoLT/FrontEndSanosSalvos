import { useState, useEffect } from "react";
import "../assets/css/dashboard.css";
import ConfirmModal from "../components/ConfimModal";
import { reportService } from "../api/reportService";
import { mapReport } from "../mappers/reportMapper";
import { userService } from "../api/userService";
import { LuShieldAlert, LuEye, LuUsers, LuTrash2, LuUserCheck, LuSearch } from "react-icons/lu";

function Dashboard() {
  const [tab, setTab] = useState("lost");
  const [filter, setFilter] = useState("");

  const [lostReports, setLostReports] = useState([]);
  const [seenReports, setSeenReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState({open: false,type: null,id: null});
  
  const confirmAction = async () => {
    try {
      if (modal.type === "deleteReporte") {
        await reportService.delete(modal.id);

        setLostReports(prev => prev.filter(r => r.id !== modal.id));
        setSeenReports(prev => prev.filter(r => r.id !== modal.id));
      }

      if (modal.type === "deleteUser") {
        await userService.delete(modal.id);
        setUsers(prev => prev.filter(u => u.idUsuario !== modal.id));
      }

      if (modal.type === "makeAdmin") {
        await userService.admin(modal.id);

        setUsers(prev =>
          prev.map(u =>
            u.idUsuario === modal.id ? { ...u, rol: "ADMIN" } : u
          )
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

  const handleDeleteReporte = (id) => {
    setModal({
      open: true,
      type: "deleteReporte",
      id
    });
  };

  const handleDeleteUser = (id) => {
    setModal({
      open: true,
      type: "deleteUser",
      id
    });
  };

  const handleMakeAdmin = (id) => {
    setModal({
      open: true,
      type: "makeAdmin",
      id
    });
  };

  const filterData = (data) =>
    data.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(filter.toLowerCase())
    );
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const reports = await reportService.getAll();

        const lost = reports
          .filter(r => r.tipo === "PERDIDO")
          .map(mapReport);

        const seen = reports
          .filter(r => r.tipo === "AVISTADA")
          .map(mapReport);

        setLostReports(lost);
        setSeenReports(seen);

        const usersData = await userService.getAll();
        setUsers(usersData || []);

      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, []);
  
  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>Dashboard</h2>

        <button onClick={() => setTab("lost")} className={tab === "lost" ? "active" : ""}>
          <LuShieldAlert size={18} style={{ marginRight: "8px", verticalAlign: "middle" }} />
          <span>Perdidos</span>
        </button>

        <button onClick={() => setTab("seen")} className={tab === "seen" ? "active" : ""}>
          <LuEye size={18} style={{ marginRight: "8px", verticalAlign: "middle" }} />
          <span>Avistados</span>
        </button>

        <button onClick={() => setTab("users")} className={tab === "users" ? "active" : ""}>
          <LuUsers size={18} style={{ marginRight: "8px", verticalAlign: "middle" }} />
          <span>Usuarios</span>
        </button>
      </aside>

      {/* MAIN */}
      <main className="main">

        <div className="container">

          <h1>
            {tab === "lost" && "Mascotas Perdidas"}
            {tab === "seen" && "Mascotas Avistadas"}
            {tab === "users" && "Usuarios"}
          </h1>

          <div className="search-container">
            <LuSearch className="search-icon" />
            <input
              className="search"
              placeholder="Buscar por nombre, descripción o raza..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          <div className="list">

            {/* LOST */}
            {tab === "lost" &&
              filterData(lostReports).map((item) => (
                <div key={item.id} className="card">

                  <img src={(item.urlsFotos && item.urlsFotos.length > 0) ? item.urlsFotos[0] : "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=200"} alt="mascota" />

                  <div className="card-info">
                    <div className="card-header-row">
                      <h3>{item.mascota}</h3>
                      <span className="badge badge-perdido">Perdido</span>
                    </div>
                    <p className="card-desc">{item.descripcion}</p>
                    <div className="card-meta">
                      <span><strong>Ubicación:</strong> {item.ubicacion || "No especificada"}</span>
                      <span><strong>Raza:</strong> {item.raza}</span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button
                      className="btn danger"
                      onClick={() => handleDeleteReporte(item.id)}
                    >
                      <LuTrash2 size={16} style={{ marginRight: "6px", verticalAlign: "middle" }} />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}

            {/* SEEN */}
            {tab === "seen" &&
              filterData(seenReports).map((item) => (
                <div key={item.id} className="card">

                  <img src={(item.urlsFotos && item.urlsFotos.length > 0) ? item.urlsFotos[0] : "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=200"} alt="mascota" />

                  <div className="card-info">
                    <div className="card-header-row">
                      <h3>{item.mascota}</h3>
                      <span className="badge badge-avistado">Avistado</span>
                    </div>
                    <p className="card-desc">{item.descripcion}</p>
                    <div className="card-meta">
                      <span><strong>Ubicación:</strong> {item.ubicacion || "No especificada"}</span>
                      <span><strong>Raza:</strong> {item.raza}</span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button
                      className="btn danger"
                      onClick={() => handleDeleteReporte(item.id)}
                    >
                      <LuTrash2 size={16} style={{ marginRight: "6px", verticalAlign: "middle" }} />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}

            {/* USERS */}
            {tab === "users" &&
              filterData(users).map((u) => (
                <div key={u.idUsuario} className="card user">

                  <div className="card-info">
                    <div className="card-header-row">
                      <h3>{u.nombre}</h3>
                      <span className={`badge ${u.rol === "ADMIN" ? "badge-admin" : "badge-user"}`}>
                        {u.rol}
                      </span>
                    </div>
                    <p className="card-desc">{u.email}</p>
                  </div>

                  <div className="card-actions">
                    {u.rol !== "ADMIN" && (
                      <button
                        className="btn primary"
                        onClick={() => handleMakeAdmin(u.idUsuario)}
                      >
                        <LuUserCheck size={16} style={{ marginRight: "6px", verticalAlign: "middle" }} />
                        Hacer Admin
                      </button>
                    )}
                    <button
                      className="btn danger"
                      onClick={() => handleDeleteUser(u.idUsuario)}
                    >
                      <LuTrash2 size={16} style={{ marginRight: "6px", verticalAlign: "middle" }} />
                      Eliminar
                    </button>
                  </div>

                </div>
              ))}
          </div>
        </div>
      </main>
      <ConfirmModal
        open={modal.open}
        title={
          modal.type === "deleteReporte" ? "Eliminar reporte" :
          modal.type === "deleteUser" ? "Eliminar usuario" :
          modal.type === "makeAdmin" ? "Hacer administrador" :
          ""
        }
        message={
          modal.type === "deleteReporte" ? "¿Seguro que quieres eliminar este reporte?" :
          modal.type === "deleteUser" ? "¿Seguro que quieres eliminar este usuario?" :
          modal.type === "makeAdmin" ? "¿Quieres darle permisos de administrador?" :
          ""
        }
        onConfirm={confirmAction}
        onCancel={closeModal}
      />
    </div>
  );
}

export default Dashboard;