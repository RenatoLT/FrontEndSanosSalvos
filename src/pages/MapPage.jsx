import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = "pk.eyJ1IjoicmVuYXRvbHQiLCJhIjoiY21uZDVnczZzMWNycDJwcTZvN2UzMGNqOCJ9.EnqohwHfWdTwNWOWwDawwQ";

function MapPage() {
  const [loadingLocation, setLoadingLocation] = useState(false);
  const mapContainer = useRef(null);
  const map = useRef(null);

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

  return (
    <div className="map-page">

      <div className="map-search-bar">
        <input
          type="text"
          placeholder="Buscar ubicación..."
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