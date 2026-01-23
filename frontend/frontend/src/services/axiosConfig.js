import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem("user");

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {
        console.error("Token parse hatası:", e);
        localStorage.removeItem("user");
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
