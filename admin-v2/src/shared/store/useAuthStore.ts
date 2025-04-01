import { create } from "zustand";
import { IAdmin } from "@/shared/types/admin";

type AuthStore = {
  currentAdmin: IAdmin | null;
  isAuthInitialized: boolean;
  setState: <K extends keyof AuthStore>(key: K, value: AuthStore[K]) => void;
  reset: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  currentAdmin: null,
  // * Ініціалізація auth 
  isAuthInitialized: false,

  setState: (key, value) => set((state) => ({ ...state, [key]: value })),

  reset: () => set({ currentAdmin: null }),
}));
