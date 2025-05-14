import { create } from "zustand";
import { IFilterQuery, IMeta, ISortQuery } from "../types/common";
import { IUser } from "../types/user";

type modalsType = "create" | "edit" | "delete" | null;
interface IUsersStore {
  users: IUser[];
  setState: (partialState: Partial<IUsersStore>) => void;
  meta: IMeta;
  sortQuery: ISortQuery;
  loadingTable: boolean;
  filterQuery: IFilterQuery;
  toggleModal: (type: modalsType, user?: IUser | null) => void;
  modals: {
    type: modalsType;
    user?: IUser | null;
  };
}

export const useUsersStore = create<IUsersStore>((set) => ({
  users: [],
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
  toggleModal: (type, user) => {
    set((state) => ({
      modals: {
        ...state.modals,
        type,
        user,
      },
    }));
  },
  modals: {
    type: null,
    user: null,
  },
}));
