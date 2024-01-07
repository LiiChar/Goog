import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const themes = ['light-mode', 'dark-mode'] as const

interface ThemeStore {
  theme: (typeof themes)[number]
  isLight: boolean
  isVisible: boolean
  toggleVisible: () => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: (localStorage.getItem('theme') as (typeof themes)[number]) ?? 'dark-mode',
      isLight: false,
      isVisible: false,
      toggleVisible: () => set((state) => ({ isVisible: !state.isVisible })),
      async toggleTheme() {
        // @ts-ignore: error message
        await window.darkMode.toggle()
        if (this.isLight) {
          set(() => ({ theme: 'dark-mode', isLight: false }))
          localStorage.setItem('theme', 'dark-mode')
        } else {
          set(() => ({ theme: 'light-mode', isLight: true }))
          localStorage.setItem('theme', 'light-mode')
        }
      }
    }),
    {
      name: 'theme-storage'
    }
  )
)
