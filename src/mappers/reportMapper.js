export const mapReport = (r) => ({
  id: r.idReporte,
  tipo: r.tipo,
  estado: r.estado,
  descripcion: r.descripcion,
  ubicacion: `${r.latitud}, ${r.longitud}`,
  mascota: r.nombreMascota || "Sin nombre",
  raza: r.razaMascota || "Desconocida",
  contacto: r.nombreContacto || "Anónimo"
});