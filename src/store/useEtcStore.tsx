import { create } from "zustand";

// TODO: store 정리

interface EtcStore {
  // for splash screen
  isLoading: boolean;
  check: () => void;
  // for ...
}

const useEtcStore = create<EtcStore>()((set) => ({
  // for splash screen
  isLoading: true,
  check: () => set(() => ({ isLoading: false })),
  // for ...
}));

export default useEtcStore;
