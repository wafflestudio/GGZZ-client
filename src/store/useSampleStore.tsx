import { create } from "zustand";

interface SampleStore {
  sampleData: number;
  addData: (addValue: number) => void;
}

const useSampleStore = create<SampleStore>()((set) => ({
  sampleData: 0,
  addData: (addValue) =>
    set((state) => ({ sampleData: state.sampleData + addValue })),
}));

export default useSampleStore;

// 컴포넌트 밖에서 쓸 때는
// useSampleStore.getState().sampleData나
// useSampleStore.getState().addData(5) 같은 방식으로 사용
