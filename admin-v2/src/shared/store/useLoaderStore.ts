import { create } from "zustand";

interface LoaderStore {
  visible: boolean;
  show: () => void;
  hide: () => void;
}

export const useLoaderStore = create<LoaderStore>((set) => ({
  visible: false,
  show: () => set({ visible: true }),
  hide: () => set({ visible: false }),
}));
