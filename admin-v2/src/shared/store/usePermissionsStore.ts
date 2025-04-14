// 📄 shared/store/usePermissionsStore.ts
import { create } from "zustand";

interface IPermissionsStore {
  permissions: string[];
  setState: (partialState: Partial<IPermissionsStore>) => void;
}

export const usePermissionsStore = create<IPermissionsStore>((set) => ({
  permissions: [],
  setState: (partialState) => set(partialState),
}));
