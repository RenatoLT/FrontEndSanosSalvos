import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import MainNavbar from "./components/MainNavbar";
import { lazy, Suspense } from "react";

const MapPage = lazy(() => import("./pages/MapPage"));
const ReportPage = lazy(() => import("./pages/ReportPage"));

function App() {
  return (
    <>
      <MainNavbar />

      <Suspense fallback={<div>Cargando...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ReportPage" element={<ReportPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;