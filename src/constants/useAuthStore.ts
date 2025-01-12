import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updateUser: (updatedUserData: Partial<User>) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: '',

      login: (userData: User, token: string) =>
        set(() => ({
          user: userData,
          isAuthenticated: true,
          token: token,
        })),

      logout: () =>
        set(() => ({
          user: null,
          isAuthenticated: false,
          token: '',
        })),

      updateUser: (updatedUserData: Partial<User>) =>
        set((state) => ({
          user: { ...state.user, ...updatedUserData },
        })),
    }),
    {
      name: 'auth-store', // Name of the key in localStorage
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
      }), // Persist only necessary fields
    },
  ),
);

export default useAuthStore;
