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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <NavBar />
      <main className="flex-1 container mx-auto p-6 lg:p-10 space-y-8 max-w-6xl">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Good morning, User</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Here is your file organization overview.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Storage Donut Chart Mockup */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center space-y-4">
            <div className="w-32 h-32 rounded-full border-[12px] border-blue-600 border-r-zinc-100 dark:border-r-zinc-800 flex items-center justify-center">
              <span className="text-xl font-bold">1.2 TB</span>
            </div>
            <p className="text-sm font-medium text-zinc-500">Storage Used (60%)</p>
          </div>

          {/* Inbox Dropzone */}
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`md:col-span-2 rounded-2xl p-8 border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-colors
              ${isDragging 
                ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500' 
                : 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-300 dark:border-blue-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20'
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
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
              <UploadCloud className={`w-8 h-8 ${isUploading ? 'animate-bounce' : ''}`} />
            </div>
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
              {isUploading ? "Uploading..." : "Inbox Dropzone"}
            </h3>
            <p className="text-blue-600/80 dark:text-blue-300 mt-2 max-w-sm mx-auto">
              {isDragging ? "Drop the file to upload!" : "Drag and drop your messy files here, or click to browse. Fileflow AI will instantly categorize and organize them."}
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
          <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {activities.length === 0 ? (
              <div className="px-6 py-8 text-center text-zinc-500">No recent activity. Upload a file to get started!</div>
            ) : (
              activities.map((activity, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{activity.file}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{activity.action}</p>
                    </div>
                  </div>
                  <span className="text-xs text-zinc-400">{activity.time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
