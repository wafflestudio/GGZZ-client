import { create } from "zustand";

interface NavigationStore {
  currentTabId: number; // TODO: enum으로 변경. 현재 1: 끄적이기, 2: 지도, 3: 마이페이지
  setCurrentTabId: (tabId: number) => void;
}

const useNavigationStore = create<NavigationStore>()((set) => ({
  currentTabId: 2,
  setCurrentTabId: (tabId) => set(() => ({ currentTabId: tabId })),
}));

export default useNavigationStore;
