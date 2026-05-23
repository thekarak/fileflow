"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Search, Bell, Plus, User, Menu, X, Home, Inbox,
  FolderOpen, Layers, Copy, Trash2, GitMerge,
  CheckCircle2, Settings, LogOut, HelpCircle
} from "lucide-react"
import { SearchOverlay } from "./search-overlay"

export function DashboardNav() {
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showNewWorkspaceModal, setShowNewWorkspaceModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [workspaceName, setWorkspaceName] = useState("")
  const [workspaceCreated, setWorkspaceCreated] = useState(false)

  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfileMenu(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [])

  const handleCreateWorkspace = () => {
    if (!workspaceName.trim()) return
    setWorkspaceCreated(true)
    setTimeout(() => {
      setShowNewWorkspaceModal(false)
      setWorkspaceCreated(false)
      setWorkspaceName("")
    }, 1500)
  }

  const notifications = [
    { id: 1, text: "3 files classified as Documents", time: "2m ago", read: false },
    { id: 2, text: "Duplicate cluster detected (4 files)", time: "15m ago", read: false },
    { id: 3, text: "Auto-organize completed for inbox", time: "1h ago", read: true },
  ]

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
        {/* Mobile left */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center text-white font-bold text-sm">
            F
          </div>
        </div>

        {/* Desktop search */}
        <div className="hidden md:flex flex-1 max-w-xl">
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

        {/* Right side actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Mobile search */}
          <button
            className="md:hidden p-2 text-text-secondary hover:text-text-primary"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="w-5 h-5" />
          </button>

          {/* + New Workspace */}
          <button
            onClick={() => setShowNewWorkspaceModal(true)}
            className="hidden md:flex items-center gap-2 text-sm font-medium text-text-primary bg-bg-surface border border-border-custom hover:bg-bg-primary px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Workspace
          </button>

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false) }}
              className="relative p-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-bg-primary" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-bg-surface border border-border-custom rounded-2xl shadow-2xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-border-custom flex justify-between items-center">
                  <span className="text-sm font-semibold text-text-primary">Notifications</span>
                  <span className="text-[10px] text-accent-blue font-medium cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-border-custom">
                  {notifications.map(n => (
                    <div key={n.id} className={`px-4 py-3 flex items-start gap-3 hover:bg-bg-primary/50 transition-colors cursor-pointer ${!n.read ? "bg-accent-blue/5" : ""}`}>
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? "bg-accent-blue" : "bg-transparent"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-primary">{n.text}</p>
                        <p className="text-[10px] text-text-secondary mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-border-custom">
                  <Link href="/dashboard/inbox" className="text-xs text-accent-blue hover:underline font-medium" onClick={() => setShowNotifications(false)}>
                    View all notifications →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar / Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false) }}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white border-2 border-bg-primary shadow-sm hover:scale-105 transition-transform"
            >
              <User className="w-4 h-4" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-bg-surface border border-border-custom rounded-2xl shadow-2xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-border-custom">
                  <p className="text-sm font-semibold text-text-primary">Local Developer</p>
                  <p className="text-xs text-text-secondary">developer@fileflow.local</p>
                </div>
                <div className="py-1">
                  {[
                    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
                    { icon: HelpCircle, label: "Help & Docs", href: "/dashboard/help" },
                  ].map(item => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-primary transition-colors"
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => { setShowProfileMenu(false); router.push("/") }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-500 hover:bg-red-500/5 transition-colors w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* ─── New Workspace Modal ─── */}
      {showNewWorkspaceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-bg-primary/70 backdrop-blur-sm" onClick={() => setShowNewWorkspaceModal(false)} />
          <div className="relative bg-bg-surface border border-border-custom rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">Create New Workspace</h2>
              <button onClick={() => setShowNewWorkspaceModal(false)} className="p-1 text-text-secondary hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            {workspaceCreated ? (
              <div className="flex flex-col items-center py-8 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                </div>
                <p className="text-sm font-semibold text-text-primary">Workspace &quot;{workspaceName}&quot; created!</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Workspace Name</label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    placeholder="e.g., Project Alpha"
                    className="w-full px-4 py-2.5 bg-bg-primary border border-border-custom rounded-xl text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-blue transition-colors"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleCreateWorkspace()}
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setShowNewWorkspaceModal(false)} className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateWorkspace}
                    disabled={!workspaceName.trim()}
                    className="px-5 py-2 bg-accent-blue hover:bg-accent-blue/90 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-all"
                  >
                    Create Workspace
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ─── Mobile Menu Overlay ─── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-64 max-w-[80%] h-full bg-bg-surface border-r border-border-custom shadow-2xl flex flex-col">
            <div className="h-16 flex items-center justify-between px-4 border-b border-border-custom">
              <span className="font-semibold text-lg tracking-tight text-text-primary">FileFlow</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-text-secondary hover:text-text-primary">
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
