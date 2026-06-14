import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import MainNavbar from "./components/MainNavbar";
import AdminRoute from "./components/AdminRoute";
import AccountPage from "./pages/AccountPage";
import { lazy, Suspense } from "react";

const MapPage = lazy(() => import("./pages/MapPage"));
const ReportPage = lazy(() => import("./pages/ReportPage"));
const MatchesRewardsPage = lazy(() => import("./pages/MatchesRewardsPage"));

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
          <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>}/>
          <Route path="/ReportPage" element={<ReportPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/coincidencias-recompensas" element={<MatchesRewardsPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;