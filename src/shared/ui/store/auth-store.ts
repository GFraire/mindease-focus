import { create } from "zustand";

interface AuthUser {
  id: string;
  fullName: string | null;
  email: string | null;
}

interface AuthStore {
  user: AuthUser | null;
  isLoading: boolean;

  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) =>
    set({
      user,
      isLoading: false,
    }),

  setLoading: (loading) => set({ isLoading: loading }),
}));
