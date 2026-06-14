import { describe, it, expect } from "vitest";
import { getMetadataSimilarity, cosineSimilarity } from "./matching";

describe("getMetadataSimilarity", () => {
  it("should return 1.0 for perfect match", () => {
    const r1 = { especie: "perro", color: "negro", raza: "Labrador", tamano: "Grande" };
    const r2 = { especie: "PERRO", color: "negro", raza: "labrador", tamano: "GRANDE" };
    expect(getMetadataSimilarity(r1, r2)).toBe(1.0);
  });

  it("should calculate partial score for partial match", () => {
    const r1 = { especie: "perro", color: "negro blanco", raza: "Poodle", tamano: "Mediano" };
    const r2 = { especie: "perro", color: "blanco", raza: "Poodle", tamano: "Pequeño" };
    
    // Max score: especie (3) + color (2) + raza (2) + tamano (1) = 8
    // Actual: especie matches (3), color partial matches "blanco" (1.5), raza matches (2), tamano mismatch (0) = 6.5
    // Expected: 6.5 / 8 = 0.8125
    expect(getMetadataSimilarity(r1, r2)).toBe(0.8125);
  });

  it("should handle missing properties gracefully", () => {
    const r1 = { especie: "Gato" };
    const r2 = { especie: "Gato" };
    expect(getMetadataSimilarity(r1, r2)).toBe(1.0);
  });

  it("should return 0.0 or low score if species mismatch", () => {
    const r1 = { especie: "perro", raza: "Husky" };
    const r2 = { especie: "gato", raza: "Husky" };
    
    // Max score: especie (3) + raza (2) = 5
    // Actual: especie mismatch (0), raza matches (2) = 2
    // Expected: 2 / 5 = 0.4
    expect(getMetadataSimilarity(r1, r2)).toBe(0.4);
  });

  it("should return default similarity 0.5 if no keys match or inputs are empty", () => {
    expect(getMetadataSimilarity(null, null)).toBe(0.5);
    expect(getMetadataSimilarity({}, {})).toBe(0.5);
  });
});

describe("cosineSimilarity", () => {
  it("should return 1.0 for identical vectors", () => {
    const a = [1, 2, 3];
    const b = [1, 2, 3];
    expect(cosineSimilarity(a, b)).toBeCloseTo(1.0, 5);
  });

  it("should return 0 for orthogonal vectors", () => {
    const a = [1, 0, 0];
    const b = [0, 1, 0];
    expect(cosineSimilarity(a, b)).toBe(0.0);
  });

  it("should return 0 for invalid inputs", () => {
    expect(cosineSimilarity(null, [1, 2])).toBe(0.0);
    expect(cosineSimilarity([1, 2], null)).toBe(0.0);
    expect(cosineSimilarity([1, 2], [1, 2, 3])).toBe(0.0);
    expect(cosineSimilarity([], [])).toBe(0.0);
  });
});
