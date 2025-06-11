import { AuthResponse } from "@/types/user";
import { authTokens } from "@/utils/authTokenStorage";
import axios, { AxiosError } from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8001";
const { getAccess, save, clear } = authTokens;

export const axiosInstance = axios.create({
  baseURL: `${API_URL}/api/`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ⛔ Уникнути нескінченних циклів
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const refreshToken = async () => {
  return axios.get<AuthResponse>(`${API_URL}/api/auth/refresh`, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers)
              originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await refreshToken();

        const newAccessToken = data.access_token;
        console.log("🔁 New access token:", newAccessToken);
        const newRefreshToken = data.refresh_token;
        console.log("🔁 New refresh token:", newRefreshToken);

        await save({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
        processQueue(null, newAccessToken);

        if (originalRequest.headers)
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("❌ Refresh token error:", err);
        processQueue(err, null);
        await clear();
        // navigation.navigate("LoginScreen")
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(async (config) => {
  const token = await getAccess();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
