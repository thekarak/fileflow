"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Bell, Plus, User, Menu, X, Home, Inbox, FolderOpen, Layers, Copy, Trash2, GitMerge } from "lucide-react"
import { SearchOverlay } from "./search-overlay"

export function DashboardNav() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Inbox", href: "/dashboard/inbox", icon: Inbox, badge: "3" },
    { name: "All Files", href: "/dashboard/files", icon: FolderOpen },
    { name: "Smart Collections", href: "/dashboard/collections", icon: Layers },
    { name: "Duplicates", href: "/dashboard/duplicates", icon: Copy },
    { name: "Rules", href: "/dashboard/rules", icon: GitMerge },
    { name: "Trash", href: "/dashboard/trash", icon: Trash2 },
  ]

  return (
    <>
      <header className="h-16 bg-bg-primary/80 backdrop-blur-md border-b border-border-custom flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
        <div className="flex items-center gap-2 md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          {/* Mobile Logo */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center text-white font-bold text-sm">
            F
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-xl">
          {/* Search Bar - Cmd+K Mockup (Desktop) */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="w-full max-w-md bg-bg-surface border border-border-custom hover:border-text-secondary/50 text-text-secondary/70 rounded-full px-4 py-2 flex items-center justify-between transition-colors shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span className="text-sm">Search files, folders...</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono font-medium">
              <kbd className="bg-bg-primary px-1.5 py-0.5 rounded border border-border-custom">⌘</kbd>
              <kbd className="bg-bg-primary px-1.5 py-0.5 rounded border border-border-custom">K</kbd>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button 
            className="md:hidden p-2 text-text-secondary hover:text-text-primary"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="w-5 h-5" />
          </button>
          
          <button className="hidden md:flex items-center gap-2 text-sm font-medium text-text-primary bg-bg-surface border border-border-custom hover:bg-bg-primary px-3 py-1.5 rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            New Workspace
          </button>
          
          <button className="relative p-2 text-text-secondary hover:text-text-primary transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-bg-primary"></span>
          </button>

          <button className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white border-2 border-bg-primary shadow-sm hover:scale-105 transition-transform ml-1 md:ml-0">
            <User className="w-4 h-4" />
          </button>
        </div>
      </header>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-64 max-w-[80%] h-full bg-bg-surface border-r border-border-custom shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            <div className="h-16 flex items-center justify-between px-4 border-b border-border-custom">
              <span className="font-semibold text-lg tracking-tight text-text-primary">
                FileFlow
              </span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-text-secondary hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-3 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-primary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  {item.badge && (
                    <div className="bg-accent-blue text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
