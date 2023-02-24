import { create } from "zustand";
import { LetterRequest } from "../types/letterTypes";

type LetterFormStore = LetterRequest & {
  setText: (value: string | null) => void;
  setAudio: (value: Blob | null) => void;
  // not blob but string
  setImage: (value: string | null) => void;
  setTitle: (value: string | null) => void;
};

export const useLetterFormStore = create<LetterFormStore>()((set) => ({
  title: null,
  text: null,
  audio: null,
  image: null,
  setText: (value) => set({ text: value }),
  setAudio: (value) => set({ audio: value }),
  setImage: (value) => set({ image: value }),
  setTitle: (value) => set({ title: value }),
}));
