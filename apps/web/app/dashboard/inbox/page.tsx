"use client"

import { useEffect, useState, useRef } from "react"
import { CheckCircle2, Clock, Trash2 } from "lucide-react"
import { apiPath } from "../../../lib/api"
import { BatchOrganizer } from "../../../components/batch-organizer"

type ActivityItem = {
  file: string
  action: string
  time: string
  size?: number
  size_bytes?: number
}

export default function InboxPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchActivities = async () => {
    try {
      const res = await fetch(apiPath("/api/v1/files/activity"))
      if (res.ok) {
        const data = await res.json()
        
        let clearedSignatures: string[] = []
        try {
          clearedSignatures = JSON.parse(localStorage.getItem("fileflow_cleared_signatures") || "[]")
        } catch {}

        const filtered = data.filter((item: any) => {
          const sig = `${item.file}::${item.action}::${item.size || item.size_bytes || 0}`
          return !clearedSignatures.includes(sig)
        })
        setActivities(filtered)
      }
    } catch {}
  }

  useEffect(() => { fetchActivities() }, [])

  const handleUpload = async (files: FileList) => {
    const arr = Array.from(files)
    
    // Remove these uploaded filenames from cleared signatures in localStorage
    try {
      const existing: string[] = JSON.parse(localStorage.getItem("fileflow_cleared_signatures") || "[]")
      const updated = existing.filter(sig => {
        const filename = sig.split("::")[0]
        return !arr.some(f => f.name === filename)
      })
      localStorage.setItem("fileflow_cleared_signatures", JSON.stringify(updated))
    } catch {}

    setIsUploading(true)
    for (const file of arr) {
      const fd = new FormData()
      fd.append("file", file)
      try {
        await fetch(apiPath("/api/v1/files/upload"), { method: "POST", body: fd })
      } catch {}
    }
    setIsUploading(false)
    await fetchActivities()
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Inbox</h1>
        <p className="text-sm text-text-secondary mt-1">Everything you drop here gets classified by AI automatically.</p>
      </div>

      <div className="py-4">
        <BatchOrganizer onUpload={handleUpload} />
      </div>

      {activities.length > 0 && (
        <div className="bg-bg-surface border border-border-custom rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border-custom bg-bg-primary/40 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-text-primary">Processed Files</h2>
            <button
              onClick={() => {
                if (!confirm("Clear all files from the activity log? This cannot be undone.")) return
                try {
                  const sigs = activities.map(item => `${item.file}::${item.action}::${item.size || item.size_bytes || 0}`)
                  const existing = JSON.parse(localStorage.getItem("fileflow_cleared_signatures") || "[]")
                  const updated = Array.from(new Set([...existing, ...sigs]))
                  localStorage.setItem("fileflow_cleared_signatures", JSON.stringify(updated))
                } catch {}
                setActivities([])
                fetch(apiPath("/api/v1/files/clear"), { method: "DELETE" }).catch(() => {})
              }}
              className="text-xs font-medium text-red-400 hover:text-red-500 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Clear All
            </button>
          </div>
          <div className="divide-y divide-border-custom max-h-96 overflow-y-auto">
            {activities.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-4 hover:bg-bg-primary/30 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{a.file}</p>
                  <p className="text-xs text-text-secondary truncate">{a.action}</p>
                </div>
                <span className="text-xs text-text-secondary whitespace-nowrap">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activities.length === 0 && !isUploading && (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
          <Clock className="w-10 h-10 text-text-secondary/30" />
          <p className="text-sm text-text-secondary">No files processed yet. Drop something above!</p>
        </div>
      )}
    </div>
  )
}
