import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useTrasactionStore = create(
  persist(
    (set) => ({
      history: [],
      setHistory: (value) =>
        set((state) => ({ history: [...state.history, value] })),
      cleanHistory: () => set({ history: [] }),
    }),
    {
      name: "transactions-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
