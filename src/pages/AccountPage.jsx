import { useNavigate } from "react-router-dom";
import "../assets/css/AccountPage.css";
import { authService } from "../api/authService";
import { useEffect, useState } from "react";
import { userService } from "../api/userService";
import { useAuth } from "../context/AuthContext";

function AccountPage() {
  const navigate = useNavigate();
	const { user, logout } = useAuth();
	
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

          <h2>{user.nombre?.charAt(0).toUpperCase() + user.nombre?.slice(1) + " " + userData?.apellido1?.charAt(0).toUpperCase() + userData?.apellido1?.slice(1).toLowerCase()}</h2>
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

    </div>
  );
}

export default AccountPage;