import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import gsap from "gsap";
import { LuMap, LuUser, LuLayoutDashboard, LuAward, LuPlus } from "react-icons/lu";

function MainNavbar() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { user } = useAuth();
  const isAdmin = user?.rol === "ADMIN";
  const plusIconRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleReportClick = () => {
    if (plusIconRef.current) {
      gsap.to(plusIconRef.current, {
        rotation: "+=180",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };


  // 📱 MOBILE NAVBAR
  if (isMobile) {
    return (
      <>
        <div className="mobile-topbar">
          <div className="mobile-topbar-content">
            <Link to="/" className="mobile-logo">
              🐾 Sanos y Salvos
            </Link>

            <div className="mobile-topbar-actions">
              <Link to="/coincidencias-recompensas" className="mobile-topbar-btn-match" title="Coincidencias y Premios">
                <LuAward size={22} />
              </Link>

              {isAdmin && (
                <Link to="/dashboard" className="mobile-admin-link" title="Dashboard">
                  <LuLayoutDashboard size={22} />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM NAVBAR */}
        <div className="mobile-navbar">

          {/* IZQUIERDA */}
          <Link to="/map" className="mobile-nav-item">
            <LuMap size={24} />
            <small>Mapa</small>
          </Link>

          {/* BOTÓN CENTRAL */}
          <Link
            to="/ReportPage"
            className="mobile-report-btn"
            onClick={handleReportClick}
          >
            <span ref={plusIconRef} style={{ display: "inline-block" }}>
              <LuPlus size={28} />
            </span>
          </Link>

          {/* DERECHA */}
          <Link to={user ? "/account" : "/login"} className="mobile-nav-item">
            <LuUser size={24} />
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
          <Link to="/coincidencias-recompensas">Coincidencias y Premios</Link>
          {isAdmin && <Link to="/dashboard">Dashboard</Link>}
          <Link to={user ? "/account" : "/login"}>Cuenta</Link>
        </div>

      </div>
    </nav>
  );
}

export default MainNavbar;