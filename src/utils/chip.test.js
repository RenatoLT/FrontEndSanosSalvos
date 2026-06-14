import { describe, it, expect } from "vitest";
import { formatChip } from "./chip";

describe("formatChip", () => {
  it("should return 'Sin registro' for null, undefined, empty, or whitespace inputs", () => {
    expect(formatChip(null)).toBe("Sin registro");
    expect(formatChip(undefined)).toBe("Sin registro");
    expect(formatChip("")).toBe("Sin registro");
    expect(formatChip("   ")).toBe("Sin registro");
  });

  it("should return 'Sin registro' for chip codes starting with 'SR-' (case insensitive)", () => {
    expect(formatChip("SR-12345")).toBe("Sin registro");
    expect(formatChip("sr-abcdef")).toBe("Sin registro");
    expect(formatChip("sR-999")).toBe("Sin registro");
    expect(formatChip("Sr-")).toBe("Sin registro");
  });

  it("should return formatted string with code for valid chip codes", () => {
    expect(formatChip("985121012345678")).toBe("Sí (985121012345678)");
    expect(formatChip("CHIP-999")).toBe("Sí (CHIP-999)");
  });
});
