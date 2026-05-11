import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { reportService } from "../api/reportService";

mapboxgl.accessToken = "pk.eyJ1IjoicmVuYXRvbHQiLCJhIjoiY21uZDVnczZzMWNycDJwcTZvN2UzMGNqOCJ9.EnqohwHfWdTwNWOWwDawwQ";

function MapPage() {
  const [loadingLocation, setLoadingLocation] = useState(false);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const markersRef = useRef([]);

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

  }, []);

  useEffect(() => {
    if (!map.current || reports.length === 0) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    reports.forEach((r) => {
      if (!r.latitud || !r.longitud) return;

      const el = document.createElement("div");
        el.className = "custom-marker";

        el.innerHTML = `
          <div class="marker-card">
            <img src="${r.imagenUrl || 'https://via.placeholder.com/60'}" />
          </div>
        `;
      const fechaFormato = formatFecha(r.fecha);
      const marker = new mapboxgl.Marker(el)
        .setLngLat([r.longitud, r.latitud])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="popup-card">
              <img src="${r.imagenUrl || 'https://via.placeholder.com/200'}" />
              <h3>${r.nombreMascota || "Sin nombre"}</h3>
              <p><strong>Tipo:</strong> ${r.tipo}</p>
              <p><strong>Raza:</strong> ${r.razaMascota || "No especificada"}</p>
              <p><strong>Fecha:</strong> ${fechaFormato || "No especificado"}</p>
              <p><strong>Detalles:</strong> ${r.descripcion || ""}</p>
            </div>
          `)
        )
        .addTo(map.current);

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
            }
          }}
        />
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
    </div>
  );
}

export default MapPage;