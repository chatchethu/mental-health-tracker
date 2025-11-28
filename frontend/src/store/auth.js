import { create } from "zustand";

export const useAuthStore = create((set) => ({
  phone: null,

  setPhone: (number) => set({ phone: number }),

  logout: () => set({ phone: null }),
}));
