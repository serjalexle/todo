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
  const { currentAdmin } = useAuthStore();

  useEffect(() => {
    if (!currentAdmin) {
      router.replace(redirectTo);
    }
  }, [currentAdmin, router, redirectTo]);

  if (!currentAdmin) return null;

  return <>{children}</>;
};

export default AuthGuard;
