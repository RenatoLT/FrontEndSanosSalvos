import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = "pk.eyJ1IjoicmVuYXRvbHQiLCJhIjoiY21uZDVnczZzMWNycDJwcTZvN2UzMGNqOCJ9.EnqohwHfWdTwNWOWwDawwQ";

function MapPage() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-70.6693, -33.4489],
      zoom: 12
    });

    // 📍 Botón de geolocalización (PRO)
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    });

    map.current.addControl(geolocate);

    // 📍 Obtener ubicación automáticamente
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lng = position.coords.longitude;
          const lat = position.coords.latitude;

          // 🎯 Centrar mapa
          map.current.flyTo({
            center: [lng, lat],
            zoom: 14
          });

                // 🔵 Marker usuario (opcional, porque el control ya lo hace)
            //new mapboxgl.Marker({ color: "blue" })
            //.setLngLat([lng, lat])
            //.setPopup(new mapboxgl.Popup().setText("Estás aquí"))
            //.addTo(map.current);
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
          alert("No se pudo obtener tu ubicación");
        }
      );
    }

  }, []);

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <div
        ref={mapContainer}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

export default MapPage;