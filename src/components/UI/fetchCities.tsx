/* eslint-disable no-console */
import axios from "axios";

// Axios instance for Google Places API
const axiosInstance = axios.create({
  baseURL:
    "https://google-map-places.p.rapidapi.com/maps/api/place/autocomplete/json",
  headers: {
    "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "",
    // "x-rapidapi-key": "51d7cd18e4msh7c01d62c274ea57p1d5c99jsne18844ec9785" || "",
    "x-rapidapi-host": "google-map-places.p.rapidapi.com",
  },
});

// Fetch city suggestions from Google Places Autocomplete API
export const fetchCities = async (inputValue: string) => {
  if (!inputValue) return [];

  try {
    const response = await axiosInstance.get("", {
      params: {
        input: inputValue,
        types: "(cities)", // Restrict results to cities
        language: "en", // Optional: specify language
      },
    });

    const predictions = response.data.predictions;

    // Map the API response to fit the format of react-select
    return predictions.map((prediction: any) => ({
      label: prediction.description,
      value: prediction.description,
    }));
  } catch (error) {
    console.error("Error fetching cities:", error);

    return [];
  }
};
