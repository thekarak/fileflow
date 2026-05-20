import { NavBar } from "@/components/navbar"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6 text-center">
        <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Organize your digital life, <span className="text-blue-600">effortlessly.</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-medium">
            AI-powered file intelligence that automatically sorts, tags, and organizes your messy folders into a pristine structure.
          </p>
          <div className="pt-8">
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-lg hover:shadow-blue-600/25 hover:-translate-y-1"
            >
              Launch App
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
