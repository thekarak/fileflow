"use client"

import { useState, useRef } from "react"
import { FilePlus, FolderPlus, ArrowUp, ShieldCheck, ChevronDown, CheckCircle2 } from "lucide-react"

const SORT_OPTIONS = [
  "Alphabetical",
  "File type",
  "Priority (High to Low)",
  "Size (Largest first)",
  "Size (Smallest first)"
]

interface BatchOrganizerProps {
  onUpload?: (files: FileList | File[]) => void;
}

export function BatchOrganizer({ onUpload }: BatchOrganizerProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [saveLocation, setSaveLocation] = useState<"downloads" | "custom">("downloads")
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [selectedSort, setSelectedSort] = useState("Alphabetical")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files?.length && onUpload) {
      onUpload(e.dataTransfer.files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length && onUpload) {
      onUpload(e.target.files)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-[#0a1128] border border-border-custom/50 rounded-[2rem] p-5 shadow-2xl space-y-6 font-sans">
      
      {/* SOURCE SECTION */}
      <div className="space-y-4">
        <h3 className="text-[11px] font-bold text-text-secondary/70 tracking-widest pl-1">SOURCE</h3>
        
        <div className="flex gap-3">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 bg-gradient-to-br from-blue-600 to-blue-500 hover:opacity-90 text-white rounded-2xl py-3.5 flex items-center justify-center gap-2 font-medium transition-opacity"
          >
            <FilePlus className="w-5 h-5" />
            <span>Add Files</span>
          </button>
          
          <button 
            onClick={() => folderInputRef.current?.click()}
            className="flex-1 bg-gradient-to-br from-purple-600 to-indigo-500 hover:opacity-90 text-white rounded-2xl py-3.5 flex items-center justify-center gap-2 font-medium transition-opacity"
          >
            <FolderPlus className="w-5 h-5" />
            <span>Add Folders</span>
          </button>
        </div>

        {/* Hidden Inputs */}
        <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileSelect} />
        {/* @ts-ignore - webkitdirectory is a non-standard attribute but works in modern browsers */}
        <input type="file" ref={folderInputRef} className="hidden" webkitdirectory="" directory="" multiple onChange={handleFileSelect} />

        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative h-40 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all duration-300 ${
            isDragging 
              ? "border-accent-blue bg-accent-blue/10" 
              : "border-border-custom/40 bg-bg-surface/30"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-border-custom/20 flex items-center justify-center mb-3">
            <ArrowUp className="w-4 h-4 text-text-secondary" />
          </div>
          <p className="text-text-primary font-medium">Drag & drop files or folders here</p>
          <p className="text-text-secondary text-xs mt-1">You can add multiple items in a batch</p>
        </div>
      </div>

      {/* SAVE LOCATION SECTION */}
      <div className="space-y-4">
        <h3 className="text-[11px] font-bold text-text-secondary/70 tracking-widest pl-1 mt-6">SAVE LOCATION</h3>
        
        <div className="space-y-3">
          <button 
            onClick={() => setSaveLocation("downloads")}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-colors ${
              saveLocation === "downloads" 
                ? "border-accent-blue bg-accent-blue/10" 
                : "border-border-custom/40 bg-bg-surface/30 hover:border-border-custom"
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
              saveLocation === "downloads" ? "border-accent-blue" : "border-text-secondary/40"
            }`}>
              {saveLocation === "downloads" && <div className="w-2.5 h-2.5 rounded-full bg-accent-blue" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Save to Downloads</p>
              <p className="text-xs text-text-secondary mt-0.5">Default Location</p>
            </div>
          </button>

          <button 
            onClick={() => setSaveLocation("custom")}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-colors ${
              saveLocation === "custom" 
                ? "border-accent-blue bg-accent-blue/10" 
                : "border-border-custom/40 bg-bg-surface/30 hover:border-border-custom"
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
              saveLocation === "custom" ? "border-accent-blue" : "border-text-secondary/40"
            }`}>
              {saveLocation === "custom" && <div className="w-2.5 h-2.5 rounded-full bg-accent-blue" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Choose Save Location</p>
              <p className="text-xs text-text-secondary mt-0.5">Select a custom folder</p>
            </div>
          </button>
        </div>
      </div>

      {/* SORT DROPDOWN */}
      <div className="relative">
        <button 
          onClick={() => setShowSortDropdown(!showSortDropdown)}
          className="w-full flex items-center justify-between p-4 rounded-2xl border border-border-custom/40 bg-bg-surface/30 hover:border-border-custom transition-colors"
        >
          <div className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
              <path d="M3 6h18M3 12h18M3 18h18" />
              <path d="M8 6V3m0 3v3m8 6v3m0-3v-3" />
            </svg>
            <span className="text-sm font-medium text-text-primary">{selectedSort}</span>
          </div>
          <ChevronDown className="w-5 h-5 text-text-secondary" />
        </button>

        {showSortDropdown && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)} />
            <div className="absolute bottom-full left-0 w-full mb-2 bg-[#202024] border border-[#303036] rounded-2xl shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-bottom-2">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setSelectedSort(opt); setShowSortDropdown(false) }}
                  className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/5 transition-colors"
                >
                  <span className="text-base text-text-primary">{opt}</span>
                  {selectedSort === opt ? (
                    <div className="w-5 h-5 rounded-full border-2 border-orange-500 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-text-secondary/30" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ORGANIZE BUTTON */}
      <button className="w-full bg-gradient-to-r from-blue-700/80 to-indigo-700/80 hover:from-blue-600 hover:to-indigo-600 border border-blue-500/30 text-white rounded-2xl py-4 flex items-center justify-center gap-2 font-medium transition-all">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        <span>Organize Batch</span>
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
