import { useState, useEffect, useRef  } from "react";
import { useNavigate } from "react-router-dom";


function Carousel() {
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  const slides = [
		{
			image: "https://images.unsplash.com/photo-1558788353-f76d92427f16",
			title: "Reencuentros felices 🐶",
			text: "Ayuda a reunir mascotas",
			link: "/dashboard"
		},
		{
			image: "https://images.unsplash.com/photo-1601758123927-196f1f4d6e8f",
			title: "Reporta fácilmente 📍",
			text: "Publica mascotas",
			link: "/map"
		},
		{
			image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d",
			title: "Usa el mapa 🗺️",
			text: "Encuentra mascotas",
			link: "/map"
		}
	];

  const [current, setCurrent] = useState(0);

  const startAutoPlay = () => {
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
  };

  useEffect(() => {
    startAutoPlay();
    return () => clearInterval(intervalRef.current);
  }, []);

  const next = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
    startAutoPlay(); 
  };

  const prev = () => {
    setCurrent((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
    startAutoPlay(); 
  };

  return (
    <div className="carousel"
      onMouseEnter={() => clearInterval(intervalRef.current)}
      onMouseLeave={startAutoPlay}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
       <div
					key={index}
					className={`carousel-slide ${index === current ? "active" : ""}`}
					style={{ backgroundImage: `url(${slide.image})` }}
					onClick={() => navigate(slide.link)}
				>
          <div className="carousel-overlay">
            <h2>{slide.title}</h2>
            <p>{slide.text}</p>
          </div>
        </div>
      ))}

      {/* Botones */}
      <button className="carousel-btn prev" onClick={prev}>
        ‹
      </button>
      <button className="carousel-btn next" onClick={next}>
        ›
      </button>

      {/* Dots */}
      <div className="carousel-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={index === current ? "active" : ""}
            onClick={() => {
							setCurrent(index);
							startAutoPlay();
}}
          />
        ))}
      </div>

    </div>
  );
}

export default Carousel;