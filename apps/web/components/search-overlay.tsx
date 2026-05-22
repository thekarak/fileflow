"use client"

import { useState, useEffect } from "react"
import { Search, X, FileText, Image as ImageIcon, FileArchive, Clock, ChevronRight } from "lucide-react"

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("")

  // Handle keyboard shortcut (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        // Parent component handles opening
      }
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[15vh]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-bg-surface border border-border-custom shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 mx-4">
        
        {/* Search Input */}
        <div className="flex items-center px-4 border-b border-border-custom">
          <Search className="w-5 h-5 text-text-secondary mr-3" />
          <input
            type="text"
            className="w-full h-14 bg-transparent border-none outline-none text-text-primary placeholder:text-text-secondary/50 text-lg"
            placeholder="Search for files, e.g. 'Invoices from last Friday'"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-text-secondary hover:bg-bg-primary hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 px-4 py-3 border-b border-border-custom overflow-x-auto no-scrollbar">
          <button className="px-3 py-1 rounded-full border border-border-custom bg-bg-primary text-xs font-medium text-text-secondary hover:text-text-primary whitespace-nowrap transition-colors">
            Documents
          </button>
          <button className="px-3 py-1 rounded-full border border-border-custom bg-bg-primary text-xs font-medium text-text-secondary hover:text-text-primary whitespace-nowrap transition-colors">
            Images
          </button>
          <button className="px-3 py-1 rounded-full border border-accent-blue bg-accent-blue/10 text-xs font-medium text-accent-blue whitespace-nowrap transition-colors">
            Last 30 Days
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          
          {/* Default State: Search Memory & Suggestions */}
          {!query && (
            <div className="p-2 space-y-6">
              <div>
                <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3 px-2">
                  Recent Searches
                </h4>
                <div className="space-y-1">
                  <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-bg-primary group transition-colors text-sm">
                    <div className="flex items-center gap-3 text-text-primary">
                      <Clock className="w-4 h-4 text-text-secondary" />
                      "Tax documents 2025"
                    </div>
                  </button>
                  <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-bg-primary group transition-colors text-sm">
                    <div className="flex items-center gap-3 text-text-primary">
                      <Clock className="w-4 h-4 text-text-secondary" />
                      "Screenshots from yesterday"
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-accent-violet uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-violet animate-pulse" />
                  Proactive Suggestions
                </h4>
                <div className="space-y-1">
                  <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-bg-primary group transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-text-primary">Weekly Report Drafts</p>
                        <p className="text-xs text-text-secondary">You usually search for this on Fridays.</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search Results State */}
          {query && (
            <div className="p-2 space-y-1">
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3 px-2">
                Top Matches
              </h4>
              
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-bg-primary group transition-colors border border-transparent hover:border-border-custom">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Invoice_AcmeCorp_Q1.pdf</p>
                    <p className="text-xs text-text-secondary mt-0.5">Found match in content: "...total amount for <span className="text-accent-blue font-semibold bg-accent-blue/10 px-1 rounded">invoices from last friday</span> is $4,200..."</p>
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border-custom bg-bg-primary flex items-center justify-between text-xs text-text-secondary font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><kbd className="bg-bg-surface border border-border-custom px-1.5 py-0.5 rounded">↑</kbd><kbd className="bg-bg-surface border border-border-custom px-1.5 py-0.5 rounded">↓</kbd> to navigate</span>
            <span className="flex items-center gap-1"><kbd className="bg-bg-surface border border-border-custom px-1.5 py-0.5 rounded">↵</kbd> to select</span>
          </div>
          <span>FileFlow Semantic Engine</span>
        </div>
      </div>
    </div>
  )
}
