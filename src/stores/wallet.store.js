import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useWalletStore = create(
  persist(
    (set) => ({
      balances: [],
      savedBalances: [],
      setBalances: (value) => {
        set((state) => ({ balances: [...state.balances, value] }));
        set((state) => ({ savedBalances: [...state.balances] }));
      },
      cleanBalances: () => set({ balances: [] }),
      cleanSavedBalances: () => set({ savedBalances: [] }),
    }),
    {
      name: "wallets-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
