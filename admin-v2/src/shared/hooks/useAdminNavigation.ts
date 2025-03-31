"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/store/useAuthStore";

export const useAdminNavigation = () => {
  const router = useRouter();
  const { reset } = useAuthStore.getState();

  const handleAction = (action?: string, path?: string) => {
    if (action === "logout") {
      reset();

      // TODO: очистити токени, якщо будеш зберігати в localStorage
      router.push("/auth/login");
    } else if (path) {
      router.push(path);
    }
  };

  return { handleAction };
};
