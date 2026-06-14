export const mapReport = (r) => ({
  id: r.idReporte,
  tipo: r.tipo,
  estado: r.estado,
  descripcion: r.descripcion,
  latitud: r.latitud,
  longitud: r.longitud,
  mascota: r.nombreMascota || "Sin nombre",
  raza: r.razaMascota || "Desconocida",
  contacto: r.nombreContacto || "Anónimo",
  urlsFotos: r.urlsFotos || []
});