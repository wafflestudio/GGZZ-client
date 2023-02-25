import { TLLCoordinates } from "../src/types/locationTypes";
import { create } from "zustand";

type MyPositionStore = {
  currentCoordinates: null | TLLCoordinates;
  viewCoordinates: null | TLLCoordinates;
  setCurrentCoordinates: (coords: TLLCoordinates) => void;
  setViewCoordinates: (coords: TLLCoordinates) => void;
};

export const useMyPositionStore = create<MyPositionStore>()((set) => ({
  currentCoordinates: null,
  viewCoordinates: null,
  setCurrentCoordinates: (coords) => set({ currentCoordinates: coords }),
  setViewCoordinates: (coords) => set({ viewCoordinates: coords }),
}));
