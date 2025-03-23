import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  phone: string | null;
  isAuthenticated: boolean;
  token: string | null;
  setPhone: (phone: string) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

const initialState = {
  phone: null,
  isAuthenticated: false,
  token: null,
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setPhone: (phone: string) =>
          set((state) => ({ ...state, phone }), false, "setPhone"),

        setToken: (token: string) =>
          set(
            (state) => ({
              ...state,
              token,
              isAuthenticated: true,
            }),
            false,
            "setToken"
          ),

        logout: () => set(initialState, false, "logout"),
      }),
      {
        name: "auth-storage",
        // فقط این فیلدها در localStorage ذخیره می‌شوند
        partialize: (state) => ({
          token: state.token,
          phone: state.phone,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);
