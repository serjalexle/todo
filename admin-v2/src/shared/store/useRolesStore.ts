import { create } from "zustand";
import { IRole } from "../types/role";
import { IMeta } from "../types/common";

export type RoleModalType = "edit" | "delete" | "create" | null;

interface IRolesStore {
  roles: IRole[];
  meta: IMeta;
  modals: {
    type: RoleModalType;
    role: IRole | null;
  };
  setState: (partialState: Partial<IRolesStore>) => void;
  toggleModal: (type: RoleModalType, role?: IRole | null) => void;
}

export const useRolesStore = create<IRolesStore>((set) => ({
  roles: [],
  meta: {
    page: 1,
    count: 10,
    total: 0,
  },
  modals: {
    type: null,
    role: null,
  },
  setState: (partialState) => set(partialState),
  toggleModal: (type, role = null) =>
    set((state) => ({ modals: { ...state.modals, type, role } })),
}));
