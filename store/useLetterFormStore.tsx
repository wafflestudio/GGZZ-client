import { create } from "zustand";
import { LetterRequest } from "../types/letterTypes";

type LetterFormStore = LetterRequest & {
  setText: (value: string) => void;
};

export const useLetterFormStore = create<LetterFormStore>()((set) => ({
  text: null,
  setText: (value) => set({ text: value }),
}));
