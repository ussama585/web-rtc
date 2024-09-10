import { create } from "zustand";

const loaderStore = create((set) => ({
  loader: false,
  getLoader: () => loaderStore.getState().loader,
  setLoading: () => set({ loader: true }),
}));

export default loaderStore;
