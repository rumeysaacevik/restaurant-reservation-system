import axios from "./axiosConfig";

export const getAllRestaurants = async () => {
  try {
    const response = await axios.get("/api/restaurants");
    return response.data;
  } catch (error) {
    console.error("Restoranlar alınamadı:", error);
    return [];
  }
};
