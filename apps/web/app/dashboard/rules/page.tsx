"use client"

import { Plus, GripVertical, Settings, Copy, Trash2, Power, AlertTriangle, ArrowRight, CornerDownRight } from "lucide-react"

export default function RulesBuilderView() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Rules Builder</h1>
          <p className="text-sm text-text-secondary mt-1">Design automated workflows with no-code rules.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Rule
          </button>
        </div>
      </div>

      {/* Conflict Detector Banner */}
      <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-2xl p-4 flex items-start gap-4 shadow-sm">
        <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-yellow-500">Rule Conflict Detected</h3>
          <p className="text-xs text-text-secondary mt-1 max-w-2xl leading-relaxed">
            "Archive old invoices" conflicts with "Tax Docs 2026". A file matching <span className="font-mono bg-bg-primary px-1 rounded">invoice_2026.pdf</span> will match both rules. 
            Priority goes to the top-most active rule.
          </p>
        </div>
        <button className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold rounded-lg transition-colors">
          Resolve
        </button>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        
        {/* Rule 1 */}
        <div className="bg-card-bg border border-border-custom rounded-2xl p-4 hover:border-accent-blue/40 transition-colors group flex gap-4">
          <div className="pt-2 text-text-secondary/30 cursor-grab hover:text-text-secondary transition-colors">
            <GripVertical className="w-5 h-5" />
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="w-10 h-6 rounded-full bg-accent-blue flex items-center p-1 transition-colors">
                  <div className="w-4 h-4 rounded-full bg-white ml-auto" />
                </button>
                <h3 className="font-semibold text-text-primary text-sm">Tax Docs 2026</h3>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-bg-primary rounded-md"><Settings className="w-4 h-4" /></button>
                <button className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-bg-primary rounded-md"><Copy className="w-4 h-4" /></button>
                <button className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-md"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 text-xs font-mono bg-bg-primary border border-border-custom px-3 py-2 rounded-lg">
                <span className="text-text-secondary">IF</span>
                <span className="text-accent-blue font-semibold">Content contains</span>
                <span className="text-text-primary">"W-2" OR "1099"</span>
              </div>
              <ArrowRight className="w-4 h-4 text-text-secondary" />
              <div className="flex items-center gap-2 text-xs font-mono bg-bg-primary border border-border-custom px-3 py-2 rounded-lg">
                <span className="text-text-secondary">THEN</span>
                <span className="text-emerald-500 font-semibold">Move to</span>
                <span className="text-text-primary">Finance / Taxes 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rule 2 (Conflict) */}
        <div className="bg-card-bg border border-yellow-500/50 rounded-2xl p-4 transition-colors group flex gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/10 blur-xl rounded-full" />
          <div className="pt-2 text-text-secondary/30 cursor-grab hover:text-text-secondary transition-colors">
            <GripVertical className="w-5 h-5" />
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="w-10 h-6 rounded-full bg-accent-blue flex items-center p-1 transition-colors">
                  <div className="w-4 h-4 rounded-full bg-white ml-auto" />
                </button>
                <h3 className="font-semibold text-text-primary text-sm flex items-center gap-2">
                  Archive old invoices
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 text-xs font-mono bg-bg-primary border border-border-custom px-3 py-2 rounded-lg">
                <span className="text-text-secondary">IF</span>
                <span className="text-accent-blue font-semibold">Category is</span>
                <span className="text-text-primary">Invoice</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono bg-bg-primary border border-border-custom px-3 py-2 rounded-lg">
                <span className="text-text-secondary">AND</span>
                <span className="text-accent-blue font-semibold">Date created is before</span>
                <span className="text-text-primary">01/01/2026</span>
              </div>
              <ArrowRight className="w-4 h-4 text-text-secondary" />
              <div className="flex items-center gap-2 text-xs font-mono bg-bg-primary border border-border-custom px-3 py-2 rounded-lg">
                <span className="text-text-secondary">THEN</span>
                <span className="text-emerald-500 font-semibold">Move to</span>
                <span className="text-text-primary">Archives / Old Invoices</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rule 3 (Disabled) */}
        <div className="bg-bg-surface border border-border-custom rounded-2xl p-4 opacity-60 group flex gap-4">
          <div className="pt-2 text-text-secondary/20 cursor-grab">
            <GripVertical className="w-5 h-5" />
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="w-10 h-6 rounded-full bg-bg-primary border border-border-custom flex items-center p-1 transition-colors">
                  <div className="w-4 h-4 rounded-full bg-text-secondary/50" />
                </button>
                <h3 className="font-semibold text-text-secondary text-sm">Sort Screenshots</h3>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap grayscale">
              <div className="flex items-center gap-2 text-xs font-mono bg-bg-primary border border-border-custom px-3 py-2 rounded-lg">
                <span className="text-text-secondary">IF</span>
                <span className="text-text-secondary font-semibold">Filename contains</span>
                <span className="text-text-secondary">"Screenshot"</span>
              </div>
              <ArrowRight className="w-4 h-4 text-text-secondary" />
              <div className="flex items-center gap-2 text-xs font-mono bg-bg-primary border border-border-custom px-3 py-2 rounded-lg">
                <span className="text-text-secondary">THEN</span>
                <span className="text-text-secondary font-semibold">Move to</span>
                <span className="text-text-secondary">Images / Screenshots</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
