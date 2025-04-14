// 📄 shared/helpers/apiHandleError.ts
import { AxiosError } from "axios";
import { Id, toast } from "react-toastify";

/**
 * Універсальний обробник помилок для API-запитів.
 * @param error - Будь-яка помилка (AxiosError, string тощо)
 * @param toastId - ID активного toast'а (опціонально)
 */
export const apiHandleError = (error: unknown, toastId?: Id): void => {
  const defaultMessage = "Щось пішло не так. Спробуйте пізніше.";

  // 🟠 Тут можна додати додаткову обробку AxiosError, HTTP status тощо

  let message = "";

  if (error instanceof AxiosError) {
    message =
      error?.response?.data?.message ||
      error?.response?.data?.detail?.[0]?.msg ||
      error?.response?.data?.detail ||
      error?.message ||
      defaultMessage;
  }

  if (typeof error === "string") {
    message = error || defaultMessage;
  }

  console.log("🚩 apiHandleError", error);

  if (toastId) {
    toast.update(toastId, {
      render: message,
      type: "error",
      isLoading: false,
      autoClose: 4000,
    });
  } else {
    toast.error(message);
  }
};
