"use client"

import { useState, useEffect, useRef } from "react"
import { NavBar } from "@/components/navbar"
import { UploadCloud, CheckCircle2 } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export default function Dashboard() {
  const [activities, setActivities] = useState<any[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
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

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col relative overflow-hidden">
      {/* Background Orbs */}
      <div className="orb orb-1 -top-40 -left-40 opacity-45 dark:opacity-30 pointer-events-none" />
      <div className="orb orb-2 top-1/2 -right-40 opacity-35 dark:opacity-25 pointer-events-none" />
      <div className="orb orb-3 -bottom-40 left-1/3 opacity-30 dark:opacity-20 pointer-events-none" />

      <NavBar />
      <main className="flex-1 container mx-auto p-6 lg:p-10 space-y-8 max-w-6xl relative z-10">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-text-primary">
              Good morning, <span className="font-serif italic font-normal text-accent-violet">User</span>
            </h1>
            <p className="text-text-secondary mt-1">Here is your file organization overview.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Storage Donut Chart Mockup */}
          <div className="bg-card-bg/50 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-border-custom flex flex-col items-center justify-center space-y-4">
            <div className="w-32 h-32 rounded-full border-[12px] border-accent-blue border-r-border-custom flex items-center justify-center shadow-inner relative">
              <span className="text-xl font-mono font-bold text-text-primary">1.2 TB</span>
            </div>
            <p className="text-sm font-medium text-text-secondary">Storage Used (60%)</p>
          </div>

          {/* Inbox Dropzone */}
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`md:col-span-2 rounded-2xl p-8 border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group
              ${isDragging 
                ? 'bg-accent-blue/10 border-accent-blue shadow-[0_0_20px_rgba(74,140,255,0.15)] scale-[1.01]' 
                : 'bg-card-bg/40 backdrop-blur-md border-accent-blue/20 dark:border-accent-blue/10 hover:border-accent-blue/40 hover:bg-card-bg/60 shadow-sm'
              }
              ${!isUploading && !isDragging ? 'animate-pulse-slow' : ''}
            `}
          >
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={onFileSelect} 
            />
            <div className="w-16 h-16 bg-accent-blue/10 dark:bg-accent-blue/20 text-accent-blue rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
              <UploadCloud className={`w-8 h-8 ${isUploading ? 'animate-bounce' : ''}`} />
            </div>
            <h3 className="text-xl font-semibold text-text-primary">
              {isUploading ? "Uploading..." : "Inbox Dropzone"}
            </h3>
            <p className="text-text-secondary mt-2 max-w-sm mx-auto text-sm">
              {isDragging ? "Drop the file to upload!" : "Drag and drop your messy files here, or click to browse. Fileflow AI will instantly categorize and organize them."}
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card-bg/50 backdrop-blur-md rounded-2xl shadow-sm border border-border-custom overflow-hidden">
          <div className="px-6 py-5 border-b border-border-custom">
            <h2 className="text-lg font-semibold text-text-primary">Recent Activity</h2>
          </div>
          <div className="divide-y divide-border-custom">
            {activities.length === 0 ? (
              <div className="px-6 py-8 text-center text-text-secondary">No recent activity. Upload a file to get started!</div>
            ) : (
              activities.map((activity, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-bg-primary/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary font-mono">{activity.file}</p>
                      <p className="text-xs text-text-secondary">{activity.action}</p>
                    </div>
                  </div>
                  <span className="text-xs text-text-secondary/70 font-mono">{activity.time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
