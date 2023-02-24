import { create } from "zustand";
import { LetterRequest } from "../types/letterTypes";

type LetterFormStore = LetterRequest & {
  setText: (value: string | null) => void;
  setAudio: (value: Blob | null) => void;
  setTitle: (value: string | null) => void;
};

export const useLetterFormStore = create<LetterFormStore>()((set) => ({
  title: null,
  text: null,
  audio: null,
  setText: (value) => set({ text: value }),
  setAudio: (value) => set({ audio: value }),
  setTitle: (value) => set({ title: value }),
}));
