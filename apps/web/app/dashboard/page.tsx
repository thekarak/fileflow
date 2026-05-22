"use client"

import { useState, useEffect, useRef } from "react"
import { 
  UploadCloud, 
  CheckCircle2, 
  TrendingUp, 
  Activity, 
  Database,
  CloudLightning,
  Clock,
  Play,
  FileText
} from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export default function Dashboard() {
  const [activities, setActivities] = useState<any[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [dragMood, setDragMood] = useState<"neutral" | "mixed">("neutral")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchActivities = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/files/activity`)
      if (res.ok) {
        const data = await res.json()
        setActivities(data)
      }
    } catch (e) {
      console.error("Failed to fetch activities")
    }
  }

  useEffect(() => {
    fetchActivities()
    const interval = setInterval(fetchActivities, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    
    try {
      await fetch(`${API_URL}/api/v1/files/upload`, {
        method: "POST",
        body: formData
      })
      await fetchActivities()
    } catch (e) {
      console.error("Upload failed")
    } finally {
      setIsUploading(false)
      setDragMood("neutral")
    }
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
    // Simulate "mood ring" by checking if multiple items are dragged
    if (e.dataTransfer.items && e.dataTransfer.items.length > 2) {
      setDragMood("mixed")
    } else {
      setDragMood("neutral")
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0])
    }
  }

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0])
    }
  }

  // Determine Mood Ring classes
  const moodBorderClass = isDragging 
    ? dragMood === "mixed" 
      ? "border-accent-violet shadow-[0_0_30px_rgba(139,92,246,0.3)] bg-accent-violet/5"
      : "border-accent-blue shadow-[0_0_30px_rgba(74,140,255,0.3)] bg-accent-blue/5"
    : "border-border-custom hover:border-accent-blue/40 bg-card-bg/40"

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            Good morning, <span className="font-serif italic font-normal text-accent-violet">User</span>
          </h1>
          <p className="text-text-secondary mt-1">Here is your FileFlow intelligence overview.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-bg-surface border border-border-custom rounded-lg text-sm font-medium hover:bg-bg-primary transition-colors flex items-center gap-2">
            <CloudLightning className="w-4 h-4 text-accent-blue" />
            Connect Drive
          </button>
          <button className="px-4 py-2 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
            Process Now
          </button>
        </div>
      </div>

      {/* Analytics Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-glass-bg border border-border-custom rounded-2xl p-5 hover:-translate-y-1 transition-all">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-text-secondary">Org Score</span>
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-primary">94<span className="text-xl text-text-secondary">%</span></div>
          <div className="w-full h-1.5 bg-bg-primary rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-emerald-500 w-[94%]" />
          </div>
        </div>

        <div className="bg-glass-bg border border-border-custom rounded-2xl p-5 hover:-translate-y-1 transition-all">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-text-secondary">Entropy Index</span>
            <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Activity className="w-4 h-4 text-orange-500" />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-primary">2.4<span className="text-sm text-text-secondary font-normal ml-2">Low chaos</span></div>
          <div className="w-full flex gap-1 mt-4">
            <div className="h-1.5 flex-1 bg-orange-500 rounded-full" />
            <div className="h-1.5 flex-1 bg-orange-500/30 rounded-full" />
            <div className="h-1.5 flex-1 bg-bg-primary rounded-full" />
          </div>
        </div>

        <div className="bg-glass-bg border border-border-custom rounded-2xl p-5 hover:-translate-y-1 transition-all">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-text-secondary">Files Organized</span>
            <div className="w-8 h-8 rounded-full bg-accent-blue/10 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-accent-blue" />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-primary">1,248</div>
          <p className="text-xs text-text-secondary mt-2">+124 this week</p>
        </div>

        <div className="bg-glass-bg border border-border-custom rounded-2xl p-5 hover:-translate-y-1 transition-all">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-text-secondary">Storage Used</span>
            <div className="w-8 h-8 rounded-full bg-accent-violet/10 flex items-center justify-center">
              <Database className="w-4 h-4 text-accent-violet" />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-primary">1.2 <span className="text-xl text-text-secondary">TB</span></div>
          <div className="w-full h-1.5 bg-bg-primary rounded-full mt-4 overflow-hidden flex">
            <div className="h-full bg-accent-blue w-[40%]" />
            <div className="h-full bg-accent-violet w-[20%]" />
          </div>
        </div>
      </div>

      {/* Main Grid: Smart Inbox & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Smart Inbox (Left Column, span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Smart Inbox</h2>
            <button className="text-xs font-medium text-accent-blue hover:underline">Clear Inbox</button>
          </div>
          
          <div 
            onDragOver={onDragOver}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`rounded-3xl p-12 border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-500 group ${moodBorderClass}`}
          >
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={onFileSelect} 
            />
            
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 shadow-inner
              ${dragMood === "mixed" ? 'bg-accent-violet/20 text-accent-violet' : 'bg-accent-blue/10 dark:bg-accent-blue/20 text-accent-blue'}
            `}>
              <UploadCloud className={`w-10 h-10 ${isUploading ? 'animate-bounce' : ''}`} />
            </div>
            
            <h3 className="text-2xl font-bold text-text-primary mb-2">
              {isUploading ? "Processing with AI..." : "Drop Zone"}
            </h3>
            
            <p className="text-text-secondary max-w-md mx-auto text-sm leading-relaxed">
              {isDragging 
                ? dragMood === "mixed" 
                  ? "Whoa, mixed chaos detected! Drop to let AI untangle this." 
                  : "Drop the file to instantly organize!" 
                : "Drag and drop your messy files here, or click to browse. Watch the mood ring react."}
            </p>

            <div className="mt-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="px-3 py-1.5 rounded-md bg-bg-primary border border-border-custom text-xs text-text-secondary flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Docs
              </div>
              <div className="px-3 py-1.5 rounded-md bg-bg-primary border border-border-custom text-xs text-text-secondary flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5" /> Media
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity (Right Column) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Recent Activity</h2>
            <button className="text-xs font-medium text-text-secondary hover:text-text-primary">View All</button>
          </div>

          <div className="bg-glass-bg backdrop-blur-md rounded-2xl shadow-sm border border-border-custom overflow-hidden h-[400px] flex flex-col">
            <div className="flex-1 overflow-y-auto divide-y divide-border-custom">
              {activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-bg-surface border border-border-custom flex items-center justify-center text-text-secondary/50">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary">No recent activity</h4>
                    <p className="text-xs text-text-secondary mt-1">Upload a file to see FileFlow in action.</p>
                  </div>
                </div>
              ) : (
                activities.map((activity, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 hover:bg-bg-primary/50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-text-primary font-mono truncate">{activity.file}</p>
                      <p className="text-xs text-text-secondary mt-0.5 truncate">{activity.action}</p>
                    </div>
                    <span className="text-[10px] text-text-secondary/70 whitespace-nowrap">{activity.time}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
