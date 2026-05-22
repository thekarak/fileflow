"use client"

import { Trash2, RotateCcw, AlertTriangle } from "lucide-react"

export default function TrashPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Trash</h1>
          <p className="text-sm text-text-secondary mt-1">Files deleted in the last 30 days.</p>
        </div>
        <button className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/30 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors flex items-center gap-2">
          <Trash2 className="w-4 h-4" /> Empty Trash
        </button>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
        <p className="text-sm text-text-secondary">Files in the trash will be permanently deleted after 30 days.</p>
      </div>

      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-bg-surface border border-border-custom flex items-center justify-center text-text-secondary/30">
          <Trash2 className="w-8 h-8" />
        </div>
        <h3 className="font-semibold text-text-primary">Trash is empty</h3>
        <p className="text-sm text-text-secondary">Files you delete from FileFlow will appear here.</p>
      </div>
    </div>
  )
}
