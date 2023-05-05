import { create } from "zustand";

interface EtcStore {
  // for splash screen
  isLoading: boolean;
  check: () => void;
}

const useEtcStore = create<EtcStore>()((set) => ({
  isLoading: true,
  check: () => set(() => ({ isLoading: false })),
}));

export default useEtcStore;
