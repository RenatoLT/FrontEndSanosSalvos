import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function MainNavbar() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { user } = useAuth();
  const isAdmin = user?.rol === "ADMIN";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);


  // 📱 MOBILE NAVBAR
  if (isMobile) {
    return (
      <>
        <div className="mobile-topbar">
          <div className="mobile-topbar-content">
            <Link to="/" className="mobile-logo">
              🐾 Sanos y Salvos
            </Link>

            {isAdmin && (
              <Link to="/dashboard" className="mobile-admin-link">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 
                  2 0 1 1-2.83 2.83l-.06-.06A1.65 
                  1.65 0 0 0 15 19.4a1.65 1.65 0 
                  0 0-1 .6 1.65 1.65 0 0 0-.33 
                  1.82v.06a2 2 0 1 1-4 0v-.06a1.65 
                  1.65 0 0 0-.33-1.82 1.65 1.65 0 
                  0 0-1-.6 1.65 1.65 0 0 0-1.82.33l-.06.06a2 
                  2 0 1 1-2.83-2.83l.06-.06A1.65 
                  1.65 0 0 0 4.6 15a1.65 1.65 0 
                  0 0-.6-1 1.65 1.65 0 0 
                  0-1.82-.33h-.06a2 2 0 1 
                  1 0-4h.06a1.65 1.65 0 0 
                  0 1.82-.33H4.6A1.65 1.65 
                  0 0 0 5 9a1.65 1.65 0 0 
                  0-.6-1.82l-.06-.06a2 2 
                  0 1 1 2.83-2.83l.06.06A1.65 
                  1.65 0 0 0 9 4.6c.26 0 
                  .51-.1.71-.29A1.65 1.65 
                  0 0 0 10 2.82V2.76a2 2 
                  0 1 1 4 0v.06c0 .65.39 
                  1.23 1 1.5.2.19.45.29.71.29.65 
                  0 1.23-.39 1.5-1l.06-.06a2 2 
                  0 1 1 2.83 2.83l-.06.06c-.61.27-1 
                  .85-1 1.5 0 .26.1.51.29.71.19.2.29.45.29.71 
                  0 .65-.39 1.23-1 1.5z" />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* BOTTOM NAVBAR */}
        <div className="mobile-navbar">

          {/* IZQUIERDA */}
          <Link to="/map" className="mobile-nav-item">
            <span>🗺️</span>
            <small>Mapa</small>
          </Link>

          {/* BOTÓN CENTRAL */}
          <Link to="/ReportPage" className="mobile-report-btn">
            +
          </Link>

          {/* DERECHA */}
          <Link to={user ? "/account" : "/login"} className="mobile-nav-item">
            <span>👤</span>
            <small>Cuenta</small>
          </Link>

        </div>

      </>
    );
  }

  // DESKTOP NAVBAR
  return (
    <nav className="desktop-navbar">
      <div className="desktop-navbar-container">

        <div className="desktop-logo">
          <Link to="/">🐾 Sanos y Salvos</Link>
        </div>

        <div className="desktop-links">
          <Link to="/">Inicio</Link>
          <Link to="/map">Mapa</Link>
          {isAdmin && <Link to="/dashboard">Dashboard</Link>}
          <Link to={user ? "/account" : "/login"}>Cuenta</Link>
        </div>

      </div>
    </nav>
  );
}

export default MainNavbar;