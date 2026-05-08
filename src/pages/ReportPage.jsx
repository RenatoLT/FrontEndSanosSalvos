import { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = "pk.eyJ1IjoicmVuYXRvbHQiLCJhIjoiY21uZDVnczZzMWNycDJwcTZvN2UzMGNqOCJ9.EnqohwHfWdTwNWOWwDawwQ";

function ReportPage() {
  const [type, setType] = useState("lost");
  const [address, setAddress] = useState("");
	const [isUserTyping, setIsUserTyping] = useState(false);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
	const [hasCollar, setHasCollar] = useState(null);
	const [collarColor, setCollarColor] = useState("");
	const [hasChip, setHasChip] = useState(null);

	const geocodeAddress = async (query) => {
		if (!map.current || !marker.current) return;

		const res = await fetch(
			`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&country=cl`
		);

		const data = await res.json();

		if (data.features?.length > 0) {
			const [lng, lat] = data.features[0].center;

			map.current.flyTo({
				center: [lng, lat],
				zoom: 15
			});

			marker.current.setLngLat([lng, lat]);

			setAddress(data.features[0].place_name);
		}
	};

	useEffect(() => {
		if (!isUserTyping) return;

		const timeout = setTimeout(() => {
			if (address.length > 5) {
				geocodeAddress(address);
				setIsUserTyping(false);
			}
		}, 800);

		return () => clearTimeout(timeout);
	}, [address]);

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
            <input placeholder="Nombre de la mascota" />

						<select>
              <option>Especie</option>
              <option>Perro</option>
              <option>Gato</option>
              <option>Otro</option>
            </select>

            <input placeholder="Raza" />

            <select>
              <option>Tamaño</option>
              <option>Pequeño</option>
              <option>Mediano</option>
              <option>Grande</option>
            </select>

            <select>
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

          </>
        )}

        {/* AVISTADA */}
        {type === "seen" && (
          <>
						<select>
              <option>Especie</option>
              <option>Perro</option>
              <option>Gato</option>
              <option>Otro</option>
            </select>

            <input placeholder="Color de la mascota" />

						 <select>
              <option>Género</option>
              <option>Macho</option>
              <option>Hembra</option>
            </select>
          </>
        )}

        {/* COMÚN */}

				<select
					value={hasCollar ?? ""}
					onChange={(e) => setHasCollar(e.target.value)}
				>
					<option value="">¿Tiene collar?</option>
					<option value="yes">Sí</option>
					<option value="no">No</option>
				</select>

				{/* 🎨 COLOR COLLAR */}
				{hasCollar === "yes" && (
					<input
						placeholder="Color del collar"
						value={collarColor}
						onChange={(e) => setCollarColor(e.target.value)}
					/>
				)}
        <input type="file" multiple />

        <input
					placeholder="Dirección (calle + número)"
					value={address}
					onChange={(e) => {
						setIsUserTyping(true);
						setAddress(e.target.value);
					}}
				/>

        {/* MAPA */}
        <div ref={mapContainer} className="report-map" />

        <button className="report-submit">
          Publicar reporte
        </button>

      </div>
    </div>
  );
}

export default ReportPage;