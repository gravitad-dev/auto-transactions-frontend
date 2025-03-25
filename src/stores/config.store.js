import { NETWORKS } from "../networksList";
import create from "zustand";

export const useConfigStore = create((set) => ({
  // Estado inicial
  file: null,
  network: NETWORKS[0],

  // Acciones
  setFile: (file) => set({ file }),
  setNetwork: (network) => set({ network }),
}));
