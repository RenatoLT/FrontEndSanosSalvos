import { describe, it, expect } from "vitest";
import { mapReport } from "./reportMapper";

describe("mapReport", () => {
  it("should map fields correctly from backend structure", () => {
    const rawReport = {
      idReporte: 42,
      tipo: "PERDIDO",
      estado: "ACTIVO",
      descripcion: "Se busca perro Husky",
      latitud: -33.45,
      longitud: -70.66,
      nombreMascota: "Rocky",
      razaMascota: "Husky",
      nombreContacto: "Renato",
      urlsFotos: ["photo1.jpg"]
    };

    const mapped = mapReport(rawReport);

    expect(mapped).toEqual({
      id: 42,
      tipo: "PERDIDO",
      estado: "ACTIVO",
      descripcion: "Se busca perro Husky",
      latitud: -33.45,
      longitud: -70.66,
      mascota: "Rocky",
      raza: "Husky",
      contacto: "Renato",
      urlsFotos: ["photo1.jpg"]
    });
  });

  it("should fall back to defaults for missing optional fields", () => {
    const rawReport = {
      idReporte: 43,
      tipo: "AVISTADA",
      estado: "ACTIVO",
      descripcion: "Avistamiento en parque",
      latitud: -33.45,
      longitud: -70.66
    };

    const mapped = mapReport(rawReport);

    expect(mapped).toEqual({
      id: 43,
      tipo: "AVISTADA",
      estado: "ACTIVO",
      descripcion: "Avistamiento en parque",
      latitud: -33.45,
      longitud: -70.66,
      mascota: "Sin nombre",
      raza: "Desconocida",
      contacto: "Anónimo",
      urlsFotos: []
    });
  });
});
