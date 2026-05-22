"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-[48px] h-[26px]" />
  }

  const isDark = resolvedTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-12 h-[26px] rounded-[13px] bg-bg-surface border border-border-custom relative cursor-pointer transition-all duration-300 flex items-center p-[3px] focus:outline-none"
      aria-label="Toggle dark mode"
    >
      <div
        className={`w-5 h-5 rounded-full bg-text-primary flex items-center justify-center transition-transform duration-300 ${
          isDark ? "translate-x-[22px]" : "translate-x-0"
        }`}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-bg-primary" />
        ) : (
          <Sun className="w-3 h-3 text-bg-primary" />
        )}
      </div>
    </button>
  )
}
