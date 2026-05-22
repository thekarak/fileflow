"use client"

import { useState } from "react"
import { History, X, Play, RotateCcw, Camera, Download, ChevronLeft, ChevronRight } from "lucide-react"

interface TimeMachineProps {
  isOpen: boolean
  onClose: () => void
}

export function TimeMachine({ isOpen, onClose }: TimeMachineProps) {
  const [timelineValue, setTimelineValue] = useState(80)

  if (!isOpen) return null

  // Calculate the date based on timeline value (mock logic)
  const getDateFromTimeline = (val: number) => {
    if (val > 90) return "Today, 10:42 AM"
    if (val > 70) return "Yesterday, 3:15 PM"
    if (val > 40) return "May 10, 2026"
    if (val > 10) return "April 28, 2026"
    return "Original State (March 1, 2026)"
  }

  // Calculate the "State" description
  const getStateDescription = (val: number) => {
    if (val > 90) return "Current State"
    if (val > 70) return "Before 'Auto-Organize Downloads'"
    if (val > 40) return "Before 'Archive Old Projects'"
    if (val > 10) return "Before 'Client Photos Sort'"
    return "Complete Chaos"
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-bg-primary/90 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal / Time Machine Window */}
      <div className="relative w-full max-w-6xl h-full max-h-[85vh] bg-bg-surface border border-border-custom shadow-2xl rounded-3xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-custom flex items-center justify-between bg-bg-primary/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-blue/10 flex items-center justify-center text-accent-blue shadow-[0_0_15px_rgba(74,140,255,0.2)]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">Organization Time Machine</h2>
              <p className="text-xs text-text-secondary">Viewing historical state: <span className="font-semibold text-text-primary">{getDateFromTimeline(timelineValue)}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg border border-border-custom text-sm font-medium hover:bg-bg-primary transition-colors flex items-center gap-2 text-text-secondary">
              <Camera className="w-4 h-4" /> Snapshot
            </button>
            <button className="px-4 py-2 rounded-lg border border-border-custom text-sm font-medium hover:bg-bg-primary transition-colors flex items-center gap-2 text-text-secondary">
              <Download className="w-4 h-4" /> Export History
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-bg-primary text-text-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area - Split View */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-4 min-h-0">
          
          {/* File Tree Preview */}
          <div className="md:col-span-3 bg-[#0A0A0F] relative overflow-hidden flex flex-col">
            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-mono">
              {getStateDescription(timelineValue)}
            </div>

            {/* Mockup of File Structure Changing based on timeline */}
            <div className="flex-1 p-8 overflow-y-auto">
              <div className="space-y-2 opacity-80">
                {/* Condition 1: High organization */}
                {timelineValue > 70 && (
                  <>
                    <div className="flex items-center gap-2 text-accent-blue"><span className="text-lg">📁</span> Documents</div>
                    <div className="pl-6 space-y-1 text-sm text-white/70">
                      <div className="flex items-center gap-2">📄 invoice_may.pdf</div>
                      <div className="flex items-center gap-2">📄 report_q1.docx</div>
                    </div>
                    <div className="flex items-center gap-2 text-accent-violet mt-4"><span className="text-lg">📁</span> Photos</div>
                    <div className="pl-6 space-y-1 text-sm text-white/70">
                      <div className="flex items-center gap-2">🖼️ IMG_2026_beach.jpg</div>
                      <div className="flex items-center gap-2">🖼️ DSC_001.raw</div>
                    </div>
                  </>
                )}
                
                {/* Condition 2: Medium organization */}
                {timelineValue > 40 && timelineValue <= 70 && (
                  <>
                    <div className="flex items-center gap-2 text-accent-blue"><span className="text-lg">📁</span> Downloads</div>
                    <div className="pl-6 space-y-1 text-sm text-white/70">
                      <div className="flex items-center gap-2">📄 invoice_may.pdf</div>
                      <div className="flex items-center gap-2">🖼️ IMG_2026_beach.jpg</div>
                    </div>
                    <div className="flex items-center gap-2 text-accent-violet mt-4"><span className="text-lg">📁</span> Old Projects</div>
                  </>
                )}

                {/* Condition 3: Total chaos */}
                {timelineValue <= 40 && (
                  <div className="space-y-1 text-sm text-white/70">
                    <div className="flex items-center gap-2">📄 invoice_may.pdf</div>
                    <div className="flex items-center gap-2">🖼️ IMG_2026_beach.jpg</div>
                    <div className="flex items-center gap-2">📄 report_q1.docx</div>
                    <div className="flex items-center gap-2">🖼️ DSC_001.raw</div>
                    <div className="flex items-center gap-2">📄 untitled document(1).docx</div>
                    <div className="flex items-center gap-2">🖼️ screenshot_442.png</div>
                    <div className="flex items-center gap-2">📦 unknown_backup.zip</div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Visual overlay effects */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
            <div className={`absolute inset-0 pointer-events-none bg-accent-blue/5 transition-opacity duration-500 ${timelineValue > 70 ? 'opacity-100' : 'opacity-0'}`} />
            <div className={`absolute inset-0 pointer-events-none bg-orange-500/5 transition-opacity duration-500 ${timelineValue <= 40 ? 'opacity-100' : 'opacity-0'}`} />
          </div>

          {/* Right Sidebar - Action Info */}
          <div className="bg-bg-primary border-l border-border-custom flex flex-col">
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              <div>
                <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4">Historical Transaction</h3>
                <div className="p-4 bg-bg-surface border border-border-custom rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-text-primary">Auto-Organize</span>
                    <span className="text-xs font-mono text-emerald-500">+42 files</span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    FileFlow AI processed 42 files from the Inbox and moved them to 4 destination folders.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4">Impact</h3>
                <ul className="space-y-2 text-sm text-text-primary">
                  <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-accent-blue before:rounded-full">
                    Created 2 new folders
                  </li>
                  <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-accent-blue before:rounded-full">
                    Resolved 3 duplicates
                  </li>
                  <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-accent-blue before:rounded-full">
                    Generated 42 AI labels
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="p-6 border-t border-border-custom bg-bg-surface">
              <button className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]">
                <RotateCcw className="w-5 h-5" />
                Restore to this State
              </button>
              <p className="text-xs text-center text-text-secondary mt-3">
                This will reverse all transactions that occurred after {getDateFromTimeline(timelineValue)}.
              </p>
            </div>
          </div>
        </div>

        {/* Timeline Scrubber (Bottom) */}
        <div className="h-28 bg-card-bg border-t border-border-custom p-6 flex flex-col justify-center shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-accent-blue/10 text-accent-blue flex items-center justify-center hover:bg-accent-blue hover:text-white transition-colors shrink-0">
              <Play className="w-5 h-5 ml-1" />
            </button>
            
            <div className="flex-1 relative flex items-center">
              {/* Fake timeline track */}
              <div className="absolute inset-x-0 h-2 bg-bg-primary rounded-full overflow-hidden border border-border-custom">
                <div 
                  className="h-full bg-gradient-to-r from-accent-blue to-accent-violet rounded-full transition-all duration-75"
                  style={{ width: `${timelineValue}%` }}
                />
              </div>
              
              {/* The scrubber thumb */}
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={timelineValue} 
                onChange={(e) => setTimelineValue(parseInt(e.target.value))}
                className="w-full absolute inset-0 opacity-0 cursor-ew-resize z-10 h-8 -top-3" 
              />
              
              {/* Visual thumb element */}
              <div 
                className="w-5 h-5 rounded-full bg-white border-4 border-accent-blue shadow-[0_0_15px_rgba(74,140,255,0.6)] absolute pointer-events-none transition-all duration-75"
                style={{ left: `calc(${timelineValue}% - 10px)` }}
              />

              {/* Timeline markers */}
              <div className="absolute top-6 left-0 text-[10px] font-mono text-text-secondary">March</div>
              <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-text-secondary">April</div>
              <div className="absolute top-6 right-0 text-[10px] font-mono text-text-secondary">Today</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
