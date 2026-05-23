"use client"

import { useState } from "react"
import { Settings, User, Key, Bell, Shield, Palette, ChevronRight, Check } from "lucide-react"
import { API_URL } from "../../../lib/api"

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState(API_URL)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const sections = [
    { icon: User, label: "Profile", desc: "Manage your account info" },
    { icon: Key, label: "API Keys", desc: "Manage your Gemini & Drive credentials" },
    { icon: Bell, label: "Notifications", desc: "Configure alert preferences" },
    { icon: Shield, label: "Privacy & Security", desc: "GDPR settings and data controls" },
    { icon: Palette, label: "Appearance", desc: "Theme and display preferences" },
  ]

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary mt-1">Manage your FileFlow configuration.</p>
      </div>

      {/* API Configuration */}
      <div className="bg-bg-surface border border-border-custom rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <Settings className="w-4 h-4 text-accent-blue" /> API Configuration
        </h2>
        <div className="space-y-2">
          <label className="text-xs font-medium text-text-secondary">Backend API URL</label>
          <input
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="w-full px-3 py-2.5 bg-bg-primary border border-border-custom rounded-lg text-sm text-text-primary font-mono focus:outline-none focus:border-accent-blue transition-colors"
          />
          <p className="text-xs text-text-secondary">Set NEXT_PUBLIC_API_URL environment variable to make this permanent.</p>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-accent-blue text-white rounded-lg text-sm font-medium hover:bg-accent-blue/90 transition-colors flex items-center gap-2"
        >
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : "Save Changes"}
        </button>
      </div>

      {/* Other sections (links) */}
      <div className="bg-bg-surface border border-border-custom rounded-2xl overflow-hidden divide-y divide-border-custom">
        {sections.map(({ icon: Icon, label, desc }) => (
          <button key={label} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-bg-primary transition-colors text-left">
            <div className="w-9 h-9 rounded-xl bg-bg-primary border border-border-custom flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-text-secondary" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-text-primary">{label}</div>
              <div className="text-xs text-text-secondary">{desc}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-text-secondary" />
          </button>
        ))}
      </div>
    </div>
  )
}
