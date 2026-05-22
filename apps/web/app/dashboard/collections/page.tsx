"use client"

import { Layers, Plus, Lock, Globe } from "lucide-react"

const mockCollections = [
  { name: "Tax Documents 2026", count: 14, color: "from-blue-500 to-indigo-500", access: "private" },
  { name: "Client Projects", count: 42, color: "from-accent-violet to-accent-blue", access: "shared" },
  { name: "Photo Archive", count: 287, color: "from-amber-500 to-orange-500", access: "private" },
  { name: "Code Snippets", count: 33, color: "from-emerald-500 to-teal-500", access: "private" },
]

export default function CollectionsPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Smart Collections</h1>
          <p className="text-sm text-text-secondary mt-1">AI-generated and manual folders for your file universe.</p>
        </div>
        <button className="px-4 py-2 bg-accent-blue text-white rounded-lg text-sm font-medium hover:bg-accent-blue/90 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Collection
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockCollections.map((c) => (
          <div key={c.name} className="bg-card-bg border border-border-custom rounded-2xl p-5 hover:-translate-y-1 transition-all cursor-pointer hover:border-accent-blue/40 group">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform`}>
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-text-primary text-sm">{c.name}</h3>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-text-secondary">{c.count} files</span>
              {c.access === "private"
                ? <Lock className="w-3.5 h-3.5 text-text-secondary" />
                : <Globe className="w-3.5 h-3.5 text-accent-blue" />
              }
            </div>
          </div>
        ))}
        {/* Add new */}
        <div className="bg-bg-surface border-2 border-dashed border-border-custom rounded-2xl p-5 flex flex-col items-center justify-center text-text-secondary hover:border-accent-blue/40 hover:text-accent-blue transition-all cursor-pointer min-h-[160px]">
          <Plus className="w-8 h-8 mb-2" />
          <span className="text-sm font-medium">Create Collection</span>
        </div>
      </div>
    </div>
  )
}
