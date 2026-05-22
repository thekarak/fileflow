"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Sparkles } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

export function NavBar() {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", href: isHome ? "#hero" : "/" },
    { name: "Features", href: isHome ? "#features" : "/#features" },
    { name: "How It Works", href: isHome ? "#how-it-works" : "/#how-it-works" },
    { name: "Pricing", href: isHome ? "#pricing" : "/#pricing" },
    { name: "Testimonials", href: isHome ? "#testimonials" : "/#testimonials" },
  ]

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault()
      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" })
        setMobileMenuOpen(false)
      }
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-8 transition-all duration-300 ${
        scrolled
          ? "bg-glass-bg/70 backdrop-blur-2xl border-b border-border-custom"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center text-white font-bold text-lg shadow-sm">
            F
          </div>
          <span className="font-semibold text-xl tracking-tight text-text-primary">
            FileFlow
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-8 list-none">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors duration-300"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex items-center gap-2 bg-accent-blue hover:bg-accent-blue/90 text-white font-semibold text-sm px-5 py-2.5 rounded-full shadow-[0_4px_14px_rgba(0,85,255,0.25)] hover:shadow-[0_6px_20px_rgba(0,85,255,0.35)] transition-all hover:scale-[1.02]"
          >
            Launch App
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1 text-text-primary focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-glass-bg/95 backdrop-blur-2xl border-b border-border-custom px-6 py-4 transition-all duration-300 ${
          mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col gap-4 list-none">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="block text-text-primary text-base font-medium py-1"
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li className="pt-2 border-t border-border-custom">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex w-full items-center justify-center gap-2 bg-accent-blue text-white font-semibold text-sm px-5 py-3 rounded-full"
            >
              Launch App
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
