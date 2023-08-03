import { TLLCoordinates } from "types/locationTypes";
import { create } from "zustand";

type MyPositionStore = {
  currentCoordinates: null | TLLCoordinates;
  viewCoordinates: null | TLLCoordinates;
  heading: null | number;
  setCurrentCoordinates: (coords: TLLCoordinates) => void;
  setViewCoordinates: (coords: TLLCoordinates | null) => void;
  setHeading: (heading: number | null) => void;
};

export const useMyPositionStore = create<MyPositionStore>()((set) => ({
  currentCoordinates: null,
  viewCoordinates: null,
  heading: null,
  setCurrentCoordinates: (coords) => set({ currentCoordinates: coords }),
  setViewCoordinates: (coords) => set({ viewCoordinates: coords }),
  setHeading: (heading: number | null) => set({ heading }),
}));
