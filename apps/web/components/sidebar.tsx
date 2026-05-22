"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  Inbox, 
  FolderOpen, 
  Layers, 
  Copy, 
  Trash2, 
  Settings, 
  PieChart,
  HelpCircle,
  GitMerge,
  ChevronLeft
} from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Inbox", href: "/dashboard/inbox", icon: Inbox, badge: "3" },
    { name: "All Files", href: "/dashboard/files", icon: FolderOpen },
    { name: "Smart Collections", href: "/dashboard/collections", icon: Layers },
    { name: "Duplicates", href: "/dashboard/duplicates", icon: Copy },
    { name: "Rules", href: "/dashboard/rules", icon: GitMerge },
    { name: "Trash", href: "/dashboard/trash", icon: Trash2 },
  ]

  const bottomItems = [
    { name: "Analytics", href: "/dashboard/analytics", icon: PieChart },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Help & Docs", href: "/dashboard/help", icon: HelpCircle },
  ]

  return (
    <aside className="w-64 h-screen bg-bg-surface border-r border-border-custom flex-col hidden md:flex fixed left-0 top-0 z-40">
      <div className="h-16 flex items-center px-6 border-b border-border-custom">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center text-white font-bold text-sm">
            F
          </div>
          <span className="font-semibold text-lg tracking-tight text-text-primary">
            FileFlow
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
              pathname === item.href 
                ? "bg-accent-blue/10 text-accent-blue font-medium" 
                : "text-text-secondary hover:text-text-primary hover:bg-bg-primary"
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.name}</span>
            </div>
            {item.badge && (
              <div className="bg-accent-blue text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {item.badge}
              </div>
            )}
          </Link>
        ))}
      </div>

      <div className="py-4 px-3 space-y-1 border-t border-border-custom">
        {bottomItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-primary transition-colors"
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm">{item.name}</span>
          </Link>
        ))}
        <button className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-text-secondary/50 hover:text-text-secondary hover:bg-bg-primary transition-colors mt-2">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Collapse Sidebar</span>
        </button>
      </div>
    </aside>
  )
}
