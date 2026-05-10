import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.rol !== "ADMIN") {
    return <Navigate to="/" />;
  }

  return children;
}

export default AdminRoute;