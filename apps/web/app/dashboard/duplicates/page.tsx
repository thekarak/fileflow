"use client"

import { Copy, Sparkles, Trash2, ShieldCheck, Maximize2, AlertCircle } from "lucide-react"

const mockDuplicates = [
  { id: 1, name: "IMG_2026_beach.jpg", path: "Photos/Vacation", size: "4.2 MB", resolution: "4000x3000", date: "May 12, 2026", isBest: true },
  { id: 2, name: "beach_copy.jpg", path: "Downloads", size: "1.1 MB", resolution: "1200x900", date: "May 15, 2026", isBest: false },
  { id: 3, name: "IMG_2026_beach(1).jpg", path: "Desktop/To Sort", size: "4.2 MB", resolution: "4000x3000", date: "May 13, 2026", isBest: false },
]

export default function DuplicatesView() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Duplicate Intelligence</h1>
          <p className="text-sm text-text-secondary mt-1">Review duplicate clusters and reclaim storage.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-bg-surface border border-border-custom rounded-lg text-sm font-medium hover:bg-bg-primary transition-colors flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-red-400" />
            Delete All Duplicates (Free 12.4 GB)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Network Graph Visualization Mockup */}
        <div className="lg:col-span-1 bg-card-bg border border-border-custom rounded-2xl overflow-hidden shadow-sm flex flex-col h-[500px]">
          <div className="px-4 py-3 border-b border-border-custom bg-bg-primary/50 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <Copy className="w-4 h-4 text-accent-blue" />
              Duplicate Relationships
            </h2>
            <Maximize2 className="w-4 h-4 text-text-secondary cursor-pointer" />
          </div>
          <div className="flex-1 relative bg-bg-surface flex items-center justify-center p-6 overflow-hidden">
            {/* SVG Network Graph Mockup */}
            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 400">
              <line x1="200" y1="200" x2="100" y2="100" stroke="currentColor" strokeWidth="2" className="text-accent-blue/50" strokeDasharray="4" />
              <line x1="200" y1="200" x2="300" y2="150" stroke="currentColor" strokeWidth="2" className="text-accent-blue/50" strokeDasharray="4" />
              <line x1="200" y1="200" x2="250" y2="300" stroke="currentColor" strokeWidth="2" className="text-accent-blue/50" strokeDasharray="4" />
              <line x1="200" y1="200" x2="120" y2="280" stroke="currentColor" strokeWidth="2" className="text-accent-blue/50" strokeDasharray="4" />
              
              <line x1="50" y1="50" x2="100" y2="100" stroke="currentColor" strokeWidth="1" className="text-text-secondary/30" />
              <line x1="300" y1="150" x2="350" y2="100" stroke="currentColor" strokeWidth="1" className="text-text-secondary/30" />
            </svg>
            
            {/* Central Node */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-accent-blue/20 border-2 border-accent-blue flex items-center justify-center shadow-[0_0_30px_rgba(74,140,255,0.4)] z-10 hover:scale-110 transition-transform cursor-pointer">
              <span className="text-xs font-bold text-accent-blue">4.2 MB</span>
            </div>
            
            {/* Satellite Nodes */}
            <div className="absolute top-[20%] left-[20%] w-12 h-12 rounded-full bg-bg-primary border-2 border-text-secondary/30 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
              <span className="text-[10px] text-text-secondary">1.1 MB</span>
            </div>
            <div className="absolute top-[35%] right-[20%] w-16 h-16 rounded-full bg-bg-primary border-2 border-text-secondary/30 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
              <span className="text-xs text-text-secondary">4.2 MB</span>
            </div>
            <div className="absolute bottom-[20%] right-[30%] w-10 h-10 rounded-full bg-bg-primary border-2 border-text-secondary/30 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
              <span className="text-[10px] text-text-secondary">800 KB</span>
            </div>
            <div className="absolute bottom-[25%] left-[25%] w-14 h-14 rounded-full bg-bg-primary border-2 border-text-secondary/30 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
              <span className="text-[10px] text-text-secondary">4.2 MB</span>
            </div>
          </div>
          <div className="p-4 border-t border-border-custom bg-bg-primary/50 text-xs text-text-secondary">
            <p>Node size = File size. Clicking a node highlights all its duplicates.</p>
          </div>
        </div>

        {/* Right: Duplicate List */}
        <div className="lg:col-span-2 bg-card-bg border border-border-custom rounded-2xl overflow-hidden shadow-sm flex flex-col h-[500px]">
          <div className="px-4 py-3 border-b border-border-custom bg-bg-primary/50 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-text-primary">Cluster: IMG_2026_beach.jpg</h2>
            <button className="px-3 py-1.5 bg-accent-blue/10 text-accent-blue rounded-md text-xs font-semibold hover:bg-accent-blue/20 transition-colors flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Auto-Resolve (Keep Best)
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {mockDuplicates.map((file) => (
              <div key={file.id} className={`p-4 rounded-xl border transition-all relative ${
                file.isBest 
                  ? "border-accent-blue bg-accent-blue/5 shadow-[0_0_15px_rgba(74,140,255,0.1)]" 
                  : "border-border-custom bg-bg-surface hover:border-text-secondary/30"
              }`}>
                {file.isBest && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center shadow-lg">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                      {file.name}
                      {file.isBest && <span className="text-[10px] uppercase tracking-wider font-bold text-accent-blue bg-accent-blue/10 px-1.5 py-0.5 rounded">Best Quality</span>}
                    </h3>
                    <p className="text-xs text-text-secondary mt-1 font-mono">{file.path}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-mono font-bold text-text-primary">{file.size}</span>
                    <span className="text-xs text-text-secondary">{file.resolution}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border-custom flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Added {file.date}</span>
                  <div className="flex gap-2">
                    {!file.isBest ? (
                      <button className="px-3 py-1.5 rounded bg-red-500/10 text-red-500 text-xs font-semibold hover:bg-red-500/20 transition-colors">
                        Delete
                      </button>
                    ) : (
                      <button className="px-3 py-1.5 rounded bg-bg-primary border border-border-custom text-text-secondary text-xs font-medium hover:text-text-primary transition-colors">
                        Keep This
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border-custom bg-bg-primary flex items-center gap-3 text-sm text-text-secondary">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            FileFlow detected that <span className="font-mono text-text-primary">beach_copy.jpg</span> is a compressed version of the original.
          </div>
        </div>
      </div>
    </div>
  )
}
