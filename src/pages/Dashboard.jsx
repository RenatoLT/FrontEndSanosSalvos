import { useState, useEffect } from "react";
import "../assets/css/dashboard.css";

function Dashboard() {
  const [tab, setTab] = useState("lost");
  const [filter, setFilter] = useState("");

  const [lostReports, setLostReports] = useState([]);
  const [seenReports, setSeenReports] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // 🔌 listo para backend después
    setLostReports([
      {
        id: 1,
        name: "Firulais",
        type: "Perro",
        location: "Santiago",
        status: "activo",
        image: "https://images.unsplash.com/photo-1558788353-f76d92427f16"
      }
    ]);

    setSeenReports([
      {
        id: 2,
        type: "Perro",
        color: "Negro",
        location: "Maipú",
        image: "https://images.unsplash.com/photo-1568572933382-74d440642117"
      }
    ]);

    setUsers([
      {
        id: 1,
        name: "Juan Pérez",
        email: "juan@test.com"
      }
    ]);
  }, []);

  const filterData = (data) =>
    data.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(filter.toLowerCase())
    );

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>Dashboard</h2>

        <button onClick={() => setTab("lost")} className={tab==="lost" ? "active":""}>
          Perdidos
        </button>

        <button onClick={() => setTab("seen")} className={tab==="seen" ? "active":""}>
          Avistados
        </button>

        <button onClick={() => setTab("users")} className={tab==="users" ? "active":""}>
          Usuarios
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

          <input
            className="search"
            placeholder="Buscar..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />

          <div className="list">

            {/* LOST */}
            {tab === "lost" &&
              filterData(lostReports).map((item) => (
                <div key={item.id} className="card">

                  <img src={item.image} alt="" />

                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.type}</p>
                    <span>{item.location}</span>
                  </div>

                </div>
              ))}

            {/* SEEN */}
            {tab === "seen" &&
              filterData(seenReports).map((item) => (
                <div key={item.id} className="card">

                  <img src={item.image} alt="" />

                  <div>
                    <h3>{item.type}</h3>
                    <p>{item.color}</p>
                    <span>{item.location}</span>
                  </div>

                </div>
              ))}

            {/* USERS */}
            {tab === "users" &&
              filterData(users).map((user) => (
                <div key={user.id} className="card user">
                  <div>
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                  </div>
                </div>
              ))}

          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;