import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useWalletStore = create(
  persist(
    (set) => ({
      balances: [],
      setBalance: (value) =>
        set((state) => ({ balances: [...state.balances, value] })),
      cleanBalance: () => set({ balances: [] }),
    }),
    {
      name: "wallets-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
