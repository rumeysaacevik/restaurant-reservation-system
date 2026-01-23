import axios from "./axiosConfig";

export const getUserReservations = async (email) => {
  const response = await axios.get(`/api/reservations/my-reservations?email=${email}`);
  return response.data;
};
