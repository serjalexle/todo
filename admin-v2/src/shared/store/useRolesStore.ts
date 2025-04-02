// 📄 shared/store/useRolesStore.ts
import { create } from "zustand";
import { IRole } from "../types/role";

export type RoleModalType = "edit" | "delete" | "create" | null;

interface IRolesStore {
  roles: IRole[];
  modals: {
    type: RoleModalType;
    roleId: string | null;
  };
  setState: <K extends keyof IRolesStore>(
    key: K,
    value: IRolesStore[K]
  ) => void;
  toggleModal: (type: RoleModalType, roleId?: string | null) => void;
}

export const useRolesStore = create<IRolesStore>((set) => ({
  roles: [],
  modals: {
    type: null,
    roleId: null,
  },
  setState: (key, value) => set({ [key]: value }),
  toggleModal: (type, roleId = null) =>
    set((state) => ({ modals: { ...state.modals, type, roleId } })),
}));
