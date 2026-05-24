"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Activity, Database, FileText } from "lucide-react"
import { apiPath } from "../../../lib/api"

type Stats = {
  org_score: number
  files_organized: number
  total_bytes: number
  categories: Record<string, number>
}

const CATEGORY_COLORS: Record<string, string> = {
  documents: "bg-blue-500",
  images: "bg-emerald-500",
  code: "bg-indigo-500",
  archives: "bg-yellow-500",
  audio: "bg-pink-500",
  video: "bg-red-500",
  other: "bg-text-secondary",
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      // Try /stats first
      try {
        const res = await fetch(apiPath("/api/v1/files/stats"))
        if (res.ok) {
          setStats(await res.json())
          return
        }
      } catch {}

      // Fallback: compute from /activity
      try {
        const res = await fetch(apiPath("/api/v1/files/activity"))
        if (res.ok) {
          const data = await res.json()
          const categories: Record<string, number> = {}
          let totalBytes = 0
          for (const item of data) {
            let cat = item.category
            if (!cat && item.action && item.action.includes("moved to")) {
              cat = item.action.split("moved to ")[1].split(" /")[0].trim()
            }
            cat = cat || "Other"
            categories[cat] = (categories[cat] || 0) + 1
            totalBytes += item.size || 0
          }
          setStats({
            org_score: data.length > 0 ? 100 : 0,
            files_organized: data.length,
            total_bytes: totalBytes,
            categories,
          })
        }
      } catch {}
    }
    fetchData()
  }, [])

  const categories = stats?.categories || {}
  const total = Object.values(categories).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Analytics</h1>
        <p className="text-sm text-text-secondary mt-1">Insights into your file workspace.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Org Score", value: `${stats?.org_score ?? 100}%`, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Files Organized", value: stats?.files_organized ?? 0, icon: FileText, color: "text-accent-blue", bg: "bg-accent-blue/10" },
          { label: "Categories", value: Object.keys(categories).length, icon: Activity, color: "text-accent-violet", bg: "bg-accent-violet/10" },
          { label: "Data Processed", value: stats ? `${(stats.total_bytes / 1024 / 1024).toFixed(1)} MB` : "0 MB", icon: Database, color: "text-orange-500", bg: "bg-orange-500/10" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-glass-bg border border-border-custom rounded-2xl p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-text-secondary font-medium">{label}</span>
              <div className={`w-7 h-7 rounded-full ${bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
            </div>
            <div className="text-3xl font-bold text-text-primary">{value}</div>
          </div>
        ))}
      </div>

      {total > 0 && (
        <div className="bg-glass-bg border border-border-custom rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-text-primary mb-6">File Categories</h2>
          <div className="space-y-4">
            {Object.entries(categories).map(([cat, count]) => (
              <div key={cat} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-text-primary capitalize font-medium">{cat}</span>
                  <span className="text-text-secondary">{count} files ({Math.round(count / total * 100)}%)</span>
                </div>
                <div className="w-full h-2 bg-bg-primary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${CATEGORY_COLORS[cat.toLowerCase()] || "bg-accent-blue"}`}
                    style={{ width: `${(count / total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {total === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-bg-surface border border-border-custom flex items-center justify-center text-text-secondary/40">
            <Activity className="w-8 h-8" />
          </div>
          <h3 className="font-semibold text-text-primary">No data yet</h3>
          <p className="text-sm text-text-secondary">Upload files from the Dashboard to see analytics here.</p>
        </div>
      )}
    </div>
  )
}
