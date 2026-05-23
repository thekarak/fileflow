"use client"

import { useEffect, useState, useRef } from "react"
import { UploadCloud, Loader2, CheckCircle2, FileText, Clock } from "lucide-react"

const API_URL = ""

export default function InboxPage() {
  const [activities, setActivities] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchActivities = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/files/activity`)
      if (res.ok) setActivities(await res.json())
    } catch {}
  }

  useEffect(() => { fetchActivities() }, [])

  const handleUpload = async (files: FileList) => {
    setIsUploading(true)
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append("file", file)
      try {
        await fetch(`${API_URL}/api/v1/files/upload`, { method: "POST", body: fd })
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

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); e.dataTransfer.files?.length && handleUpload(e.dataTransfer.files) }}
        onClick={() => fileInputRef.current?.click()}
        className={`rounded-3xl p-16 border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-500
          ${isDragging ? "border-accent-blue bg-accent-blue/5 shadow-[0_0_40px_rgba(74,140,255,0.2)]" : "border-border-custom hover:border-accent-blue/40 bg-card-bg/40"}
        `}
      >
        <input type="file" className="hidden" ref={fileInputRef} multiple onChange={(e) => e.target.files && handleUpload(e.target.files)} />
        <div className="w-20 h-20 rounded-full bg-accent-blue/10 text-accent-blue flex items-center justify-center mb-6">
          {isUploading ? <Loader2 className="w-10 h-10 animate-spin" /> : <UploadCloud className="w-10 h-10" />}
        </div>
        <h3 className="text-2xl font-bold text-text-primary mb-2">
          {isUploading ? "Classifying with AI…" : "Drop files here"}
        </h3>
        <p className="text-text-secondary text-sm">Or click to browse. Supports PDFs, images, code, archives and more.</p>
      </div>

      {activities.length > 0 && (
        <div className="bg-bg-surface border border-border-custom rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border-custom bg-bg-primary/40">
            <h2 className="text-sm font-semibold text-text-primary">Processed Files</h2>
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
