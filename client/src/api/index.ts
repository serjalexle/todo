import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

// Створюємо інстанс Axios
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Базовий URL API
  timeout: 5000, // Таймаут для запитів (мс)
  withCredentials: true, // Надсилати куки на сервер
  headers: {
    "Content-Type": "application/json", // Заголовки за замовчуванням
  },
});

// Інтерсептор для запитів
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Додаємо токен авторизації, якщо він є
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      `[Request] ${config.method?.toUpperCase()} ${config.url}`,
      config
    );
    return config;
  },
  (error: AxiosError) => {
    // Обробка помилок запиту
    console.error("[Request Error]", error);
    return Promise.reject(error);
  }
);

// Інтерсептор для відповідей
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Обробка успішної відповіді
    console.log("[Response]", response);
    return response.data; // Повертаємо тільки дані відповіді
  },
  (error: AxiosError) => {
    // Обробка помилок відповіді
    if (error.response) {
      console.error(
        "[Response Error]",
        error.response.status,
        error.response.data
      );
      if (error.response.status === 401) {
        // Наприклад: перенаправити на сторінку входу при 401 Unauthorized
        window.location.href = "/login";
      }
    } else if (error.request) {
      console.error(
        "[Request Error] Немає відповіді від сервера",
        error.request
      );
    } else {
      console.error("[Unknown Error]", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
