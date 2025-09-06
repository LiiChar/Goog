import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const themes = ['light-mode', 'dark-mode'] as const;

interface ThemeStore {
  theme: (typeof themes)[number];
  isLight: boolean;
  isVisible: boolean;
  toggleVisible: () => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: (localStorage.getItem('theme') as (typeof themes)[number]) ?? 'dark-mode',
      isLight: false,
      isVisible: false,
      toggleVisible: () => set((state) => ({ isVisible: !state.isVisible })),
      toggleTheme() {
        // @ts-ignore
        window.darkMode.toggle().then(() => {
          set(() => {
            if (this.isLight) {
              return { theme: 'dark-mode', isLight: false };
            } else {
              return { theme: 'light-mode', isLight: true };
            }
          });
        });
      },
    }),
    {
      name: 'theme-storage',
    },
  ),
);
