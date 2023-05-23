import { create } from "zustand";

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
