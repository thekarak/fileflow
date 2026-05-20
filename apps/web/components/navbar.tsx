import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"

export function NavBar() {
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 dark:bg-black/70 border-b border-black/5 dark:border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <span className="font-semibold text-xl tracking-tight text-zinc-900 dark:text-zinc-100">
            Fileflow
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard"
            className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
