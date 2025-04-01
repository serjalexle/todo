// 📄 shared/store/useRolesStore.ts
import { create } from "zustand";
import { IRole } from "../types/role";



interface IRolesStore {
  roles: IRole[];
  setState: <K extends keyof IRolesStore>(
    key: K,
    value: IRolesStore[K]
  ) => void;
}

export const useRolesStore = create<IRolesStore>((set) => ({
  roles: [],
  setState: (key, value) => set({ [key]: value }),
}));
