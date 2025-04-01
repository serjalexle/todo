// 📄 shared/hooks/useAdminAuthInitializer.ts
import { useEffect } from "react";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { apiHandleError } from "@/shared/helpers/apiHandleError";
import { refreshAdmin } from "../api/admin/authApi";
import { useRouter } from "next/navigation";

export const useAdminAuthInitializer = (): void => {
  const { setState } = useAuthStore();
  const router = useRouter();
  const location =
    typeof window !== "undefined" ? window.location.pathname : null;

  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await refreshAdmin();

        const admin = res?.result;
        if (admin) {
          setState("currentAdmin", admin);

          if (location === "/auth/login") {
            // ✅ Якщо ми на сторінці логіну, переходимо на /admin
            router.push("/admin/dashboard");
          }
        } else {
          // ❌ не показуємо toast, просто не залогінений
          setState("currentAdmin", null);
        }
      } catch (error) {
        setState("currentAdmin", null);
        // ❌ не показуємо toast, просто не залогінений
        apiHandleError(error); // Можеш закоментити, якщо хочеш абсолютну тишу
      } finally {
        setState("isAuthInitialized", true); // ✅ незалежно від результату
      }
    };

    refresh();
  }, [setState, router, location]); // Додаємо location в залежності, щоб не було помилок з ESLint
};
