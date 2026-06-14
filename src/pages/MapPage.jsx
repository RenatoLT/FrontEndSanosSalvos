import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { reportService } from "../api/reportService";
import { api } from "../api/api";

mapboxgl.accessToken = "pk.eyJ1IjoicmVuYXRvbHQiLCJhIjoiY21uZDVnczZzMWNycDJwcTZvN2UzMGNqOCJ9.EnqohwHfWdTwNWOWwDawwQ";

function ReportPhotosCarousel({ photos }) {
  const [current, setCurrent] = useState(0);

  if (!photos || photos.length === 0) {
    return <div className="drawer-no-photo">Sin foto</div>;
  }

  const next = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev + 1) % photos.length);
  };

  const prev = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  return (
    <div className="drawer-carousel">
      <div
        className="drawer-carousel-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {photos.map((photo, index) => (
          <div key={index} className="drawer-carousel-slide">
            <img src={photo} alt={`mascota-${index}`} />
          </div>
        ))}
      </div>
      {photos.length > 1 && (
        <>
          <button className="drawer-carousel-btn prev" onClick={prev}>
            ‹
          </button>
          <button className="drawer-carousel-btn next" onClick={next}>
            ›
          </button>
          <div className="drawer-carousel-dots">
            {photos.map((_, index) => (
              <span
                key={index}
                className={`drawer-carousel-dot ${index === current ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrent(index);
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MapPage() {
  const [loadingLocation, setLoadingLocation] = useState(false);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!search || search.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(search)}.json?access_token=${mapboxgl.accessToken}&country=cl&autocomplete=true&limit=5`
        );
        const data = await res.json();
        setSuggestions(data.features || []);
      } catch (err) {
        console.error("Error fetching map suggestions:", err);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const [selectedReport, setSelectedReport] = useState(null);
  const [petDetails, setPetDetails] = useState(null);
  const [sheetHeight, setSheetHeight] = useState(280);
  const [sheetState, setSheetState] = useState("closed");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    if (!selectedReport || !selectedReport.mascotaId) {
      setPetDetails(null);
      return;
    }

    const fetchPetDetails = async () => {
      try {
        const data = await api.get(`/mascotas/${selectedReport.mascotaId}`);
        setPetDetails(data);
      } catch (err) {
        console.error("Error fetching pet details:", err);
        setPetDetails(null);
      }
    };

    fetchPetDetails();
  }, [selectedReport]);

  const startY = useRef(0);
  const startHeight = useRef(0);
  const isDragging = useRef(false);
  const hasMoved = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    startHeight.current = sheetHeight;
    isDragging.current = true;
    hasMoved.current = false;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const deltaY = startY.current - e.touches[0].clientY;
    if (Math.abs(deltaY) > 5) {
      hasMoved.current = true;
      setSheetState("dragging");
      const newHeight = startHeight.current + deltaY;
      const maxHeight = window.innerHeight * 0.85;
      const minHeight = 80;
      if (newHeight >= minHeight && newHeight <= maxHeight) {
        setSheetHeight(newHeight);
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    if (!hasMoved.current) {
      if (sheetState === "minimized" || sheetHeight <= 280) {
        setSheetState("expanded");
        setSheetHeight(window.innerHeight * 0.8);
      } else {
        setSheetState("minimized");
        setSheetHeight(280);
      }
      return;
    }

    const maxHeight = window.innerHeight * 0.8;
    if (sheetHeight > window.innerHeight * 0.5) {
      setSheetState("expanded");
      setSheetHeight(maxHeight);
    } else if (sheetHeight < 160) {
      setSheetState("closed");
      setSelectedReport(null);
    } else {
      setSheetState("minimized");
      setSheetHeight(280);
    }
  };

  const getReportPhotos = (r) => {
    if (r.urlsFotos && r.urlsFotos.length > 0) {
      return r.urlsFotos;
    }
    const photos = [];
    if (r.imagenUrl) photos.push(r.imagenUrl);

    if (r.especie?.toUpperCase() === "GATO") {
      photos.push("https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600");
      photos.push("https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=600");
    } else {
      photos.push("https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600");
      photos.push("https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=600");
    }
    return photos;
  };

  const drawerStyle = isMobile && selectedReport
    ? { height: `${sheetHeight}px` }
    : {};

  const formatFecha = (fecha) => {
    if (!fecha) return "No especificado";

    const date = new Date(fecha);

    return date.toLocaleString("es-CL", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleLocate = () => {

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {

        const lng = position.coords.longitude;
        const lat = position.coords.latitude;

        map.current.flyTo({
          center: [lng, lat],
          zoom: 14
        });

        setLoadingLocation(false);
      },
      (error) => {
        console.error(error);
        setLoadingLocation(false);
      }
    );
  };

  const searchLocation = async (query) => {
    if (!query) return;

    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&country=cl`
      );

      const data = await res.json();

      if (data.features?.length > 0) {
        const [lng, lat] = data.features[0].center;

        map.current.flyTo({
          center: [lng, lat],
          zoom: 14
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await reportService.getAll();
        const activos = data.filter(r => r.estado === "ACTIVO");
        setReports(activos);
      } catch (err) {
        console.error(err);
      }
    };

    loadReports();
  }, []);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-70.6693, -33.4489],
      zoom: 12
    });

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: false,
      showUserHeading: false
    });

    map.current.addControl(geolocate);

    map.current.on("load", () => {

      handleLocate();

      geolocate.trigger();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {

            const lng = position.coords.longitude;
            const lat = position.coords.latitude;

            map.current.flyTo({
              center: [lng, lat],
              zoom: 14
            });

          },
          (error) => {
            console.error("Error obteniendo ubicación:", error);
          }
        );
      }

    });

    map.current.on("click", () => {
      setSelectedReport(null);
      setSheetState("closed");
    });

  }, []);

  useEffect(() => {
    if (!map.current || reports.length === 0) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    reports.forEach((r) => {
      if (!r.latitud || !r.longitud) return;

      const el = document.createElement("div");
      el.className = "custom-marker";

      const markerPhoto = (r.urlsFotos && r.urlsFotos.length > 0) ? r.urlsFotos[0] : (r.imagenUrl || 'https://via.placeholder.com/60');
      el.innerHTML = `
        <div class="marker-card">
          <img src="${markerPhoto}" />
        </div>
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([r.longitud, r.latitud])
        .addTo(map.current);

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        setSelectedReport(r);
        setSheetHeight(280);
        setSheetState("minimized");

        map.current.flyTo({
          center: [r.longitud, r.latitud],
          zoom: 14,
          essential: true
        });
      });

      markersRef.current.push(marker);
    });

  }, [reports]);

  return (
    <div className="map-page">

      <div className="map-search-bar">
        <input
          type="text"
          placeholder="Buscar ubicación..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchLocation(search);
              setSuggestions([]);
            }
          }}
        />
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((s) => (
              <li
                key={s.id}
                onClick={() => {
                  setSearch(s.place_name);
                  setSuggestions([]);
                  const [lng, lat] = s.center;
                  map.current.flyTo({
                    center: [lng, lat],
                    zoom: 14
                  });
                }}
              >
                {s.place_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div
        className={`location-button ${loadingLocation ? "loading" : ""}`}
        onClick={handleLocate}
      >
        📍
      </div>

      <div
        ref={mapContainer}
        className="map-container"
      />

      {selectedReport && (
        <div
          className={`report-drawer ${isMobile ? "mobile" : "desktop"} ${sheetState}`}
          style={drawerStyle}
        >
          {isMobile && (
            <div
              className="drawer-handle-container"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="drawer-handle-bar" />
            </div>
          )}

          <div className="drawer-header">
            <div className="drawer-title-row">
              <h3>{selectedReport.nombreMascota || "Sin nombre"}</h3>
              <span className={`drawer-badge ${selectedReport.tipo.toLowerCase()}`}>
                {selectedReport.tipo}
              </span>
            </div>
            <button
              className="drawer-close-btn"
              onClick={() => {
                setSelectedReport(null);
                setSheetState("closed");
              }}
            >
              ✕
            </button>
          </div>

          <div className="drawer-body">
            <ReportPhotosCarousel photos={getReportPhotos(selectedReport)} />

            <div className="drawer-details">
              <div className="detail-item">
                <strong>Especie:</strong>
                <span>{petDetails?.especie || selectedReport.especie || "No especificada"}</span>
              </div>
              <div className="detail-item">
                <strong>Raza:</strong>
                <span>{petDetails?.raza || selectedReport.raza || selectedReport.razaMascota || "No especificada"}</span>
              </div>
              <div className="detail-item">
                <strong>Color:</strong>
                <span>{petDetails?.color || selectedReport.color || "No especificado"}</span>
              </div>
              <div className="detail-item">
                <strong>Tamaño:</strong>
                <span>{petDetails?.tamano || petDetails?.tamaño || selectedReport.tamano || "No especificado"}</span>
              </div>
              <div className="detail-item">
                <strong>Género:</strong>
                <span>{petDetails?.sexo || petDetails?.genero || selectedReport.sexo || "No especificado"}</span>
              </div>
              <div className="detail-item">
                <strong>Chip:</strong>
                <span>
                  {(() => {
                    const chipCode = petDetails?.chip || petDetails?.chipMascota || selectedReport.chipMascota;
                    if (!chipCode || chipCode.toUpperCase().startsWith("SR-")) {
                      return "Sin registro";
                    }
                    return `Sí (${chipCode})`;
                  })()}
                </span>
              </div>
              <div className="detail-item">
                <strong>Fecha:</strong>
                <span>{formatFecha(selectedReport.fecha)}</span>
              </div>

              {selectedReport.descripcion && (
                <div className="detail-description">
                  <strong>Detalles:</strong>
                  <p>{selectedReport.descripcion}</p>
                </div>
              )}

              <div className="detail-contact">
                <strong>Reportado por:</strong>
                <span>{selectedReport.nombreContacto || "Anónimo"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MapPage;