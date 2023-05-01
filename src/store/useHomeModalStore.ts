import { Letter, LetterSummary } from "../lib/types/letterTypes";
import { create } from "zustand";

type HomeModalStore = {
  letter: LetterSummary | null;
  isDetailed: boolean | Letter;
  selectLetter: (letter: LetterSummary) => void;
  selectDetailedLetter: (letter: LetterSummary) => void;
  deselectLetter: () => void;
};
//const emptyLetter: LetterSummary = { title: "abc", id: 0, coordinates: { lat: 0, lon: 0 } };
export const useHomeModalStore = create<HomeModalStore>()((set) => ({
  letter: null,
  isDetailed: false,
  selectLetter: (letter) => set({ letter, isDetailed: false }),
  selectDetailedLetter: (letter) => set({ letter, isDetailed: true }),
  deselectLetter: () => set({ letter: null, isDetailed: false }),
}));
