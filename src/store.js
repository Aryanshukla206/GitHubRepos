import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      savedUsers: [],
      theme: 'dark',
      addUser: (user) =>
        set((state) => ({
          savedUsers: [
            ...state.savedUsers.filter((u) => u.login !== user.login),
            user,
          ],
        })),
      removeUser: (login) =>
        set((state) => ({
          savedUsers: state.savedUsers.filter((u) => u.login !== login),
        })),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),
    }),
    {
      name: 'github-explorer-storage',
    }
  )
);
