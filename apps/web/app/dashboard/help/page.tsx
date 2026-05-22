"use client"

import { HelpCircle, Book, MessageSquare, Zap, ChevronRight, ExternalLink } from "lucide-react"

const faqs = [
  { q: "How does AI classification work?", a: "FileFlow sends your file name and MIME type to the Gemini AI model, which determines the most appropriate category based on content context." },
  { q: "Is my data private?", a: "Yes. Only file metadata (name, type) is sent to AI services. File content is stored locally in your connected database." },
  { q: "How do I connect Google Drive?", a: "Go to Settings → API Keys and add your Google OAuth credentials. Then click 'Connect Drive' on the Dashboard." },
  { q: "What file types are supported?", a: "PDFs, Word docs, images (JPG/PNG/RAW), code files, archives (ZIP), audio, video, and more — any file your system can read." },
  { q: "Can I undo an organization?", a: "Yes! Use the Time Machine in the dashboard sidebar to drag a timeline scrubber back to any historical state." },
]

export default function HelpPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Help & Docs</h1>
        <p className="text-sm text-text-secondary mt-1">Everything you need to get the most out of FileFlow.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Book, label: "Documentation", desc: "Full API & UI reference", href: "#" },
          { icon: MessageSquare, label: "Discord", desc: "Join our community", href: "#" },
          { icon: Zap, label: "Quickstart", desc: "Get up and running fast", href: "/dashboard" },
        ].map(({ icon: Icon, label, desc, href }) => (
          <a key={label} href={href} className="bg-card-bg border border-border-custom rounded-2xl p-5 hover:-translate-y-1 transition-all hover:border-accent-blue/40 group block">
            <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue mb-3 group-hover:bg-accent-blue group-hover:text-white transition-all">
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-text-primary">{label}</h3>
            <p className="text-xs text-text-secondary mt-1">{desc}</p>
          </a>
        ))}
      </div>

      <div className="bg-bg-surface border border-border-custom rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border-custom">
          <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-accent-blue" /> Frequently Asked Questions
          </h2>
        </div>
        <div className="divide-y divide-border-custom">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group px-6 py-4">
              <summary className="text-sm font-medium text-text-primary cursor-pointer list-none flex items-center justify-between">
                {q}
                <ChevronRight className="w-4 h-4 text-text-secondary group-open:rotate-90 transition-transform" />
              </summary>
              <p className="text-sm text-text-secondary mt-3 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
