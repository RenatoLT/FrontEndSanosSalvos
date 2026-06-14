import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import { api } from "../api/api";
import { mapboxService } from "../api/mapboxService";

mapboxgl.accessToken = "pk.eyJ1IjoicmVuYXRvbHQiLCJhIjoiY21uZDVnczZzMWNycDJwcTZvN2UzMGNqOCJ9.EnqohwHfWdTwNWOWwDawwQ";

function ReportPage() {
  const navigate = useNavigate();
  const [type, setType] = useState("lost");
  const [address, setAddress] = useState("");
  const [isUserTyping, setIsUserTyping] = useState(false);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [hasCollar, setHasCollar] = useState(null);
  const [collarColor, setCollarColor] = useState("");
  const [hasChip, setHasChip] = useState(null);
  const [especie, setEspecie] = useState("");
  const [raza, setRaza] = useState("");
  const [sexo, setSexo] = useState("");
  const [tamano, setTamano] = useState("");
  const [color, setColor] = useState("");
  const [nombreMascota, setNombreMascota] = useState("");
  const [chipValue, setChipValue] = useState("");
  const [error, setError] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map((file) => ({
      file,
      id: Math.random().toString(36).substring(2, 9) + Date.now(),
      url: URL.createObjectURL(file)
    }));
    setSelectedPhotos((prev) => [...prev, ...newPhotos]);
  };

  const removePhoto = (id, url) => {
    URL.revokeObjectURL(url);
    setSelectedPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  useEffect(() => {
    return () => {
      selectedPhotos.forEach((photo) => URL.revokeObjectURL(photo.url));
    };
  }, []);


  const mapTamano = {
    "Pequeño": "PEQUEÑO",
    "Mediano": "MEDIANO",
    "Grande": "GRANDE"
  };

  const mapTipo = {
    "lost": "PERDIDO",
    "seen": "AVISTADA"
  };

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-70.6693, -33.4489], // fallback
      zoom: 13
    });

    marker.current = new mapboxgl.Marker({
      draggable: true
    })
      .setLngLat([-70.6693, -33.4489])
      .addTo(map.current);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lng = position.coords.longitude;
          const lat = position.coords.latitude;

          // Mover mapa
          map.current.flyTo({
            center: [lng, lat],
            zoom: 15
          });

          // Mover marcador
          marker.current.setLngLat([lng, lat]);
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
        }
      );
    }

    marker.current.on("dragend", async () => {
      const lngLat = marker.current.getLngLat();
      const placeName = await mapboxService.getAddressFromCoords(lngLat.lng, lngLat.lat, mapboxgl.accessToken);
      if (placeName) {
        setAddress(placeName);
      }
    });

  }, []);

  const handleSubmit = async () => {
    setError("");

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.idUsuario) {
      return setError("Usuario no autenticado");
    }

    if (!address) {
      return setError("Debes ingresar una dirección");
    }

    if (!especie) {
      return setError("Debes seleccionar una especie");
    }

    if (!color) {
      return setError("Debes ingresar el color de la mascota");
    }

    if (!raza || !raza.trim()) {
      return setError("Debes ingresar la raza");
    }

    if (!tamano) {
      return setError("Debes seleccionar el tamaño");
    }

    if (type === "lost") {
      if (!nombreMascota) {
        return setError("Debes ingresar el nombre de la mascota");
      }

      if (!sexo) {
        return setError("Debes seleccionar el género");
      }
    }

    if (hasChip === "yes" && !chipValue.trim()) {
      return setError("Debes ingresar el número de chip");
    }

    try {
      const lngLat = marker.current.getLngLat();

      const data = {
        mascotaId: null,

        tipo: mapTipo[type],
        descripcion: description,

        latitud: lngLat.lat,
        longitud: lngLat.lng,

        especie: especie.toUpperCase(),
        color,

        nombreMascota: type === "lost" ? nombreMascota : "SIN_NOMBRE",

        tamaño: mapTamano[tamano],

        raza: raza || "",
        sexo: sexo ? sexo.toUpperCase() : "",
        chipMascota: hasChip === "yes" ? chipValue : ""
      };

      const formData = new FormData();

      // JSON como string (IMPORTANTE)
      formData.append("datos", JSON.stringify(data));

      // archivos
      selectedPhotos.forEach((photo) => {
        formData.append("fotos", photo.file);
      });

      const res = await api.post("/reportes/integral", formData, true);

      console.log("Reporte creado:", res);

      setError(""); // limpiar error si todo sale bien
      navigate("/map");

    } catch (err) {
      console.error(err);

      if (err.message?.includes("chip")) {
        setError("Ya existe una mascota con ese chip");
      } else {
        setError("Error al publicar el reporte");
      }
    }
  };

  useEffect(() => {
    if (!isUserTyping || !address || address.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const features = await mapboxService.getSuggestions(address, mapboxgl.accessToken);
      setSuggestions(features);
    }, 400);

    return () => clearTimeout(timeout);
  }, [address, isUserTyping]);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-70.6693, -33.4489],
      zoom: 13
    });

    marker.current = new mapboxgl.Marker({
      draggable: true
    })
      .setLngLat([-70.6693, -33.4489])
      .addTo(map.current);

    // mover marcador → actualizar dirección (simple coords)
    marker.current.on("dragend", async () => {
      const lngLat = marker.current.getLngLat();

      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.lng},${lngLat.lat}.json?access_token=${mapboxgl.accessToken}`
      );

      const data = await res.json();

      if (data.features && data.features.length > 0) {
        setIsUserTyping(false);
        setAddress(data.features[0].place_name);
      }
    });

  }, []);

  return (
    <div className="report-page">

      {/* SELECTOR */}
      <div className="report-tabs">
        <button
          className={type === "lost" ? "active" : ""}
          onClick={() => setType("lost")}
        >
          Mascota Perdida
        </button>

        <button
          className={type === "seen" ? "active" : ""}
          onClick={() => setType("seen")}
        >
          Mascota Avistada
        </button>
      </div>

      {/* FORMU */}
      <div className="report-form">

        {/* SOLO PERDIDA */}
        {type === "lost" && (
          <>
            <input
              placeholder="Nombre de la mascota"
              value={nombreMascota}
              onChange={(e) => setNombreMascota(e.target.value)}
            />

            <select
              value={especie}
              onChange={(e) => setEspecie(e.target.value)}
            >
              <option>Especie</option>
              <option>Perro</option>
              <option>Gato</option>
              <option>Otro</option>
            </select>

            <input
              placeholder="Color de la mascota"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />

            <input
              placeholder="Raza"
              value={raza}
              onChange={(e) => setRaza(e.target.value)}
            />

            <select
              value={tamano}
              onChange={(e) => setTamano(e.target.value)}
            >
              <option>Tamaño</option>
              <option>Pequeño</option>
              <option>Mediano</option>
              <option>Grande</option>
            </select>

            <select
              value={sexo}
              onChange={(e) => setSexo(e.target.value)}
            >
              <option>Género</option>
              <option>Macho</option>
              <option>Hembra</option>
            </select>

            <select
              value={hasChip ?? ""}
              onChange={(e) => setHasChip(e.target.value)}
            >
              <option value="">¿Tiene chip?</option>
              <option value="yes">Sí</option>
              <option value="no">No</option>
            </select>

            {hasChip === "yes" && (
              <input
                placeholder="Número de chip"
                value={chipValue}
                onChange={(e) => setChipValue(e.target.value)}
              />
            )}
          </>
        )}

        {/* AVISTADA */}
        {type === "seen" && (
          <>
            <select
              value={especie}
              onChange={(e) => setEspecie(e.target.value)}
            >
              <option>Especie</option>
              <option>Perro</option>
              <option>Gato</option>
              <option>Otro</option>
            </select>

            <input
              placeholder="Color de la mascota"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />

            <select value={sexo} onChange={(e) => setSexo(e.target.value)}>
              <option value="">Género</option>
              <option value="MACHO">Macho</option>
              <option value="HEMBRA">Hembra</option>
            </select>

            <input
              placeholder="Raza"
              value={raza}
              onChange={(e) => setRaza(e.target.value)}
            />

            <select
              value={tamano}
              onChange={(e) => setTamano(e.target.value)}
            >
              <option>Tamaño</option>
              <option>Pequeño</option>
              <option>Mediano</option>
              <option>Grande</option>
            </select>
          </>
        )}

        {/* COMÚN */}

        <div className="custom-file-upload">
          <label htmlFor="file-upload" className="file-upload-label">
            <span className="upload-icon">📷</span>
            <span className="upload-text">Seleccionar Fotos de la Mascota</span>
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        {selectedPhotos.length > 0 && (
          <div className="photos-preview-grid">
            {selectedPhotos.map((photo) => (
              <div key={photo.id} className="photo-preview-item">
                <img src={photo.url} alt="Vista previa" />
                <button
                  type="button"
                  className="remove-photo-btn"
                  onClick={() => removePhoto(photo.id, photo.url)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="address-search-container" style={{ position: "relative" }}>
          <input
            placeholder="Dirección (calle + número)"
            value={address}
            onChange={(e) => {
              setIsUserTyping(true);
              setAddress(e.target.value);
            }}
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((s) => (
                <li
                  key={s.id}
                  onClick={() => {
                    setIsUserTyping(false);
                    setAddress(s.place_name);
                    setSuggestions([]);
                    const [lng, lat] = s.center;
                    marker.current.setLngLat([lng, lat]);
                    map.current.flyTo({
                      center: [lng, lat],
                      zoom: 15
                    });
                  }}
                >
                  {s.place_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* MAPA */}
        <div ref={mapContainer} className="report-map" />

        <button className="report-submit" onClick={handleSubmit}>
          Publicar reporte
        </button>

        {error && <p className="form-error">{error}</p>}

      </div>
    </div>
  );
}

export default ReportPage;