import { Letter, LetterSummary } from "../types/letterTypes";
import { create } from "zustand";

type HomeModalStore = {
  letter: LetterSummary | null;
  selectLetter: (letter: LetterSummary) => void;
  deselectLetter: () => void;
};

export const useHomeModalStore = create<HomeModalStore>()((set) => ({
  letter: null,
  selectLetter: (letter) => set({ letter }),
  deselectLetter: () => set({ letter: null }),
}));
