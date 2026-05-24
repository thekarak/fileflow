"use client"

import { useState, useRef, useCallback } from "react"
import {
  FilePlus, FolderPlus, ArrowUp, ShieldCheck,
  ChevronDown, CheckCircle2, Loader2, X, Play, AlertCircle
} from "lucide-react"
import { apiPath } from "../lib/api"

const SORT_OPTIONS = [
  "Alphabetical",
  "File type",
  "Priority (High to Low)",
  "Size (Largest first)",
  "Size (Smallest first)",
]

const CATEGORY_ICON: Record<string, string> = {
  Documents: "📄",
  Images: "🖼️",
  Video: "🎬",
  Audio: "🎵",
  Code: "💻",
  Archives: "🗜️",
  Other: "📦",
}

type QueuedFile = {
  file: File
  status: "pending" | "uploading" | "done" | "error"
  category?: string
  error?: string
}

interface BatchOrganizerProps {
  onUpload?: (files: FileList | File[]) => void
}

export function BatchOrganizer({ onUpload }: BatchOrganizerProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [saveLocation, setSaveLocation] = useState<"downloads" | "custom">("downloads")
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [selectedSort, setSelectedSort] = useState("Alphabetical")
  const [queue, setQueue] = useState<QueuedFile[]>([])
  const [isOrganizing, setIsOrganizing] = useState(false)
  const [doneCount, setDoneCount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files)
    setQueue(prev => {
      const existingNames = new Set(prev.map(q => q.file.name))
      const newItems: QueuedFile[] = arr
        .filter(f => !existingNames.has(f.name))
        .map(f => ({ file: f, status: "pending" }))
      return [...prev, ...newItems]
    })
  }, [])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files)
  }
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addFiles(e.target.files)
    e.target.value = "" // reset so same file can be re-added
  }

  const removeFromQueue = (index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index))
  }

  const handleOrganize = async () => {
    const pending = queue.filter(q => q.status === "pending")
    if (pending.length === 0) return

    setIsOrganizing(true)
    setDoneCount(0)
    let done = 0

    // Sort the queue first
    const sorted = [...pending].sort((a, b) => {
      if (selectedSort === "Alphabetical") return a.file.name.localeCompare(b.file.name)
      if (selectedSort === "File type") return a.file.type.localeCompare(b.file.type)
      if (selectedSort === "Size (Largest first)") return b.file.size - a.file.size
      if (selectedSort === "Size (Smallest first)") return a.file.size - b.file.size
      return 0
    })

    for (const item of sorted) {
      // Mark as uploading
      setQueue(prev =>
        prev.map(q => q.file.name === item.file.name ? { ...q, status: "uploading" } : q)
      )

      try {
        const fd = new FormData()
        fd.append("file", item.file)
        const res = await fetch(apiPath("/api/v1/files/upload"), { method: "POST", body: fd })

        if (res.ok) {
          const data = await res.json()
          done++
          setDoneCount(done)
          setQueue(prev =>
            prev.map(q =>
              q.file.name === item.file.name
                ? { ...q, status: "done", category: data.category || "Other" }
                : q
            )
          )
          // Also fire parent callback if provided
          if (onUpload) onUpload([item.file])
        } else {
          setQueue(prev =>
            prev.map(q =>
              q.file.name === item.file.name
                ? { ...q, status: "error", error: `Server error ${res.status}` }
                : q
            )
          )
        }
      } catch {
        setQueue(prev =>
          prev.map(q =>
            q.file.name === item.file.name
              ? { ...q, status: "error", error: "Upload failed" }
              : q
          )
        )
      }
    }

    setIsOrganizing(false)
  }

  const pendingCount = queue.filter(q => q.status === "pending").length
  const allDone = queue.length > 0 && queue.every(q => q.status === "done")

  return (
    <div className="w-full max-w-lg mx-auto bg-[#0a1128] border border-border-custom/50 rounded-[2rem] p-5 shadow-2xl space-y-5 font-sans">

      {/* SOURCE SECTION */}
      <div className="space-y-3">
        <h3 className="text-[11px] font-bold text-text-secondary/70 tracking-widest pl-1">SOURCE</h3>

        <div className="flex gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 bg-gradient-to-br from-blue-600 to-blue-500 hover:opacity-90 active:scale-95 text-white rounded-2xl py-3.5 flex items-center justify-center gap-2 font-medium transition-all"
          >
            <FilePlus className="w-5 h-5" />
            <span>Add Files</span>
          </button>

          <button
            onClick={() => folderInputRef.current?.click()}
            className="flex-1 bg-gradient-to-br from-purple-600 to-indigo-500 hover:opacity-90 active:scale-95 text-white rounded-2xl py-3.5 flex items-center justify-center gap-2 font-medium transition-all"
          >
            <FolderPlus className="w-5 h-5" />
            <span>Add Folders</span>
          </button>
        </div>

        {/* Hidden Inputs */}
        <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileSelect} />
        {/* @ts-ignore */}
        <input type="file" ref={folderInputRef} className="hidden" webkitdirectory="" directory="" multiple onChange={handleFileSelect} />

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative h-36 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? "border-accent-blue bg-accent-blue/10 scale-[1.01]"
              : "border-border-custom/40 bg-bg-surface/30 hover:border-accent-blue/50 hover:bg-accent-blue/5"
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors ${isDragging ? "bg-accent-blue/20" : "bg-border-custom/20"}`}>
            <ArrowUp className={`w-4 h-4 transition-colors ${isDragging ? "text-accent-blue" : "text-text-secondary"}`} />
          </div>
          <p className="text-text-primary font-medium text-sm">Drag &amp; drop files or folders here</p>
          <p className="text-text-secondary text-xs mt-1">Or click to browse · Multiple items supported</p>
        </div>
      </div>

      {/* FILE QUEUE */}
      {queue.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] font-bold text-text-secondary/70 tracking-widest">FILES QUEUED ({queue.length})</h3>
            {!isOrganizing && (
              <button
                onClick={() => setQueue([])}
                className="text-[10px] text-red-400 hover:text-red-300 font-medium transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
            {queue.map((item, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                item.status === "done" ? "border-emerald-500/30 bg-emerald-500/5"
                : item.status === "error" ? "border-red-500/30 bg-red-500/5"
                : item.status === "uploading" ? "border-accent-blue/30 bg-accent-blue/5"
                : "border-border-custom/30 bg-bg-surface/20"
              }`}>
                <div className="shrink-0 text-lg">
                  {item.status === "done" ? (CATEGORY_ICON[item.category || "Other"] || "📦")
                   : item.status === "error" ? "❌"
                   : item.status === "uploading" ? <Loader2 className="w-4 h-4 text-accent-blue animate-spin" />
                   : "📎"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{item.file.name}</p>
                  <p className="text-[10px] text-text-secondary">
                    {item.status === "done" ? `✓ Moved to ${item.category}`
                     : item.status === "error" ? item.error
                     : item.status === "uploading" ? "Classifying with AI…"
                     : `${(item.file.size / 1024).toFixed(1)} KB · pending`}
                  </p>
                </div>
                {item.status === "pending" && !isOrganizing && (
                  <button onClick={() => removeFromQueue(i)} className="p-1 text-text-secondary hover:text-red-400 transition-colors shrink-0">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                {item.status === "done" && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                {item.status === "error" && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SAVE LOCATION SECTION */}
      <div className="space-y-3">
        <h3 className="text-[11px] font-bold text-text-secondary/70 tracking-widest pl-1">SAVE LOCATION</h3>

        <div className="space-y-2">
          {(["downloads", "custom"] as const).map(loc => (
            <button
              key={loc}
              onClick={() => setSaveLocation(loc)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-colors ${
                saveLocation === loc
                  ? "border-accent-blue bg-accent-blue/10"
                  : "border-border-custom/40 bg-bg-surface/30 hover:border-border-custom"
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                saveLocation === loc ? "border-accent-blue" : "border-text-secondary/40"
              }`}>
                {saveLocation === loc && <div className="w-2.5 h-2.5 rounded-full bg-accent-blue" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  {loc === "downloads" ? "Save to Downloads" : "Choose Save Location"}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {loc === "downloads" ? "Default Location" : "Select a custom folder"}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* SORT DROPDOWN */}
      <div className="relative">
        <button
          onClick={() => setShowSortDropdown(!showSortDropdown)}
          className="w-full flex items-center justify-between p-4 rounded-2xl border border-border-custom/40 bg-bg-surface/30 hover:border-border-custom transition-colors"
        >
          <div className="flex items-center gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
              <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            <span className="text-sm font-medium text-text-primary">{selectedSort}</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${showSortDropdown ? "rotate-180" : ""}`} />
        </button>

        {showSortDropdown && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)} />
            <div className="absolute bottom-full left-0 w-full mb-2 bg-[#202024] border border-[#303036] rounded-2xl shadow-2xl z-50 overflow-hidden py-1">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => { setSelectedSort(opt); setShowSortDropdown(false) }}
                  className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors"
                >
                  <span className="text-sm text-text-primary">{opt}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedSort === opt ? "border-orange-500" : "border-text-secondary/30"
                  }`}>
                    {selectedSort === opt && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ORGANIZE BUTTON */}
      <button
        onClick={handleOrganize}
        disabled={pendingCount === 0 || isOrganizing}
        className={`w-full rounded-2xl py-4 flex items-center justify-center gap-2.5 font-semibold transition-all active:scale-95 ${
          allDone
            ? "bg-emerald-600/80 border border-emerald-500/30 text-white"
            : pendingCount === 0
            ? "bg-bg-surface/50 border border-border-custom/30 text-text-secondary cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border border-blue-500/30 text-white shadow-[0_0_20px_rgba(74,140,255,0.2)] hover:shadow-[0_0_30px_rgba(74,140,255,0.35)] cursor-pointer"
        }`}
      >
        {isOrganizing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Organizing {doneCount}/{queue.filter(q => q.status !== "pending" || false).length + doneCount}…</span>
          </>
        ) : allDone ? (
          <>
            <CheckCircle2 className="w-5 h-5" />
            <span>All {queue.length} files organized!</span>
          </>
        ) : (
          <>
            <Play className="w-5 h-5 fill-white" />
            <span>{pendingCount > 0 ? `Organize ${pendingCount} file${pendingCount > 1 ? "s" : ""}` : "Add files to organize"}</span>
          </>
        )}
      </button>

      {/* FOOTER */}
      <div className="flex items-start gap-3 bg-blue-950/20 rounded-2xl p-4">
        <ShieldCheck className="w-5 h-5 text-accent-blue shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-text-primary">Secure. Private. Local First.</p>
          <p className="text-xs text-text-secondary">Your files stay on your device.</p>
        </div>
      </div>
    </div>
  )
}
