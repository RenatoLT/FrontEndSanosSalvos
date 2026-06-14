import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mapboxService } from "./mapboxService";

describe("mapboxService", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getSuggestions", () => {
    it("should return list of features from Mapbox Geocoding API", async () => {
      const mockFeatures = [
        { id: "place.1", place_name: "Santiago, Chile" },
        { id: "place.2", place_name: "Valparaíso, Chile" }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ features: mockFeatures })
      });

      const result = await mapboxService.getSuggestions("Santiago", "mock-token");

      expect(fetch).toHaveBeenCalledWith(
        "https://api.mapbox.com/geocoding/v5/mapbox.places/Santiago.json?access_token=mock-token&country=cl&autocomplete=true&limit=5"
      );
      expect(result).toEqual(mockFeatures);
    });

    it("should return empty list if query is empty or token is missing", async () => {
      const res1 = await mapboxService.getSuggestions("", "token");
      const res2 = await mapboxService.getSuggestions("Santiago", "");
      expect(res1).toEqual([]);
      expect(res2).toEqual([]);
      expect(fetch).not.toHaveBeenCalled();
    });

    it("should return empty list and catch error if fetch fails", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401
      });

      const result = await mapboxService.getSuggestions("Santiago", "bad-token");
      expect(result).toEqual([]);
    });
  });

  describe("getAddressFromCoords", () => {
    it("should return first place_name from Mapbox response", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          features: [
            { place_name: "Plaza de Armas, Santiago, Chile" }
          ]
        })
      });

      const address = await mapboxService.getAddressFromCoords(-70.66, -33.44, "mock-token");

      expect(fetch).toHaveBeenCalledWith(
        "https://api.mapbox.com/geocoding/v5/mapbox.places/-70.66,-33.44.json?access_token=mock-token"
      );
      expect(address).toBe("Plaza de Armas, Santiago, Chile");
    });

    it("should return empty string if parameters are missing", async () => {
      const res = await mapboxService.getAddressFromCoords(undefined, -33.44, "token");
      expect(res).toBe("");
      expect(fetch).not.toHaveBeenCalled();
    });

    it("should return empty string if fetch fails", async () => {
      fetch.mockRejectedValueOnce(new Error("Network Error"));

      const res = await mapboxService.getAddressFromCoords(-70.66, -33.44, "mock-token");
      expect(res).toBe("");
    });
  });
});
