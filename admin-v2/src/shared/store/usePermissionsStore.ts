// 📄 shared/store/usePermissionsStore.ts
import { create } from "zustand";

interface IPermissionsStore {
  permissions: string[];
  setState: <K extends keyof IPermissionsStore>(
    key: K,
    value: IPermissionsStore[K]
  ) => void;
}

export const usePermissionsStore = create<IPermissionsStore>((set) => ({
  permissions: [],
  setState: (key, value) => set({ [key]: value }),
}));
