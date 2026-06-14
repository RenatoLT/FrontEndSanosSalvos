import { useEffect, useState, useRef } from "react";
import { reportService } from "../api/reportService";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { cosineSimilarity, getMetadataSimilarity } from "../utils/matching";
import "../assets/css/MatchesRewardsPage.css";

function MatchesRewardsPage() {
  const [activeTab, setActiveTab] = useState("matches");
  const [loading, setLoading] = useState(true);
  const [modelLoading, setModelLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [matches, setMatches] = useState([]);
  const [userSeenCount, setUserSeenCount] = useState(0);
  const [copiedCode, setCopiedCode] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const modelRef = useRef(null);
  const embeddingsCache = useRef({});

  // 1. Cargar Reportes y Modelo
  useEffect(() => {
    let active = true;

    async function init() {
      try {
        // Cargar reportes
        const allReports = await reportService.getAll();
        const activeReports = allReports.filter((r) => r.estado === "ACTIVO");

        // Obtener usuario actual para contar reportes avistados
        const loggedUser = JSON.parse(localStorage.getItem("user"));
        if (loggedUser) {
          setCurrentUser(loggedUser);
          // Filtrar reportes creados por el usuario que sean de tipo AVISTADA
          const ownSeen = activeReports.filter(
            (r) =>
              (r.usuarioId === loggedUser.idUsuario || r.nombreContacto === loggedUser.nombre) &&
              r.tipo === "AVISTADA"
          );
          setUserSeenCount(ownSeen.length);
        }

        if (active) {
          setReports(activeReports);
        }

        // Inicializar TensorFlow y MobileNet
        await tf.ready();
        const net = await mobilenet.load({
          version: 1,
          alpha: 1.0,
        });
        modelRef.current = net;

        if (active) {
          setModelLoading(false);
        }
      } catch (err) {
        console.error("Error inicializando página o modelo:", err);
        if (active) {
          setModelLoading(false);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      active = false;
    };
  }, []);

  // 2. Calcular Coincidencias cuando cambien los reportes o termine de cargar el modelo
  useEffect(() => {
    if (reports.length === 0) return;

    async function calculateAllMatches() {
      const loggedUser = JSON.parse(localStorage.getItem("user"));
      const lostReports = reports.filter((r) => r.tipo === "PERDIDO");
      const seenReports = reports.filter((r) => r.tipo === "AVISTADA");
      const computedMatches = [];

      for (const lost of lostReports) {
        for (const seen of seenReports) {
          // Si son de distinta especie, no son coincidencia viable (filtro inicial)
          if (
            lost.especie &&
            seen.especie &&
            lost.especie.toUpperCase() !== seen.especie.toUpperCase()
          ) {
            continue;
          }

          // No comparar dos reportes del mismo usuario
          const isSameOwner =
            (lost.usuarioId && seen.usuarioId && lost.usuarioId === seen.usuarioId) ||
            (lost.nombreContacto && seen.nombreContacto && lost.nombreContacto.trim().toLowerCase() === seen.nombreContacto.trim().toLowerCase());

          if (isSameOwner) {
            continue;
          }

          // Filtrar para mostrar solo coincidencias donde el usuario esté involucrado
          const isUserInvolved = loggedUser && (
            lost.usuarioId === loggedUser.idUsuario ||
            lost.nombreContacto === loggedUser.nombre ||
            seen.usuarioId === loggedUser.idUsuario ||
            seen.nombreContacto === loggedUser.nombre
          );

          if (!isUserInvolved) {
            continue;
          }

          // Similitud de metadatos (Base: especie, color, raza, tamaño)
          const metaSim = getMetadataSimilarity(lost, seen);
          let imgSim = 0.5;
          let hasImageSim = false;

          const lostImg = (lost.urlsFotos && lost.urlsFotos.length > 0) ? lost.urlsFotos[0] : lost.imagenUrl;
          const seenImg = (seen.urlsFotos && seen.urlsFotos.length > 0) ? seen.urlsFotos[0] : seen.imagenUrl;

          // Intentar obtener similitud con MobileNet si hay fotos y el modelo está listo
          if (modelRef.current && lostImg && seenImg) {
            try {
              const embLost = await getOrComputeEmbedding(lost.idReporte || lost.id, lostImg);
              const embSeen = await getOrComputeEmbedding(seen.idReporte || seen.id, seenImg);
              imgSim = cosineSimilarity(embLost, embSeen);
              hasImageSim = true;
            } catch (e) {
              // Si falla CORS o carga de imagen, no usamos similitud de imagen
              console.warn("Fallo en cálculo vectorial de imagen:", e.message);
            }
          }

          // Puntuación combinada
          const finalScore = hasImageSim
            ? 0.3 * metaSim + 0.7 * imgSim
            : metaSim;

          // Mostrar si la similitud supera el 75%
          if (finalScore >= 0.75) {
            computedMatches.push({
              lost,
              seen,
              score: finalScore,
              metaScore: metaSim,
              imgScore: hasImageSim ? imgSim : null,
              method: hasImageSim ? "Reconocimiento vectorial + datos" : "Coincidencia de datos",
            });
          }
        }
      }

      // Ordenar por puntaje descendente
      computedMatches.sort((a, b) => b.score - a.score);
      setMatches(computedMatches);
    }

    calculateAllMatches();
  }, [reports, modelLoading]);

  // Funciones de apoyo para cálculo de similitudes
  async function getOrComputeEmbedding(id, url) {
    if (embeddingsCache.current[id]) {
      return embeddingsCache.current[id];
    }
    const emb = await extractEmbedding(url);
    embeddingsCache.current[id] = emb;
    return emb;
  }

  function extractEmbedding(imgUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imgUrl;
      img.onload = () => {
        try {
          if (!modelRef.current) {
            reject(new Error("Modelo no cargado"));
            return;
          }
          const activation = modelRef.current.infer(img, true);
          const embedding = activation.dataSync();
          activation.dispose();
          resolve(Array.from(embedding));
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = (e) => reject(new Error("Error de red o CORS en la imagen"));
    });
  }



  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  // Listado de cupones
  const coupons = [
    {
      id: 1,
      required: 1,
      discount: "10% OFF",
      title: "Descuento MascotaFeliz",
      desc: "Válido en toda la tienda en línea de productos y accesorios.",
      code: "SANOS10",
    },
    {
      id: 2,
      required: 2,
      discount: "20% OFF",
      title: "Alimentos Premium",
      desc: "Descuento en sacos de alimento y snacks seleccionados para perro y gato.",
      code: "SANOSPRO20",
    },
    {
      id: 3,
      required: 3,
      discount: "GRATIS",
      title: "Consulta Veterinaria",
      desc: "Una consulta general completamente gratuita en clínicas VetSalud.",
      code: "VETGRATISSANOS",
    },
  ];

  return (
    <div className="matches-rewards-container">
      <div className="matches-rewards-header">
        <h1>Coincidencias y Recompensas</h1>
        <p>Encuentra conexiones inteligentes de mascotas y obtén beneficios por tu ayuda.</p>
      </div>

      <div className="tab-selector">
        <button
          className={`tab-btn ${activeTab === "matches" ? "active" : ""}`}
          onClick={() => setActiveTab("matches")}
        >
          🔍 Posibles Coincidencias
        </button>
        <button
          className={`tab-btn ${activeTab === "rewards" ? "active" : ""}`}
          onClick={() => setActiveTab("rewards")}
        >
          🏆 Recompensas
        </button>
      </div>

      {loading ? (
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Cargando información y configurando sistema inteligente...</p>
        </div>
      ) : activeTab === "matches" ? (
        // PESTAÑA COINCIDENCIAS
        <div>
          {modelLoading && (
            <div
              style={{
                background: "#f0f7ff",
                border: "1px solid #b3d7ff",
                padding: "10px 15px",
                borderRadius: "10px",
                marginBottom: "20px",
                fontSize: "14px",
                color: "#0056b3",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span>🤖</span> Cargando motor de reconocimiento vectorial MobileNet para fotos... (mientras tanto se usa coincidencia de datos).
            </div>
          )}

          {matches.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🐕💨</div>
              <h3>No se encontraron posibles coincidencias</h3>
              <p>Por ahora no hay reportes de perdidos y avistamientos con alto nivel de coincidencia.</p>
            </div>
          ) : (
            <div className="matches-grid">
              {matches.map((item, idx) => {
                const percentage = Math.round(item.score * 100);
                return (
                  <div key={idx} className="match-pair-card">
                    <div className="match-score-bar">
                      <span>Similitud estimada</span>
                      <span className="match-percentage">{percentage}%</span>
                    </div>

                    <div className="match-side-by-side">
                      {/* PERDIDO */}
                      <div className="match-half">
                        <span className="match-label-badge perdido">Perdida</span>
                        <img
                          src={(item.lost.urlsFotos && item.lost.urlsFotos.length > 0) ? item.lost.urlsFotos[0] : (item.lost.imagenUrl || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600")}
                          alt="Perdida"
                          className="match-pet-img"
                        />
                        <div className="match-details">
                          <h4>{item.lost.nombreMascota || "Sin Nombre"}</h4>
                          <div className="match-meta-list">
                            <span className="match-meta-tag">📊 Datos: {Math.round(item.metaScore * 100)}%</span>
                            <span className="match-meta-tag">📷 Foto: {item.imgScore !== null ? Math.round(item.imgScore * 100) + "%" : "N/A"}</span>
                          </div>
                          {item.lost.descripcion && (
                            <p className="match-desc"><strong>Detalles:</strong> {item.lost.descripcion}</p>
                          )}
                          <p className="match-desc">
                            <strong>Contacto:</strong> {item.lost.nombreContacto || "Anónimo"}
                            {item.lost.telefonoContacto && currentUser && (item.lost.usuarioId !== currentUser.idUsuario && item.lost.nombreContacto !== currentUser.nombre) && (
                              <a href={`tel:${item.lost.telefonoContacto}`} className="match-phone-btn">
                                📞 Llamar
                              </a>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* AVISTADA */}
                      <div className="match-half">
                        <span className="match-label-badge avistada">Avistada</span>
                        <img
                          src={(item.seen.urlsFotos && item.seen.urlsFotos.length > 0) ? item.seen.urlsFotos[0] : (item.seen.imagenUrl || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600")}
                          alt="Avistada"
                          className="match-pet-img"
                        />
                        <div className="match-details">
                          <h4>Avistamiento</h4>
                          <div className="match-meta-list">
                            <span className="match-meta-tag">📊 Datos: {Math.round(item.metaScore * 100)}%</span>
                            <span className="match-meta-tag">📷 Foto: {item.imgScore !== null ? Math.round(item.imgScore * 100) + "%" : "N/A"}</span>
                          </div>
                          {item.seen.descripcion && (
                            <p className="match-desc"><strong>Detalles:</strong> {item.seen.descripcion}</p>
                          )}
                          <p className="match-desc">
                            <strong>Contacto:</strong> {item.seen.nombreContacto || "Anónimo"}
                            {item.seen.telefonoContacto && currentUser && (item.seen.usuarioId !== currentUser.idUsuario && item.seen.nombreContacto !== currentUser.nombre) && (
                              <a href={`tel:${item.seen.telefonoContacto}`} className="match-phone-btn">
                                📞 Llamar
                              </a>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        // PESTAÑA RECOMPENSAS
        <div>
          <div className="rewards-stats-card">
            <h3>Tus Aportes a la Comunidad</h3>
            <div className="rewards-counter">
              {userSeenCount} <span>reportes de mascotas avistadas publicados</span>
            </div>

            <div className="rewards-progress-wrapper">
              {/* Barra de progreso hacia el siguiente nivel (max 30) */}
              <div className="rewards-progress-bar-bg">
                <div
                  className="rewards-progress-bar-fill"
                  style={{ width: `${Math.min((userSeenCount / 30) * 100, 100)}%` }}
                ></div>
              </div>
              <span className="rewards-progress-text">
                {userSeenCount >= 30
                  ? "¡Has alcanzado el nivel máximo de recompensas! Gracias por tu gran apoyo."
                  : `Publica ${30 - userSeenCount} reportes más de avistamiento para desbloquear la máxima recompensa.`}
              </span>
            </div>
          </div>

          <div className="coupons-grid">
            {coupons.map((coupon) => {
              const isUnlocked = userSeenCount >= coupon.required;
              return (
                <div key={coupon.id} className={`coupon-card ${isUnlocked ? "" : "locked"}`}>
                  <div>
                    <div className="coupon-header">
                      <span className={`coupon-discount ${isUnlocked ? "unlocked" : "locked"}`}>
                        {coupon.discount}
                      </span>
                      <span className={`coupon-badge ${isUnlocked ? "" : "locked"}`}>
                        {isUnlocked ? "Desbloqueado" : `Requiere ${coupon.required} reporte(s)`}
                      </span>
                    </div>

                    <h4 className="coupon-title">{coupon.title}</h4>
                    <p className="coupon-description">{coupon.desc}</p>
                  </div>

                  <div className="coupon-action-area">
                    {isUnlocked ? (
                      <div className="coupon-code-container">
                        <div className="coupon-code-box">{coupon.code}</div>
                        <button
                          className={`coupon-copy-btn ${copiedCode === coupon.code ? "copied" : ""}`}
                          onClick={() => handleCopyCode(coupon.code)}
                        >
                          {copiedCode === coupon.code ? "Copiado ✓" : "Copiar"}
                        </button>
                      </div>
                    ) : (
                      <div className="locked-overlay">
                        <span className="locked-icon">🔒</span>
                        <span>Sigue publicando avistamientos para desbloquear este cupón.</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default MatchesRewardsPage;
