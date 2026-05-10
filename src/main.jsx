import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'
import "./index.css" 
import "mapbox-gl/dist/mapbox-gl.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./assets/css/carousel.css";
import "./assets/css/navbar.css";
import "./assets/css/MapPage.css";
import "./assets/css/ReportPage.css";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </AuthProvider>
);

