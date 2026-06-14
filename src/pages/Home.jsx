import { Link } from "react-router-dom";
import { useState } from "react";
import Carousel from "../components/Carousel";
import { useAuth } from "../context/AuthContext";
import { LuSearch, LuMegaphone, LuHeart } from "react-icons/lu";
import "../assets/css/Home.css";

function Home() {
  const [open, setOpen] = useState(null);
  const { user } = useAuth();

  const toggle = (index) => {
    setOpen(open === index ? null : index);
  };

  const items = [
    {
      title: "¿Cómo funciona? 🐶",
      content: (
        <>
          <h3><b>Caso de que pierdas una mascota:</b></h3>
          <ol>
            <li>Reporta la pérdida con detalles y fotos en el portal.</li>
            <li>Usa el mapa interactivo para ver avistamientos y reportes cercanos en tiempo real.</li>
            <li>Espera notificaciones de coincidencias inteligentes de imágenes generadas por el sistema.</li>
          </ol>

          <h3><b>Caso de que quieras ayudar:</b></h3>
          <p>
            Si ves a un animal perdido o desorientado en la calle, sácale una foto y regístrala rápidamente ubicando el marcador en el mapa.
          </p>
        </>
      )
    },
    {
      title: "¿Es necesario vivir en Santiago? 📍",
      content: (
        <>
          <b>No necesariamente.</b>
          <p>La plataforma está diseñada para funcionar a nivel nacional.</p>
          <p>Sin embargo, al basarse en la colaboración comunitaria para alimentar los avistamientos en el mapa, su utilidad y efectividad crecen exponencialmente en áreas donde hay más usuarios activos.</p>
        </>
      )
    }
  ];

  return (
    <div className="home-container">

      <section className="home-hero">
        <h1>Encuentra mascotas perdidas 🐾</h1>
        <p>
          La red colaborativa inteligente que ayuda a reunir a las mascotas perdidas con sus familias de forma rápida y gratuita.
        </p>

        <div className="home-buttons">
          <Link to="/map" className="home-btn-primary">
            Ver mapa interactivo
          </Link>

          {user ? (
            <Link to="/ReportPage" className="home-btn-secondary">
              Crear reporte
            </Link>
          ) : (
            <Link to="/register" className="home-btn-secondary">
              Crear cuenta
            </Link>
          )}
        </div>
      </section>

      <section className="home-mission">
        <h3>Nuestra Misión 🤝</h3>
        <p>
          Creemos que la tecnología unida a la comunidad puede hacer la diferencia.
          Sanos y Salvos provee herramientas de geolocalización y cruce de datos para que ningún miembro de cuatro patas se quede lejos de casa.
        </p>
      </section>

      <section className="home-actions">
        <div className="action-card">
          <div className="action-card-icon">
            <LuSearch />
          </div>
          <h5>Buscar</h5>
          <p>Filtra por especie, zona o características y localiza avistamientos activos en el mapa interactivo.</p>
        </div>

        <div className="action-card">
          <div className="action-card-icon">
            <LuMegaphone />
          </div>
          <h5>Reportar</h5>
          <p>Publica fotos e información de mascotas extraviadas o avistadas en la vía pública rápidamente.</p>
        </div>

        <div className="action-card">
          <div className="action-card-icon">
            <LuHeart />
          </div>
          <h5>Ayudar</h5>
          <p>Colabora en las búsquedas locales y mantente atento a las alertas para generar reencuentros felices.</p>
        </div>
      </section>

      <section className="home-carousel">
        <Carousel />
      </section>

      {/* Preguntas frecuentes */}
      <section className="home-how">
        <h4>Preguntas frecuentes</h4>

        <div className="how-dropdown">
          {items.map((item, index) => (
            <div key={index} className="how-item">
              <div
                className="how-title"
                onClick={() => toggle(index)}
              >
                {item.title}
                <span>{open === index ? "−" : "+"}</span>
              </div>

              <div className={`how-content ${open === index ? "open" : ""}`}>
                {item.content}
              </div>

            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default Home;