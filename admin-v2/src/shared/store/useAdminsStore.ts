// 📄 shared/store/usePermissionsStore.ts
import { create } from "zustand";
import { IAdmin } from "../types/admin";
import { IFilterQuery, IMeta, ISortQuery } from "../types/common";

type modalsType = "create" | "edit" | "delete" | null;
interface IAdminsStore {
  admins: IAdmin[];
  setState: (partialState: Partial<IAdminsStore>) => void;
  meta: IMeta;
  sortQuery: ISortQuery;
  loadingTable: boolean;
  filterQuery: IFilterQuery;
  toggleModal: (type: modalsType, admin?: IAdmin | null) => void;
  modals: {
    type: modalsType;
    admin?: IAdmin | null;
  };
}

export const useAdminsStore = create<IAdminsStore>((set) => ({
  admins: [],
  meta: {
    total: 0,
    page: 1,
    count: 10,
  },
  sortQuery: {
    name: "created_at",
    type: "desc",
  },
  loadingTable: false,
  filterQuery: {},
  setState: (partialState) => set(partialState),
  toggleModal: (type, admin) => {
    set((state) => ({
      modals: {
        ...state.modals,
        type,
        admin,
      },
    }));
  },
  modals: {
    type: null,
    admin: null,
  },
}));
