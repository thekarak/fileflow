"use client"

import { useState } from "react"
import { 
  FileText, Image as ImageIcon, CheckCircle2, XCircle, 
  AlertCircle, ChevronRight, CornerDownRight, ThumbsUp, 
  RotateCw, Archive, FileCode, Check
} from "lucide-react"

// Mock Data for the Before/After View
const mockFiles = [
  { id: 1, name: "invoice_may_2026.pdf", type: "pdf", status: "pending", confidence: 98, proposedPath: "Finance / 2026 / Invoices", reason: "Found keywords 'invoice', 'total due', and '$4,200'." },
  { id: 2, name: "IMG_9021.JPG", type: "image", status: "pending", confidence: 85, proposedPath: "Photos / 2026 / Vacations", reason: "EXIF data matches GPS coordinates for Hawaii, USA." },
  { id: 3, name: "Q1_report_draft_v2.docx", type: "doc", status: "approved", confidence: 92, proposedPath: "Work / Projects / Q1 Report", reason: "Filename analysis and document structure matches project reports." },
  { id: 4, name: "unknown_backup.zip", type: "archive", status: "review", confidence: 45, proposedPath: "Archives / Unsorted", reason: "Unable to inspect archive contents securely. Confidence is low." },
  { id: 5, name: "main_script.py", type: "code", status: "pending", confidence: 99, proposedPath: "Development / Scripts", reason: "Valid Python syntax detected with standard library imports." },
]

export default function FilesView() {
  const [files, setFiles] = useState(mockFiles)
  const [activePopover, setActivePopover] = useState<number | null>(null)

  const handleApprove = (id: number) => {
    setFiles(files.map(f => f.id === id ? { ...f, status: "approved" } : f))
  }

  const handleReject = (id: number) => {
    setFiles(files.map(f => f.id === id ? { ...f, status: "rejected" } : f))
  }

  const getIcon = (type: string) => {
    switch(type) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-400" />
      case 'image': return <ImageIcon className="w-5 h-5 text-emerald-400" />
      case 'doc': return <FileText className="w-5 h-5 text-blue-400" />
      case 'archive': return <Archive className="w-5 h-5 text-yellow-400" />
      case 'code': return <FileCode className="w-5 h-5 text-indigo-400" />
      default: return <FileText className="w-5 h-5 text-text-secondary" />
    }
  }

  const getConfidenceColor = (conf: number) => {
    if (conf >= 90) return "bg-emerald-500"
    if (conf >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center shrink-0 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Review Organization</h1>
          <p className="text-sm text-text-secondary mt-1">Approve or modify FileFlow AI's proposed structure.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-bg-surface border border-border-custom rounded-lg text-sm font-medium hover:bg-bg-primary transition-colors flex items-center gap-2">
            <XCircle className="w-4 h-4 text-text-secondary" />
            Reject All
          </button>
          <button className="px-4 py-2 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Approve All
          </button>
        </div>
      </div>

      {/* Split Pane View */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        
        {/* Left Pane: Original Chaos */}
        <div className="flex flex-col bg-bg-surface border border-border-custom rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-border-custom bg-bg-primary/50">
            <h2 className="text-sm font-semibold text-text-primary">Original Inbox (Unorganized)</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {files.map(file => (
              <div key={`orig-${file.id}`} className="flex items-center gap-3 p-3 rounded-xl border border-border-custom/50 bg-bg-primary/30 opacity-70">
                {getIcon(file.type)}
                <span className="text-sm font-medium text-text-primary">{file.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane: Proposed Structure */}
        <div className="flex flex-col bg-card-bg border-2 border-accent-blue/20 shadow-[0_0_30px_rgba(74,140,255,0.05)] rounded-2xl overflow-hidden relative">
          <div className="px-4 py-3 border-b border-border-custom bg-bg-primary/50 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse"></span>
              AI Proposed Structure
            </h2>
            <div className="text-xs text-text-secondary flex gap-3">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> High Conf.</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Med Conf.</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Low Conf.</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {files.map(file => (
              <div 
                key={`prop-${file.id}`} 
                className={`flex flex-col p-3 rounded-xl border transition-all duration-300 relative
                  ${file.status === 'approved' ? 'border-emerald-500/30 bg-emerald-500/5' : 
                    file.status === 'rejected' ? 'border-red-500/30 bg-red-500/5 opacity-50' : 
                    file.status === 'review' ? 'border-yellow-500/50 bg-yellow-500/10' : 
                    'border-border-custom bg-bg-surface hover:border-accent-blue/40'}
                `}
              >
                {/* File Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {getIcon(file.type)}
                      {/* Confidence Heatmap Dot */}
                      <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-bg-surface ${getConfidenceColor(file.confidence)}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-text-primary">{file.name}</span>
                        {/* AI Classification Badge / Popover Trigger */}
                        <div 
                          className="relative"
                          onMouseEnter={() => setActivePopover(file.id)}
                          onMouseLeave={() => setActivePopover(null)}
                        >
                          <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-accent-blue/10 text-accent-blue border border-accent-blue/20 cursor-help flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            {file.confidence}%
                          </span>
                          
                          {/* Explainer Popover */}
                          {activePopover === file.id && (
                            <div className="absolute top-full left-0 mt-2 w-64 p-3 bg-bg-surface border border-border-custom rounded-xl shadow-2xl z-50 text-xs">
                              <div className="font-semibold text-text-primary mb-1">AI Reasoning</div>
                              <p className="text-text-secondary leading-relaxed">{file.reason}</p>
                              <div className="mt-2 pt-2 border-t border-border-custom flex justify-between">
                                <button className="text-accent-blue hover:underline">Correct this</button>
                                <button className="text-text-secondary hover:text-text-primary flex items-center gap-1"><RotateCw className="w-3 h-3"/> Re-analyze</button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 mt-1 text-xs text-text-secondary">
                        <CornerDownRight className="w-3 h-3" />
                        <span className="font-mono bg-bg-primary px-1 rounded border border-border-custom">{file.proposedPath}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {file.status === 'pending' || file.status === 'review' ? (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleApprove(file.id)}
                        className="p-1.5 rounded-md hover:bg-emerald-500/20 hover:text-emerald-500 text-text-secondary transition-colors"
                        title="Approve"
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleReject(file.id)}
                        className="p-1.5 rounded-md hover:bg-red-500/20 hover:text-red-500 text-text-secondary transition-colors"
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs font-semibold px-2 py-1 rounded bg-bg-primary border border-border-custom">
                      {file.status === 'approved' ? <span className="text-emerald-500">Approved</span> : <span className="text-red-500">Rejected</span>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
