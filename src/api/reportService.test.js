import { describe, it, expect } from "vitest";
import { cleanUrl, cleanReport } from "./reportService";

describe("cleanUrl", () => {
  it("should strip the local API base URL prefix from photo URLs", () => {
    const originalUrl = "http://localhost:8090/api/bff/reportes/fotos/dog123.jpg";
    expect(cleanUrl(originalUrl)).toBe("dog123.jpg");
  });

  it("should return the original URL if prefix is not present", () => {
    const externalUrl = "https://images.unsplash.com/photo-1543466835";
    expect(cleanUrl(externalUrl)).toBe(externalUrl);
  });

  it("should return falsy value if input is falsy", () => {
    expect(cleanUrl(null)).toBeNull();
    expect(cleanUrl(undefined)).toBeUndefined();
    expect(cleanUrl("")).toBe("");
  });
});

describe("cleanReport", () => {
  it("should clean all photo URLs and single photo URL in report structure", () => {
    const rawReport = {
      idReporte: 10,
      tipo: "PERDIDO",
      imagenUrl: "http://localhost:8090/api/bff/reportes/fotos/main.png",
      urlsFotos: [
        "http://localhost:8090/api/bff/reportes/fotos/photo1.jpg",
        "https://otherdomain.com/photo2.jpg"
      ]
    };

    const cleaned = cleanReport(rawReport);

    expect(cleaned.imagenUrl).toBe("main.png");
    expect(cleaned.urlsFotos).toEqual(["photo1.jpg", "https://otherdomain.com/photo2.jpg"]);
  });

  it("should return the same object if urlsFotos and imagenUrl are not present", () => {
    const rawReport = { idReporte: 12, tipo: "AVISTADA" };
    expect(cleanReport(rawReport)).toEqual({ idReporte: 12, tipo: "AVISTADA" });
  });

  it("should return falsy value safely", () => {
    expect(cleanReport(null)).toBeNull();
  });
});
