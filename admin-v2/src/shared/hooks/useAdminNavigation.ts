"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { logoutAdmin } from "../api/admin/authApi";
import { toast } from "react-toastify";
import { apiHandleError } from "@/shared/helpers/apiHandleError";

export const useAdminNavigation = () => {
  const router = useRouter();
  const { reset } = useAuthStore.getState();

  const handleAction = async (action?: string, path?: string) => {
    if (action === "logout") {
      const toastId = toast.loading("Вихід з системи...");

      try {
        reset();

        const res = await logoutAdmin();

        toast.update(toastId, {
          render: res?.result ? "Ви вийшли з системи 🐢" : "Вихід завершено",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        router.push("/auth/login");
      } catch (error) {
        apiHandleError(error, toastId);
        router.push("/auth/login");
      }
    } else if (path) {
      router.push(path);
    }
  };

  return { handleAction };
};
