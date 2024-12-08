"use client";

import { users_api } from "api/users_api";
import Loading from "components/UI/Loading/Loading";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  // Стан для перевірки авторизації
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuthToken = async () => {
    try {
      await users_api.refresh();
      setIsLoading(false); // Встановлюємо стан завантаження в false
    } catch (error) {
      console.error("Error refreshing token:", error);
      // Префетч сторінки логіну перед редиректом
      router.replace("/auth/login"); // Редирект при помилці
      setTimeout(() => {
        setIsLoading(false); // Завжди встановлюємо стан завантаження в false
      }, 1000);
    }
  };

  useEffect(() => {
    refreshAuthToken();
  }, []);

  if (isLoading) {
    return <Loading />; // Показуємо лоадер, поки йде перевірка
  }

  return <>{children}</>; // Рендеримо дітей після успішної авторизації
};

export default AuthInitializer;
