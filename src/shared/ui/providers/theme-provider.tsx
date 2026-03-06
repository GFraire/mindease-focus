import { useEffect } from "react"
import { useCognitiveSettingsStore } from "../store/cognitive-settings-store"

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const darkMode = useCognitiveSettingsStore((state) => state.darkMode)

  useEffect(() => {
    const root = document.documentElement

    root.classList.toggle("dark", darkMode)
  }, [darkMode])

  return <>{children}</>
}