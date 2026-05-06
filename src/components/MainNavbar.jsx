// components/MainNavbar.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MainNavbar() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    // 📱 NAVBAR MOBILE
    return (
      <div className="mobile-navbar">
        <Link to="/">🏠</Link>
        <Link to="/map">🗺️</Link>
        <Link to="/dashboard">📋</Link>
      </div>
    );
  }

  // 💻 NAVBAR DESKTOP
  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container">
        <span className="navbar-brand">🐾 PetFinder</span>

        <div>
          <Link className="btn btn-outline-light me-2" to="/">Inicio</Link>
          <Link className="btn btn-outline-light me-2" to="/map">Mapa</Link>
          <Link className="btn btn-outline-light" to="/dashboard">Dashboard</Link>
        </div>
      </div>
    </nav>
  );
}

export default MainNavbar;