import React from "react";
import { create } from "zustand";

interface RegisterInfoStore {
  // Login ID
  username: string;
  setUsername: (name: string) => void;
  nickname: string;
  setNickname: (name: string) => void;
}

export const useRegisterInfoStore = create<RegisterInfoStore>()(
  (set): RegisterInfoStore => ({
    username: "",
    nickname: "",
    setUsername: (name) => set({ username: name }),
    setNickname: (name) => set({ nickname: name })
  })
);
