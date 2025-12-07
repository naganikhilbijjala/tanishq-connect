"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RSOStore {
  currentRSOId: number | null;
  currentRSOName: string | null;
  setCurrentRSO: (id: number, name: string) => void;
  clearCurrentRSO: () => void;
}

export const useCurrentRSO = create<RSOStore>()(
  persist(
    (set) => ({
      currentRSOId: null,
      currentRSOName: null,
      setCurrentRSO: (id, name) => set({ currentRSOId: id, currentRSOName: name }),
      clearCurrentRSO: () => set({ currentRSOId: null, currentRSOName: null }),
    }),
    {
      name: "tanishq-rso-storage",
    }
  )
);
