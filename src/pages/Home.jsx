import { Link } from "react-router-dom";
import { use, useState } from "react";
import Carousel from "../components/Carousel";
import { useAuth } from "../context/AuthContext";

function Home() {
  const [open, setOpen] = useState(null);
  const {user} = useAuth();

  const toggle = (index) => {
    setOpen(open === index ? null : index);
  };

  const items = [
    {
      title: "Como funciona? 🐶",
      content: (
        <>
          <h3><b>Caso de que pierdas una mascota:</b></h3>
          <ol>
            <li>Reporta la pérdida con detalles y foto</li>
            <li>Usa el mapa para ver reportes cercanos</li>
            <li>Espera coincidencias de las imagenes o busca en las mascotas vistas por tu zona</li>
          </ol>

          <h3><b>Caso de que quieras ayudar:</b></h3>
          <p>
            Cuando veas una mascota, puedes reportarla en el mapa.
          </p>
        </>
      )
    },
    {
      title: "Es Nesario vivir en Santiago?📍",
      content: (
        <>
          <b>No necesariamente</b>
          <p>El proyecto se puede utilizar en cualquier parte del pais,</p>
          <p>pero al ser una aplicacion que requiere que personas la alimenten con informacion local</p>
          <p>es mas util en zonas con mas usuarios activos, como ciudades grandes</p>
        </>
      )
    },
    {
      title: "PREGUNTA FRECUENTE 3",
      content:
        "LOREM IPSUM."
    }
  ];

  return (
    <div className="home-container">

      <section className="home-hero">
        <h1>Encuentra mascotas perdidas 🐾</h1>
        <p>
          Reporta, busca y ayuda a reunir mascotas con sus dueños.
        </p>

        <div className="home-buttons">
          <Link to="/map" className="btn home-btn-primary">
            Ver mapa
          </Link>

          {user ? (
            <Link to="/ReportPage" className="btn home-btn-secondary">
              Crear reporte
            </Link>
          ) : (
            <Link to="/register" className="btn home-btn-secondary">
              Crear cuenta
            </Link>
          )}
        </div>
      </section>

      <section className="home-actions">
        <div className="action-card">
          <h5>🔍 Buscar</h5>
          <p>Explora mascotas perdidas cerca de ti</p>
        </div>

        <div className="action-card">
          <h5>📢 Reportar</h5>
          <p>Publica una mascota perdida o encontrada</p>
        </div>

        <div className="action-card">
          <h5>🤝 Ayudar</h5>
          <p>Conecta reportes y ayuda a reunir familias</p>
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