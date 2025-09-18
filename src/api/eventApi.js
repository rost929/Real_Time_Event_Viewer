import axios from "axios";

const USGS_API_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/";

export const fetchEarthquakes = async (timePeriod) => {
  try {
    const response = await axios.get(`${USGS_API_URL}${timePeriod}.geojson`);
    return response.data;
  } catch (error) {
    console.error("Error fetching earthquake data:", error);
    throw new Error("Failed to fetch earthquake data");
  }
};

export const fetchVolcanoes = async () => {
  try {
    const response = await axios.get(`${USGS_API_URL}significant_month.geojson`);

    const volcanoEvents = response.data.features.filter((event) => {
      const type = event.properties.type || "";
      const title = event.properties.title || "";
      return type !== "earthquake" || title.toLowerCase().includes("volcan");
    });

    if (!volcanoEvents || volcanoEvents.length === 0) {
      console.log("No significant non-earthquake or volcanic events found in the last month.");
      return [];
    }

    return volcanoEvents.map((event) => {
      const [longitude, latitude] = event.geometry.coordinates;
      return {
        id: event.id,
        name: event.properties.title,
        latitude: latitude,
        longitude: longitude,
        properties: event.properties,
      };
    });
  } catch (error) {
    console.error("Error fetching significant event data:", error);
    throw new Error("Failed to fetch significant event data");
  }
};

export const getEventFetcher = (category) => {
  switch (category) {
    case "earthquakes":
      return fetchEarthquakes;
    case "volcanoes":
      return fetchVolcanoes;
    default:
      throw new Error("Invalid event category");
  }
};
