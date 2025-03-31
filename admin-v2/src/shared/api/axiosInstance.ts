import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "client-type": "web",
  },
});

export default axiosInstance;
