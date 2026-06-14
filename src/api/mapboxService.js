const MAPBOX_GEOCODING_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places";

export const mapboxService = {
  getSuggestions: async (query, accessToken) => {
    if (!query || !query.trim() || !accessToken) {
      return [];
    }
    try {
      const res = await fetch(
        `${MAPBOX_GEOCODING_URL}/${encodeURIComponent(query)}.json?access_token=${accessToken}&country=cl&autocomplete=true&limit=5`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch suggestions");
      }
      const data = await res.json();
      return data.features || [];
    } catch (err) {
      console.error("Mapbox getSuggestions error:", err);
      return [];
    }
  },

  getAddressFromCoords: async (lng, lat, accessToken) => {
    if (lng === undefined || lat === undefined || !accessToken) {
      return "";
    }
    try {
      const res = await fetch(
        `${MAPBOX_GEOCODING_URL}/${lng},${lat}.json?access_token=${accessToken}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch address from coordinates");
      }
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        return data.features[0].place_name;
      }
      return "";
    } catch (err) {
      console.error("Mapbox getAddressFromCoords error:", err);
      return "";
    }
  }
};
