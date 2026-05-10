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
                ⚙️
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