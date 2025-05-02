import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (password: string) => Promise<void>;
  logout: () => void;
  setHydrated: (state: boolean) => void;
}

const authStore = (set: any) => ({
  isAuthenticated: false,
  isHydrated: false,
  login: async (password: string) => {
    try {
      const correctPassword = process.env.NEXT_PUBLIC_APP_PASSWORD;
      if (!correctPassword) {
        throw new Error('Error: Password not configured');
      }
      
      if (password === correctPassword) {
        set({
          isAuthenticated: true,
        });
      } else {
        throw new Error('Invalid password');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  logout: () => {
    set({
      isAuthenticated: false,
    });
  },
  setHydrated: (state: boolean) => {
    set({
      isHydrated: state,
    });
  },
});

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(authStore, {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
      }),
    })
  )
); 