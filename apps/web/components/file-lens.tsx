"use client"

import { X, Maximize2, Download, Link as LinkIcon, Share2, FileText, Tag, BarChart3, Fingerprint, Search } from "lucide-react"

interface FileLensProps {
  isOpen: boolean
  onClose: () => void
}

export function FileLens({ isOpen, onClose }: FileLensProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-bg-primary/95 backdrop-blur-xl transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-bg-surface border border-border-custom shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
        
        {/* Left: Preview Area (70%) */}
        <div className="flex-[2] bg-[#0A0A0F] border-r border-border-custom relative flex flex-col min-h-[50vh]">
          {/* Header Bar */}
          <div className="absolute top-0 inset-x-0 h-14 bg-gradient-to-b from-black/60 to-transparent z-10 flex justify-between items-center px-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-white font-medium text-sm drop-shadow-md">Q1_Report_Draft_v2.pdf</span>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actual Preview Mockup */}
          <div className="flex-1 p-8 flex items-center justify-center overflow-auto mt-14">
            <div className="w-full max-w-2xl bg-white aspect-[1/1.4] shadow-2xl rounded p-12 text-zinc-800">
              <div className="w-1/3 h-8 bg-zinc-200 rounded mb-8"></div>
              <div className="space-y-4">
                <div className="w-full h-4 bg-zinc-100 rounded"></div>
                <div className="w-full h-4 bg-zinc-100 rounded"></div>
                <div className="w-11/12 h-4 bg-zinc-100 rounded"></div>
                <div className="w-4/5 h-4 bg-zinc-100 rounded"></div>
                <div className="w-full h-4 bg-zinc-100 rounded mt-8"></div>
                <div className="w-full h-4 bg-zinc-100 rounded"></div>
                <div className="w-10/12 h-4 bg-zinc-100 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: File DNA & Metadata (30%) */}
        <div className="flex-1 bg-bg-surface flex flex-col min-h-[30vh]">
          <div className="px-5 py-4 flex justify-between items-center border-b border-border-custom">
            <h3 className="font-semibold text-text-primary flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-accent-violet" /> File DNA
            </h3>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-text-secondary hover:bg-bg-primary hover:text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-8">
            
            {/* Core Info */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Type</span>
                <span className="font-mono text-text-primary">PDF Document</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Size</span>
                <span className="font-mono text-text-primary">4.2 MB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Added</span>
                <span className="font-mono text-text-primary">Today, 10:42 AM</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-text-secondary">Confidence</span>
                <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">98% Match</span>
              </div>
            </div>

            {/* AI Extracted Entities */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-3.5 h-3.5" /> Entities Extracted
              </h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs rounded-md">Acme Corp</span>
                <span className="px-2 py-1 bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs rounded-md">Q1 2026</span>
                <span className="px-2 py-1 bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs rounded-md">Revenue</span>
                <span className="px-2 py-1 bg-bg-primary border border-border-custom text-text-secondary text-xs rounded-md">John Doe</span>
                <span className="px-2 py-1 bg-bg-primary border border-border-custom text-text-secondary text-xs rounded-md">Financial</span>
              </div>
            </div>

            {/* Word Cloud / Fingerprint Mockup */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5" /> Content Density
              </h4>
              <div className="h-24 rounded-xl border border-border-custom bg-bg-primary p-3 flex flex-wrap gap-x-3 gap-y-1 content-center justify-center text-center">
                <span className="text-xl font-bold text-accent-blue opacity-100">Growth</span>
                <span className="text-base text-text-primary opacity-80">Q1</span>
                <span className="text-lg font-semibold text-accent-violet opacity-90">Revenue</span>
                <span className="text-sm text-text-secondary opacity-60">metrics</span>
                <span className="text-xs text-text-secondary opacity-40">summary</span>
                <span className="text-md font-medium text-text-primary opacity-80">Acme</span>
                <span className="text-xs text-text-secondary opacity-50">analysis</span>
              </div>
            </div>

            {/* Smart Actions */}
            <div className="pt-4 border-t border-border-custom grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-bg-primary border border-border-custom hover:bg-bg-surface hover:border-text-secondary/30 transition-colors text-text-secondary hover:text-text-primary group">
                <Download className="w-5 h-5 mb-1 group-hover:-translate-y-0.5 transition-transform" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Download</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-bg-primary border border-border-custom hover:bg-bg-surface hover:border-text-secondary/30 transition-colors text-text-secondary hover:text-text-primary group">
                <Share2 className="w-5 h-5 mb-1 group-hover:-translate-y-0.5 transition-transform" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Share</span>
              </button>
              <button className="col-span-2 flex items-center justify-center gap-2 p-3 rounded-xl bg-accent-blue/10 text-accent-blue font-semibold hover:bg-accent-blue/20 transition-colors">
                <Search className="w-4 h-4" />
                Find Similar Documents
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
