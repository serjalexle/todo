"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/store/useAuthStore";

// * Пропси для guard'а
interface IProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const AuthGuard = ({ children, redirectTo = "/auth/login" }: IProps) => {
  const router = useRouter();
  const { currentAdmin, isAuthInitialized } = useAuthStore();

  useEffect(() => {
    if (isAuthInitialized && !currentAdmin) {
      router.replace(redirectTo);
    }
  }, [currentAdmin, isAuthInitialized, router, redirectTo]);

  // 🕐 Поки ще не ініціалізовано — нічого не рендеримо
  if (!isAuthInitialized) return null;

  // ❌ Якщо не авторизований
  if (!currentAdmin) return null;

  // ✅ Якщо все ок
  return <>{children}</>;
};

export default AuthGuard;
