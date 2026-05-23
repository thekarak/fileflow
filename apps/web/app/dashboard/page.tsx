"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import {
  UploadCloud,
  CheckCircle2,
  TrendingUp,
  Activity,
  Database,
  CloudLightning,
  Clock,
  FileText,
  Image as ImageIcon,
  FileCode,
  Archive,
  Music,
  Zap,
  Loader2,
  X,
  FolderOpen,
  RefreshCw,
  Trash2,
} from "lucide-react"

const API_URL = ""

// ─── Toast Notification ─────────────────────────────────────────────────────
type Toast = { id: number; message: string; type: "success" | "error" | "info" }

function ToastContainer({ toasts, remove }: { toasts: Toast[]; remove: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md text-sm font-medium pointer-events-auto animate-in slide-in-from-right duration-300
            ${t.type === "success" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : ""}
            ${t.type === "error"   ? "bg-red-500/10 border-red-500/30 text-red-400" : ""}
            ${t.type === "info"    ? "bg-accent-blue/10 border-accent-blue/30 text-accent-blue" : ""}
          `}
        >
          {t.type === "success" && <CheckCircle2 className="w-4 h-4 shrink-0" />}
          {t.type === "error"   && <X className="w-4 h-4 shrink-0" />}
          {t.type === "info"    && <Zap className="w-4 h-4 shrink-0 animate-pulse" />}
          <span>{t.message}</span>
          <button onClick={() => remove(t.id)} className="ml-2 opacity-60 hover:opacity-100">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}

// ─── Category Icon ───────────────────────────────────────────────────────────
function CategoryIcon({ category }: { category: string }) {
  const c = (category || "").toLowerCase()
  if (c.includes("image") || c.includes("photo")) return <ImageIcon className="w-4 h-4 text-emerald-400" />
  if (c.includes("code") || c.includes("script")) return <FileCode className="w-4 h-4 text-indigo-400" />
  if (c.includes("archive") || c.includes("zip")) return <Archive className="w-4 h-4 text-yellow-400" />
  if (c.includes("audio") || c.includes("music")) return <Music className="w-4 h-4 text-pink-400" />
  return <FileText className="w-4 h-4 text-blue-400" />
}

// ─── Mood Ring ───────────────────────────────────────────────────────────────
function getMoodRingClass(isDragging: boolean, mood: string) {
  if (!isDragging) return "border-border-custom hover:border-accent-blue/40 bg-card-bg/40"
  if (mood === "images") return "border-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.3)] bg-amber-500/5"
  if (mood === "mixed")  return "border-accent-violet shadow-[0_0_40px_rgba(139,92,246,0.35)] bg-accent-violet/5"
  return "border-accent-blue shadow-[0_0_40px_rgba(74,140,255,0.3)] bg-accent-blue/5"
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activities, setActivities] = useState<any[]>([])
  const [stats, setStats]           = useState({ org_score: 100, files_organized: 0, total_bytes: 0, categories: {} as Record<string, number> })
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isClearing, setIsClearing]   = useState(false)
  const [dragMood, setDragMood] = useState("docs")
  const [toasts, setToasts] = useState<Toast[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [apiOnline, setApiOnline] = useState<boolean | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toastIdRef = useRef(0)

  // ─ Toast helper ─
  const toast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = ++toastIdRef.current
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }, [])

  const removeToast = useCallback((id: number) => setToasts(p => p.filter(t => t.id !== id)), [])

  // ─ Fetch data ─
  const fetchAll = useCallback(async () => {
    try {
      const [actRes, statRes] = await Promise.all([
        fetch(`${API_URL}/api/v1/files/activity`),
        fetch(`${API_URL}/api/v1/files/stats`),
      ])
      if (actRes.ok)  setActivities(await actRes.json())
      if (statRes.ok) setStats(await statRes.json())
      setApiOnline(true)
    } catch {
      setApiOnline(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
    const interval = setInterval(fetchAll, 8000)
    return () => clearInterval(interval)
  }, [fetchAll])

  // ─ Upload ─
  const handleUpload = async (files: FileList | File[]) => {
    const arr = Array.from(files)
    setIsUploading(true)
    const results: any[] = []

    for (const file of arr) {
      toast(`Uploading ${file.name}…`, "info")
      try {
        const fd = new FormData()
        fd.append("file", file)
        const res = await fetch(`${API_URL}/api/v1/files/upload`, { method: "POST", body: fd })
        if (res.ok) {
          const data = await res.json()
          results.push(data)
          toast(`✓ ${file.name} → ${data.category}`, "success")
        } else {
          toast(`Failed to upload ${file.name}`, "error")
        }
      } catch {
        toast(`${file.name}: Server unreachable`, "error")
      }
    }

    setUploadedFiles(prev => [...results, ...prev].slice(0, 20))
    setIsUploading(false)
    await fetchAll()
  }

  // ─ Process Now ─
  const handleProcessNow = async () => {
    setIsProcessing(true)
    toast("Starting AI pipeline…", "info")
    try {
      const res = await fetch(`${API_URL}/api/v1/files/process`, { method: "POST" })
      if (res.ok) {
        const data = await res.json()
        if (data.processed === 0) {
          toast("No pending files — inbox is already clean!", "info")
        } else {
          toast(`AI processed ${data.processed} files`, "success")
        }
        await fetchAll()
      } else {
        toast("Process failed — check API connection", "error")
      }
    } catch {
      toast("Cannot reach API server", "error")
    }
    setIsProcessing(false)
  }

  // ─ Clear Inbox ─
  const handleClearInbox = async () => {
    if (!confirm("Clear all files from the activity log? This cannot be undone.")) return
    setIsClearing(true)
    try {
      const res = await fetch(`${API_URL}/api/v1/files/clear`, { method: "DELETE" })
      if (res.ok) {
        setActivities([])
        setUploadedFiles([])
        setStats({ org_score: 100, files_organized: 0, total_bytes: 0, categories: {} })
        toast("Inbox cleared", "success")
      } else {
        toast("Clear failed", "error")
      }
    } catch {
      toast("Cannot reach API server", "error")
    }
    setIsClearing(false)
  }

  // ─ Drag handlers ─
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
    const items = Array.from(e.dataTransfer.items || [])
    const imageCount = items.filter(i => i.type.startsWith("image/")).length
    if (imageCount > 0 && imageCount === items.length) setDragMood("images")
    else if (items.length > 2) setDragMood("mixed")
    else setDragMood("docs")
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files?.length) handleUpload(e.dataTransfer.files)
  }

  // ─ Helpers ─
  const formatBytes = (b: number) => {
    if (!b) return "0 B"
    if (b < 1024) return `${b} B`
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
    if (b < 1024 * 1024 * 1024) return `${(b / 1024 / 1024).toFixed(1)} MB`
    return `${(b / 1024 / 1024 / 1024).toFixed(2)} GB`
  }

  const entropyIndex = stats.files_organized > 0
    ? Math.max(0.1, 10 - (stats.org_score / 10)).toFixed(1)
    : "0.0"

  const moodBorderClass = getMoodRingClass(isDragging, dragMood)
  const moodLabel = isDragging
    ? dragMood === "images" ? "Amber glow — images detected!" : dragMood === "mixed" ? "Violet pulse — chaos detected!" : "Drop to classify!"
    : "Drag files here, or click to browse. Watch the mood ring react."

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <ToastContainer toasts={toasts} remove={removeToast} />

      {/* ─── API Status Banner ─── */}
      {apiOnline === false && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">
          <X className="w-4 h-4 shrink-0" />
          <span>API server is offline. Upload and organize features require the backend to be running at <code className="font-mono text-xs">{API_URL}</code></span>
        </div>
      )}

      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary">
            Dashboard <span className="text-text-secondary font-normal text-lg">· FileFlow</span>
          </h1>
          <p className="text-text-secondary mt-1 text-sm">Your AI-powered file intelligence overview.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => toast("Google Drive OAuth — configure in Settings", "info")}
            className="px-3 py-2 bg-bg-surface border border-border-custom rounded-lg text-sm font-medium hover:bg-bg-primary transition-colors flex items-center gap-2"
          >
            <CloudLightning className="w-4 h-4 text-accent-blue" />
            Connect Drive
          </button>
          <button
            onClick={handleProcessNow}
            disabled={isProcessing}
            className="px-4 py-2 bg-accent-blue hover:bg-accent-blue/90 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
          >
            {isProcessing
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
              : <><Zap className="w-4 h-4" /> Process Now</>
            }
          </button>
          <button
            onClick={fetchAll}
            className="p-2 bg-bg-surface border border-border-custom rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-primary transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── Analytics Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Org Score */}
        <div className="bg-glass-bg border border-border-custom rounded-2xl p-5 hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-medium text-text-secondary">Org Score</span>
            <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-primary">{stats.org_score}<span className="text-lg text-text-secondary">%</span></div>
          <div className="w-full h-1.5 bg-bg-primary rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${stats.org_score}%` }} />
          </div>
        </div>

        {/* Entropy Index */}
        <div className="bg-glass-bg border border-border-custom rounded-2xl p-5 hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-medium text-text-secondary">Entropy Index</span>
            <div className="w-7 h-7 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-orange-500" />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-primary">{entropyIndex}</div>
          <p className="text-xs text-text-secondary mt-1">{parseFloat(entropyIndex) < 3 ? "Low chaos ✓" : parseFloat(entropyIndex) < 6 ? "Moderate" : "High chaos!"}</p>
        </div>

        {/* Files Organized */}
        <div className="bg-glass-bg border border-border-custom rounded-2xl p-5 hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-medium text-text-secondary">Files Organized</span>
            <div className="w-7 h-7 rounded-full bg-accent-blue/10 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent-blue" />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-primary">{stats.files_organized}</div>
          <Link href="/dashboard/files" className="text-xs text-accent-blue hover:underline mt-1 block">View all →</Link>
        </div>

        {/* Storage */}
        <div className="bg-glass-bg border border-border-custom rounded-2xl p-5 hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-medium text-text-secondary">Data Processed</span>
            <div className="w-7 h-7 rounded-full bg-accent-violet/10 flex items-center justify-center">
              <Database className="w-3.5 h-3.5 text-accent-violet" />
            </div>
          </div>
          <div className="text-2xl font-bold text-text-primary">{formatBytes(stats.total_bytes)}</div>
          <p className="text-xs text-text-secondary mt-1">{Object.keys(stats.categories).length} categories</p>
        </div>
      </div>

      {/* ─── Main Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Smart Inbox */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-text-primary">Smart Inbox — Drop Zone</h2>
            <button
              onClick={handleClearInbox}
              disabled={isClearing}
              className="text-xs font-medium text-red-400 hover:text-red-500 flex items-center gap-1 disabled:opacity-50"
            >
              {isClearing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
              Clear All
            </button>
          </div>

          {/* Mood Ring Drop Zone */}
          <div
            onDragOver={onDragOver}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`rounded-3xl p-10 border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-500 group min-h-[260px] ${moodBorderClass}`}
          >
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              multiple
              onChange={(e) => e.target.files?.length && handleUpload(e.target.files)}
            />

            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110
              ${isDragging && dragMood === "images"  ? "bg-amber-400/20 text-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.3)]"  : ""}
              ${isDragging && dragMood === "mixed"   ? "bg-accent-violet/20 text-accent-violet shadow-[0_0_30px_rgba(139,92,246,0.3)]" : ""}
              ${(!isDragging || dragMood === "docs") ? "bg-accent-blue/10 text-accent-blue group-hover:shadow-[0_0_25px_rgba(74,140,255,0.2)]" : ""}
            `}>
              {isUploading
                ? <Loader2 className="w-9 h-9 animate-spin" />
                : <UploadCloud className="w-9 h-9" />
              }
            </div>

            <h3 className="text-xl font-bold text-text-primary mb-2">
              {isUploading ? "AI is classifying…" : "Drop your files here"}
            </h3>
            <p className="text-sm text-text-secondary max-w-sm mx-auto leading-relaxed">{moodLabel}</p>

            {!isUploading && (
              <div className="mt-6 flex gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-bg-primary border border-border-custom text-xs text-text-secondary">PDFs</span>
                <span className="px-3 py-1.5 rounded-lg bg-bg-primary border border-border-custom text-xs text-text-secondary">Images</span>
                <span className="px-3 py-1.5 rounded-lg bg-bg-primary border border-border-custom text-xs text-text-secondary">Code</span>
                <span className="px-3 py-1.5 rounded-lg bg-bg-primary border border-border-custom text-xs text-text-secondary">Archives</span>
              </div>
            )}
          </div>

          {/* Just Uploaded — live results */}
          {uploadedFiles.length > 0 && (
            <div className="rounded-2xl border border-border-custom bg-bg-surface overflow-hidden">
              <div className="px-4 py-3 border-b border-border-custom flex items-center justify-between bg-bg-primary/40">
                <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Just Organized</h3>
                <span className="text-xs text-accent-blue font-medium">{uploadedFiles.length} files</span>
              </div>
              <div className="divide-y divide-border-custom max-h-[220px] overflow-y-auto">
                {uploadedFiles.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-bg-primary/40 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <CategoryIcon category={f.category} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{f.filename}</p>
                      <p className="text-xs text-text-secondary font-mono truncate">→ {f.proposed_path}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-text-secondary">{formatBytes(f.size_bytes)}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-text-primary">Recent Activity</h2>
            <button onClick={fetchAll} className="text-xs font-medium text-text-secondary hover:text-text-primary flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>

          <div className="bg-glass-bg border border-border-custom rounded-2xl overflow-hidden flex flex-col" style={{ minHeight: 420 }}>
            <div className="flex-1 overflow-y-auto divide-y divide-border-custom">
              {activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-bg-surface border border-border-custom flex items-center justify-center text-text-secondary/40">
                    <FolderOpen className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary">Inbox is empty</h4>
                    <p className="text-xs text-text-secondary mt-1">Drop a file in the zone to get started.</p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-accent-blue text-white text-xs font-semibold rounded-lg hover:bg-accent-blue/90 transition-colors"
                  >
                    Upload first file
                  </button>
                </div>
              ) : (
                activities.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 hover:bg-bg-primary/50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CategoryIcon category={a.category || ""} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-text-primary truncate">{a.file}</p>
                      <p className="text-xs text-text-secondary mt-0.5 truncate">{a.action}</p>
                    </div>
                    <span className="text-[10px] text-text-secondary/60 whitespace-nowrap shrink-0 pt-0.5">{a.time}</span>
                  </div>
                ))
              )}
            </div>

            {activities.length > 0 && (
              <div className="px-4 py-3 border-t border-border-custom bg-bg-primary/30 flex justify-between items-center">
                <span className="text-xs text-text-secondary">{activities.length} total actions</span>
                <Link href="/dashboard/files" className="text-xs font-medium text-accent-blue hover:underline">
                  Review organization →
                </Link>
              </div>
            )}
          </div>

          {/* Quick Nav Cards */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "All Files", href: "/dashboard/files", icon: FolderOpen, color: "text-accent-blue" },
              { label: "Duplicates", href: "/dashboard/duplicates", icon: Database, color: "text-red-400" },
              { label: "Rules", href: "/dashboard/rules", icon: Zap, color: "text-emerald-500" },
              { label: "Analytics", href: "/dashboard/analytics", icon: Activity, color: "text-accent-violet" },
            ].map(({ label, href, icon: Icon, color }) => (
              <Link key={label} href={href} className="flex items-center gap-2 p-3 bg-bg-surface border border-border-custom rounded-xl hover:border-accent-blue/30 hover:bg-bg-primary transition-all group">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-xs font-medium text-text-primary">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Category Breakdown ─── */}
      {Object.keys(stats.categories).length > 0 && (
        <div className="bg-glass-bg border border-border-custom rounded-2xl p-6">
          <h2 className="text-base font-semibold text-text-primary mb-4">Category Breakdown</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(stats.categories).map(([cat, count]) => (
              <div key={cat} className="flex items-center gap-2 px-3 py-2 bg-bg-primary border border-border-custom rounded-xl">
                <CategoryIcon category={cat} />
                <span className="text-sm font-medium text-text-primary capitalize">{cat}</span>
                <span className="text-xs font-bold text-text-secondary bg-bg-surface px-1.5 py-0.5 rounded-md">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
