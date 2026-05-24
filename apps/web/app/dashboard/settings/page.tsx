"use client"

import { useState, useEffect } from "react"
import {
  Settings,
  User,
  Key,
  Bell,
  Shield,
  Palette,
  ChevronRight,
  Check,
  Eye,
  EyeOff,
  Database,
  CloudLightning,
  Sparkles,
  Download,
  Trash2,
  RefreshCw
} from "lucide-react"
import { API_URL, apiPath } from "../../../lib/api"

type Toast = { id: number; message: string; type: "success" | "error" | "info" }

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [toasts, setToasts] = useState<Toast[]>([])
  const [toastId, setToastId] = useState(0)

  // Profile State
  const [profileName, setProfileName] = useState("Local Developer")
  const [profileEmail, setProfileEmail] = useState("developer@fileflow.local")

  // API Keys State
  const [geminiKey, setGeminiKey] = useState("")
  const [driveClientId, setDriveClientId] = useState("")
  const [driveClientSecret, setDriveClientSecret] = useState("")
  const [showGemini, setShowGemini] = useState(false)
  const [showDriveClient, setShowDriveClient] = useState(false)
  const [showDriveSecret, setShowDriveSecret] = useState(false)

  // API Config State
  const [apiUrl, setApiUrl] = useState("")
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "testing" | "success" | "error">("idle")

  // Notifications State
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [inAppAlerts, setInAppAlerts] = useState(true)
  const [conflictWarnings, setConflictWarnings] = useState(true)

  // Privacy & Security State
  const [dataRetention, setDataRetention] = useState("forever")
  const [localFirst, setLocalFirst] = useState(true)

  // Appearance State
  const [theme, setTheme] = useState("dark")
  const [accentColor, setAccentColor] = useState("blue")

  // Load settings on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setProfileName(localStorage.getItem("fileflow_profile_name") || "Local Developer")
      setProfileEmail(localStorage.getItem("fileflow_profile_email") || "developer@fileflow.local")
      setGeminiKey(localStorage.getItem("fileflow_gemini_api_key") || "")
      setDriveClientId(localStorage.getItem("fileflow_drive_client_id") || "")
      setDriveClientSecret(localStorage.getItem("fileflow_drive_client_secret") || "")
      setApiUrl(localStorage.getItem("fileflow_custom_api_url") || "")
      setEmailAlerts(localStorage.getItem("fileflow_notification_email") !== "false")
      setInAppAlerts(localStorage.getItem("fileflow_notification_inapp") !== "false")
      setConflictWarnings(localStorage.getItem("fileflow_notification_conflict") !== "false")
      setDataRetention(localStorage.getItem("fileflow_privacy_retention") || "forever")
      setLocalFirst(localStorage.getItem("fileflow_privacy_localfirst") !== "false")
      setTheme(localStorage.getItem("fileflow_appearance_theme") || "dark")
      setAccentColor(localStorage.getItem("fileflow_appearance_accent") || "blue")
    }
  }, [])

  const triggerToast = (message: string, type: Toast["type"] = "success") => {
    const id = toastId + 1
    setToastId(id)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }

  const handleSaveProfile = () => {
    localStorage.setItem("fileflow_profile_name", profileName)
    localStorage.setItem("fileflow_profile_email", profileEmail)
    triggerToast("Profile saved successfully")
  }

  const handleSaveAPIKeys = () => {
    localStorage.setItem("fileflow_gemini_api_key", geminiKey)
    localStorage.setItem("fileflow_drive_client_id", driveClientId)
    localStorage.setItem("fileflow_drive_client_secret", driveClientSecret)
    triggerToast("API Credentials saved")
  }

  const handleSaveAPIConfig = () => {
    if (apiUrl.trim()) {
      localStorage.setItem("fileflow_custom_api_url", apiUrl.trim())
    } else {
      localStorage.removeItem("fileflow_custom_api_url")
    }
    triggerToast("API Configuration updated")
  }

  const handleTestConnection = async () => {
    setConnectionStatus("testing")
    const targetUrl = apiUrl.trim() || API_URL
    const cleanUrl = targetUrl.endsWith("/") ? targetUrl.slice(0, -1) : targetUrl
    try {
      const res = await fetch(`${cleanUrl}/api/v1/files/activity`)
      if (res.ok) {
        setConnectionStatus("success")
        triggerToast("Successfully connected to API server!", "success")
      } else {
        setConnectionStatus("error")
        triggerToast(`API returned status ${res.status}`, "error")
      }
    } catch {
      setConnectionStatus("error")
      triggerToast("Cannot reach API server. Check URL and CORS settings.", "error")
    }
  }

  const handleSaveNotifications = () => {
    localStorage.setItem("fileflow_notification_email", String(emailAlerts))
    localStorage.setItem("fileflow_notification_inapp", String(inAppAlerts))
    localStorage.setItem("fileflow_notification_conflict", String(conflictWarnings))
    triggerToast("Notification preferences updated")
  }

  const handleSavePrivacy = () => {
    localStorage.setItem("fileflow_privacy_retention", dataRetention)
    localStorage.setItem("fileflow_privacy_localfirst", String(localFirst))
    triggerToast("Privacy settings updated")
  }

  const handleExportData = () => {
    triggerToast("Exporting data summary...", "info")
    const mockData = {
      profile: { name: profileName, email: profileEmail },
      config: { apiUrl },
      preferences: { emailAlerts, inAppAlerts, theme, accentColor }
    }
    const blob = new Blob([JSON.stringify(mockData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `fileflow_settings_backup.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handlePurgeData = () => {
    if (!confirm("Are you sure you want to clear all local settings? This will reset the app back to defaults.")) return
    localStorage.clear()
    triggerToast("Local storage cache purged", "info")
    setTimeout(() => window.location.reload(), 1500)
  }

  const handleSaveAppearance = () => {
    localStorage.setItem("fileflow_appearance_theme", theme)
    localStorage.setItem("fileflow_appearance_accent", accentColor)
    triggerToast(`Theme set to ${theme} (${accentColor} accent)`)
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User, desc: "Account info & credentials" },
    { id: "apikeys", label: "API Keys", icon: Key, desc: "Gemini AI & Google Drive keys" },
    { id: "apiconfig", label: "API Config", icon: Settings, desc: "Backend servers & health" },
    { id: "notifications", label: "Notifications", icon: Bell, desc: "Alert preferences" },
    { id: "privacy", label: "Privacy & Security", icon: Shield, desc: "Data retention & export" },
    { id: "appearance", label: "Appearance", icon: Palette, desc: "Visual theme & styling" },
  ]

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 relative">
      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md text-sm font-medium pointer-events-auto animate-in slide-in-from-right duration-300
              ${t.type === "success" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : ""}
              ${t.type === "error"   ? "bg-red-500/10 border-red-500/30 text-red-400" : ""}
              ${t.type === "info"    ? "bg-accent-blue/10 border-accent-blue/30 text-accent-blue" : ""}
            `}
          >
            {t.type === "success" && <Check className="w-4 h-4 shrink-0 text-emerald-500" />}
            {t.type === "error"   && <Trash2 className="w-4 h-4 shrink-0 text-red-400" />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary">
          Settings
        </h1>
        <p className="text-text-secondary mt-1 text-sm">Manage and customize your FileFlow workspace.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Settings Navigation Sidebar */}
        <div className="md:col-span-1 bg-bg-surface border border-border-custom rounded-2xl overflow-hidden divide-y divide-border-custom">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-all relative ${
                  isActive
                    ? "bg-bg-primary border-l-4 border-accent-blue text-text-primary"
                    : "hover:bg-bg-primary/50 text-text-secondary hover:text-text-primary"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-accent-blue animate-pulse" : "text-text-secondary"}`} />
                <div className="min-w-0">
                  <div className="text-xs font-semibold">{tab.label}</div>
                  <div className="text-[10px] text-text-secondary/70 truncate">{tab.desc}</div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Tab Detail Pane */}
        <div className="md:col-span-3 bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm min-h-[400px] flex flex-col justify-between">
          
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="border-b border-border-custom pb-3">
                <h2 className="text-base font-semibold text-text-primary">Profile Information</h2>
                <p className="text-xs text-text-secondary mt-0.5">Manage your workspace visual identity.</p>
              </div>

              <div className="flex items-center gap-4 py-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 border border-border-custom flex items-center justify-center text-xl font-bold text-white shadow-inner">
                  {profileName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "LD"}
                </div>
                <div>
                  <button onClick={() => triggerToast("Avatar uploads require Cloudinary configuration", "info")} className="px-3 py-1.5 bg-bg-primary hover:bg-bg-primary/80 border border-border-custom rounded-lg text-xs font-semibold text-text-primary transition-all">
                    Upload Avatar
                  </button>
                  <p className="text-[10px] text-text-secondary mt-1">JPG, PNG or SVG. Max size 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary">Display Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3 py-2 bg-bg-primary border border-border-custom rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-blue transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary">Email Address</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-bg-primary border border-border-custom rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-blue transition-colors"
                  />
                </div>
              </div>

              <div className="bg-bg-primary/30 border border-border-custom rounded-xl p-4 space-y-1">
                <div className="text-xs font-semibold text-text-primary">Role & Permissions</div>
                <div className="text-xs text-text-secondary">Logged in as a <span className="text-accent-blue font-bold">Local Developer</span> with full system read/write credentials.</div>
              </div>

              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-lg text-xs font-semibold transition-colors mt-4 self-start"
              >
                Save Profile
              </button>
            </div>
          )}

          {/* API KEYS TAB */}
          {activeTab === "apikeys" && (
            <div className="space-y-6">
              <div className="border-b border-border-custom pb-3">
                <h2 className="text-base font-semibold text-text-primary">API Credentials</h2>
                <p className="text-xs text-text-secondary mt-0.5">Define your AI engines and cloud sync credentials.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5 relative">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-medium text-text-secondary flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-accent-violet" /> Gemini API Key
                    </label>
                    <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-accent-blue hover:underline">Get API Key →</a>
                  </div>
                  <div className="relative">
                    <input
                      type={showGemini ? "text" : "password"}
                      value={geminiKey}
                      onChange={(e) => setGeminiKey(e.target.value)}
                      placeholder="AI Studio API Key"
                      className="w-full pl-3 pr-10 py-2 bg-bg-primary border border-border-custom rounded-lg text-sm text-text-primary font-mono focus:outline-none focus:border-accent-blue transition-colors"
                    />
                    <button
                      onClick={() => setShowGemini(!showGemini)}
                      className="absolute right-3 top-2.5 text-text-secondary hover:text-text-primary"
                    >
                      {showGemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 relative">
                  <label className="text-xs font-medium text-text-secondary flex items-center gap-1">
                    <CloudLightning className="w-3.5 h-3.5 text-amber-500" /> Google Drive Client ID
                  </label>
                  <div className="relative">
                    <input
                      type={showDriveClient ? "text" : "password"}
                      value={driveClientId}
                      onChange={(e) => setDriveClientId(e.target.value)}
                      placeholder="OAuth2 Client ID"
                      className="w-full pl-3 pr-10 py-2 bg-bg-primary border border-border-custom rounded-lg text-sm text-text-primary font-mono focus:outline-none focus:border-accent-blue transition-colors"
                    />
                    <button
                      onClick={() => setShowDriveClient(!showDriveClient)}
                      className="absolute right-3 top-2.5 text-text-secondary hover:text-text-primary"
                    >
                      {showDriveClient ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 relative">
                  <label className="text-xs font-medium text-text-secondary flex items-center gap-1">
                    <CloudLightning className="w-3.5 h-3.5 text-amber-500" /> Google Drive Client Secret
                  </label>
                  <div className="relative">
                    <input
                      type={showDriveSecret ? "text" : "password"}
                      value={driveClientSecret}
                      onChange={(e) => setDriveClientSecret(e.target.value)}
                      placeholder="OAuth2 Client Secret Key"
                      className="w-full pl-3 pr-10 py-2 bg-bg-primary border border-border-custom rounded-lg text-sm text-text-primary font-mono focus:outline-none focus:border-accent-blue transition-colors"
                    />
                    <button
                      onClick={() => setShowDriveSecret(!showDriveSecret)}
                      className="absolute right-3 top-2.5 text-text-secondary hover:text-text-primary"
                    >
                      {showDriveSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveAPIKeys}
                className="px-4 py-2 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-lg text-xs font-semibold transition-colors mt-4 self-start"
              >
                Save Keys
              </button>
            </div>
          )}

          {/* API CONFIG TAB */}
          {activeTab === "apiconfig" && (
            <div className="space-y-6">
              <div className="border-b border-border-custom pb-3">
                <h2 className="text-base font-semibold text-text-primary">API Endpoint Configuration</h2>
                <p className="text-xs text-text-secondary mt-0.5">Route FileFlow to your active backend deployment.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-text-secondary">Backend API URL</label>
                  <input
                    type="text"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="e.g., http://localhost:8000"
                    className="w-full px-3 py-2 bg-bg-primary border border-border-custom rounded-lg text-sm text-text-primary font-mono focus:outline-none focus:border-accent-blue transition-colors"
                  />
                  <p className="text-[10px] text-text-secondary">
                    Defaults to local rewrites proxy. Enter an absolute URL to connect to a custom remote backend deployment.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSaveAPIConfig}
                    className="px-4 py-2 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleTestConnection}
                    disabled={connectionStatus === "testing"}
                    className="px-4 py-2 bg-bg-primary border border-border-custom hover:bg-bg-primary/80 text-text-primary rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
                  >
                    {connectionStatus === "testing" ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Database className="w-3.5 h-3.5" />
                    )}
                    Test Connection
                  </button>
                </div>

                {connectionStatus === "success" && (
                  <div className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" /> Connected to backend successfully!
                  </div>
                )}
                {connectionStatus === "error" && (
                  <div className="text-xs text-red-400 font-semibold bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-red-500" /> Connection failed. Please verify target URL is online.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="border-b border-border-custom pb-3">
                <h2 className="text-base font-semibold text-text-primary">Notification Settings</h2>
                <p className="text-xs text-text-secondary mt-0.5">Control how and when you receive workspace status alerts.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-bg-primary/20 border border-border-custom/50 rounded-2xl">
                  <div>
                    <div className="text-xs font-semibold text-text-primary">Email Digest</div>
                    <div className="text-[10px] text-text-secondary mt-0.5">Receive daily analytics and organization summaries.</div>
                  </div>
                  <button
                    onClick={() => setEmailAlerts(!emailAlerts)}
                    className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                      emailAlerts ? "bg-accent-blue" : "bg-bg-primary border border-border-custom"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                        emailAlerts ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-bg-primary/20 border border-border-custom/50 rounded-2xl">
                  <div>
                    <div className="text-xs font-semibold text-text-primary">In-App Notifications</div>
                    <div className="text-[10px] text-text-secondary mt-0.5">Show real-time toast alerts for file classifications.</div>
                  </div>
                  <button
                    onClick={() => setInAppAlerts(!inAppAlerts)}
                    className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                      inAppAlerts ? "bg-accent-blue" : "bg-bg-primary border border-border-custom"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                        inAppAlerts ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-bg-primary/20 border border-border-custom/50 rounded-2xl">
                  <div>
                    <div className="text-xs font-semibold text-text-primary">Rule Conflict Detection Warnings</div>
                    <div className="text-[10px] text-text-secondary mt-0.5">Alert immediately if active file organization rules conflict.</div>
                  </div>
                  <button
                    onClick={() => setConflictWarnings(!conflictWarnings)}
                    className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                      conflictWarnings ? "bg-accent-blue" : "bg-bg-primary border border-border-custom"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                        conflictWarnings ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <button
                onClick={handleSaveNotifications}
                className="px-4 py-2 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-lg text-xs font-semibold transition-colors mt-4 self-start"
              >
                Save Preferences
              </button>
            </div>
          )}

          {/* PRIVACY & SECURITY TAB */}
          {activeTab === "privacy" && (
            <div className="space-y-6">
              <div className="border-b border-border-custom pb-3">
                <h2 className="text-base font-semibold text-text-primary">Privacy & Workspace Safety</h2>
                <p className="text-xs text-text-secondary mt-0.5">Adjust security policies and local storage management.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary">File Cache Retention Period</label>
                  <select
                    value={dataRetention}
                    onChange={(e) => setDataRetention(e.target.value)}
                    className="w-full px-3 py-2 bg-bg-primary border border-border-custom rounded-lg text-xs text-text-primary focus:outline-none focus:border-accent-blue"
                  >
                    <option value="30days">30 Days</option>
                    <option value="90days">90 Days</option>
                    <option value="forever">Keep Forever (Default)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-bg-primary/20 border border-border-custom/50 rounded-2xl">
                  <div>
                    <div className="text-xs font-semibold text-text-primary">Local-First Sandbox Mode</div>
                    <div className="text-[10px] text-text-secondary mt-0.5">Process and structure metadata inside browser sandbox.</div>
                  </div>
                  <button
                    onClick={() => setLocalFirst(!localFirst)}
                    className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                      localFirst ? "bg-accent-blue" : "bg-bg-primary border border-border-custom"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                        localFirst ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="pt-4 border-t border-border-custom flex gap-3 flex-wrap">
                  <button
                    onClick={handleExportData}
                    className="px-4 py-2 bg-bg-primary border border-border-custom hover:bg-bg-primary/80 text-text-primary rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Export Workspace JSON
                  </button>
                  <button
                    onClick={handlePurgeData}
                    className="px-4 py-2 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Purge Cache & Reset
                  </button>
                </div>
              </div>

              <button
                onClick={handleSavePrivacy}
                className="px-4 py-2 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-lg text-xs font-semibold transition-colors mt-4 self-start"
              >
                Save Privacy Settings
              </button>
            </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div className="border-b border-border-custom pb-3">
                <h2 className="text-base font-semibold text-text-primary">Theme & Color Accents</h2>
                <p className="text-xs text-text-secondary mt-0.5">Customize the FileFlow workspace colors.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-text-secondary">Workspace Theme</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "dark", label: "Dark Mode" },
                      { id: "light", label: "Light Mode" },
                      { id: "system", label: "System Default" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`px-3 py-2 border rounded-xl text-xs font-medium transition-all ${
                          theme === t.id
                            ? "bg-accent-blue border-accent-blue text-white"
                            : "bg-bg-primary border-border-custom text-text-secondary hover:text-text-primary"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-text-secondary">Accent Color Highlight</label>
                  <div className="flex gap-3">
                    {[
                      { id: "blue", hex: "bg-blue-500", label: "Azure Blue" },
                      { id: "violet", hex: "bg-violet-500", label: "Electric Violet" },
                      { id: "emerald", hex: "bg-emerald-500", label: "Emerald Green" },
                      { id: "amber", hex: "bg-amber-500", label: "Amber Gold" },
                      { id: "rose", hex: "bg-rose-500", label: "Crimson Rose" },
                    ].map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setAccentColor(c.id)}
                        title={c.label}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                          accentColor === c.id ? "border-white scale-110 shadow-lg" : "border-transparent opacity-70 hover:opacity-100"
                        } ${c.hex}`}
                      >
                        {accentColor === c.id && <Check className="w-4 h-4 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveAppearance}
                className="px-4 py-2 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-lg text-xs font-semibold transition-colors mt-4 self-start"
              >
                Save Styles
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
