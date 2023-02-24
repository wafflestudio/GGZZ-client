import { create } from "zustand";
import { TLLCoordinates, TMapInfo } from "../src/types/locationTypes";

interface MapStore {
  mapInfo: TMapInfo;
  setCenter: (center: TLLCoordinates) => void;
}

const useMapStore = create<MapStore>()((set) => ({
  mapInfo: { height: 1000, width: 1000, centerLLCoordinates: { lat: 0, long: 0 } },
  setCenter: (centerLLCoordinates: TLLCoordinates) =>
    set((state) => ({ mapInfo: { ...state.mapInfo, centerLLCoordinates } })),
}));

export default useMapStore;

// 컴포넌트 밖에서 쓸 때는
// useSampleStore.getState().sampleData나
// useSampleStore.getState().addData(5) 같은 방식으로 사용
