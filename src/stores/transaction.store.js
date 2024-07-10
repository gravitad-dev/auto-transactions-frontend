import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useTrasactionStore = create(
  persist(
    (set) => ({
      history: [],
      savedHistory: [],
      setHistory: (value) => {
        set((state) => ({ history: [...state.history, value] }));
        set((state) => ({ savedHistory: [...state.history] }));
      },
      cleanHistory: () => set({ history: [] }),
      cleanSavedHistory: () => set({ savedHistory: [] }),
    }),
    {
      name: "transactions-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
