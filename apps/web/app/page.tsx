"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  Sparkles,
  ArrowRight,
  Brain,
  Search,
  Copy,
  Zap,
  Layers,
  Clock,
  UploadCloud,
  Cpu,
  CheckCircle,
  Star,
  ShieldCheck,
  FileText,
  Table as TableIcon,
  Presentation,
  History,
  GitMerge,
  Fingerprint,
  Activity,
} from "lucide-react"
import { NavBar } from "@/components/navbar"
import { ThreeHero } from "@/components/three-hero"

// Premium count-up animation component
function Counter({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number
  prefix?: string
  suffix?: string
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTime: number | null = null
          const duration = 1800

          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            const easeOut = 1 - Math.pow(1 - progress, 3)
            setCount(parseFloat((value * easeOut).toFixed(1)))

            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          requestAnimationFrame(animate)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [value])

  return (
    <div ref={ref} className="font-variant-numeric-tabular-nums">
      {prefix}
      {count}
      {suffix}
    </div>
  )
}

export default function Home() {
  const [activeStep, setActiveStep] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev % 3) + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-accent-blue/20 flex flex-col font-sans transition-colors duration-500">
      <NavBar />

      {/* ─── HERO SECTION ─── */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-16 px-6 overflow-hidden"
      >
        <div className="orb orb-1 -bottom-48 -left-24 opacity-60 dark:opacity-40" />
        <div className="orb orb-2 -top-24 -right-24 opacity-60 dark:opacity-40" />

        <div className="w-full h-[320px] md:h-[400px] relative mb-8 z-10 max-w-lg">
          <ThreeHero />
        </div>

        <div className="relative z-20 text-center max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-semibold tracking-wider uppercase text-accent-violet border border-glass-border">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered File Intelligence
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text-primary leading-[1.1]">
            Organize Everything.
            <br />
            <span className="font-serif italic gradient-text">Effortlessly.</span>
          </h1>

          <p className="text-base md:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
            FileFlow uses AI to classify, deduplicate, and semantically search all your files — so you never lose anything again.
          </p>

          <div className="flex gap-4 justify-center items-center flex-wrap pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-accent-blue hover:bg-accent-blue/95 text-white font-semibold px-8 py-3.5 rounded-full text-base shadow-[0_4px_14px_rgba(0,85,255,0.25)] hover:shadow-[0_6px_20px_rgba(0,85,255,0.35)] transition-all hover:scale-[1.02]"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary font-medium px-6 py-3.5 rounded-full border border-border-custom hover:bg-bg-surface transition-all"
            >
              See Features
            </Link>
          </div>

          <p className="text-xs text-text-secondary pt-2">No credit card required · Free to start</p>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowRight className="w-5 h-5 rotate-90 text-text-secondary" />
        </div>
      </section>

      {/* ─── STATS SECTION ─── */}
      <section className="bg-bg-surface py-16 px-6 relative z-10 border-y border-border-custom">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 text-center">
          <div className="relative py-4 px-6">
            <div className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-2 flex justify-center">
              <Counter value={98.6} suffix="%" />
            </div>
            <div className="text-sm text-text-secondary">AI classification accuracy</div>
            <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-12 w-[1px] bg-border-custom" />
          </div>

          <div className="relative py-4 px-6">
            <div className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-2 flex justify-center">
              <Counter value={200} prefix="< " suffix="ms" />
            </div>
            <div className="text-sm text-text-secondary">semantic search latency</div>
            <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-12 w-[1px] bg-border-custom" />
          </div>

          <div className="relative py-4 px-6">
            <div className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-2 flex justify-center">
              <Counter value={4.2} suffix=" GB" />
            </div>
            <div className="text-sm text-text-secondary">average storage reclaimed</div>
          </div>
        </div>
      </section>

      {/* ─── FEATURE 1: AI CLASSIFICATION ─── */}
      <section id="features" className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-6">
            <div className="text-xs font-semibold tracking-wider text-accent-violet uppercase">
              Intelligence Layer
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary leading-tight">
              AI that reads, understands,
              <br />
              <span className="font-serif italic gradient-text">and organizes.</span>
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Our AI engine reads content, understands context, and automatically classifies your files with human-level precision. See the confidence score and AI reasoning for every decision.
            </p>

            <ul className="space-y-6 list-none p-0">
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center text-white shrink-0 shadow-md shadow-accent-blue/10">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">AI Document Classification</h4>
                  <p className="text-sm text-text-secondary mt-1">Content-aware sorting with explainable AI reasoning popover on every file</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center text-white shrink-0 shadow-md shadow-accent-blue/10">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">Entropy Index & Org Score</h4>
                  <p className="text-sm text-text-secondary mt-1">Live metrics measuring your workspace chaos level and organization health</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center text-white shrink-0 shadow-md shadow-accent-blue/10">
                  <GitMerge className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">No-Code Rules Builder</h4>
                  <p className="text-sm text-text-secondary mt-1">Build IF/THEN automation rules. Conflict detector catches overlapping rules instantly</p>
                </div>
              </li>
            </ul>
          </div>

          {/* App Mockup */}
          <div className="relative">
            <div className="rounded-2xl border border-border-custom bg-card-bg overflow-hidden shadow-2xl">
              <div className="flex gap-1.5 p-3.5 bg-bg-surface border-b border-border-custom">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
              </div>
              <div className="p-6 bg-bg-primary min-h-[280px] flex gap-4">
                <div className="w-28 bg-bg-surface rounded-lg p-3 space-y-2.5 hidden sm:block shrink-0 border border-border-custom">
                  {["Dashboard", "Files", "Duplicates", "Rules"].map(n => (
                    <div key={n} className="h-6 bg-border-custom rounded-md w-full flex items-center px-2">
                      <span className="text-[9px] text-text-secondary truncate">{n}</span>
                    </div>
                  ))}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="h-8 bg-bg-surface rounded-lg border border-border-custom flex items-center px-3 gap-2">
                    <div className="w-3 h-3 rounded-full bg-accent-blue animate-pulse" />
                    <span className="text-[10px] text-text-secondary">AI Proposed Structure</span>
                  </div>
                  {[
                    { name: "invoice_may_2026.pdf", path: "Finance / Invoices", conf: 98, color: "text-emerald-500" },
                    { name: "IMG_9021.JPG", path: "Photos / Vacations", conf: 85, color: "text-yellow-500" },
                    { name: "report_q1.docx", path: "Work / Projects", conf: 92, color: "text-emerald-500" },
                  ].map((f, i) => (
                    <div key={i} className="p-3 bg-bg-surface rounded-xl border border-border-custom flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] font-medium text-text-primary truncate">{f.name}</p>
                        <p className="text-[9px] text-text-secondary font-mono truncate">→ {f.path}</p>
                      </div>
                      <span className={`text-[9px] font-bold shrink-0 ${f.color}`}>{f.conf}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURE 2: SEMANTIC SEARCH ─── */}
      <section className="py-24 px-6 relative z-10 bg-bg-surface/50 border-t border-border-custom">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Mockup Left */}
          <div className="order-2 lg:order-1 relative">
            <div className="rounded-2xl border border-border-custom bg-card-bg p-6 shadow-2xl space-y-4 max-w-md mx-auto">
              <div className="flex items-center gap-3 px-4 py-3 bg-bg-primary rounded-full border border-border-custom text-text-secondary text-sm">
                <Search className="w-4 h-4" />
                <span>Q3 financial projections</span>
                <span className="w-0.5 h-4 bg-accent-blue animate-pulse ml-auto" />
              </div>
              <div className="space-y-3">
                <div className="p-4 bg-bg-primary rounded-xl border border-border-custom flex gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center text-white shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm">Q3_Projections_Final.pdf</h5>
                    <p className="text-xs text-text-secondary mt-1">
                      &quot;...revenue growth of <strong className="text-accent-blue">24%</strong> in Q3 based on...&quot;
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-bg-primary rounded-xl border border-border-custom flex gap-3.5 opacity-80">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-violet to-accent-blue flex items-center justify-center text-white shrink-0">
                    <TableIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm">Financial_Model_2026.xlsx</h5>
                    <p className="text-xs text-text-secondary mt-1">&quot;...Q3 forecast sheet with updated assumptions...&quot;</p>
                  </div>
                </div>
                <div className="p-4 bg-bg-primary rounded-xl border border-border-custom flex gap-3.5 opacity-60">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center text-white shrink-0">
                    <Presentation className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm">Board_Q3_Review.pptx</h5>
                    <p className="text-xs text-text-secondary mt-1">&quot;...slide 7: Q3 financial projections summary...&quot;</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <div className="text-xs font-semibold tracking-wider text-accent-violet uppercase">
              Semantic Search Engine
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary leading-tight">
              Find Anything.
              <br />
              <span className="font-serif italic gradient-text">In Seconds.</span>
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Stop hunting through folders. Press <kbd className="px-1.5 py-0.5 rounded bg-bg-surface border border-border-custom text-xs font-mono">⌘K</kbd> and search in plain English. Our vector embedding engine understands the meaning behind your words.
            </p>

            <ul className="space-y-6 list-none p-0">
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center text-white shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">Natural Language Queries</h4>
                  <p className="text-sm text-text-secondary mt-1">Search like you speak — &quot;that contract from last March&quot;</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center text-white shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">Proactive Suggestions</h4>
                  <p className="text-sm text-text-secondary mt-1">AI learns your patterns and surfaces relevant files before you even search</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center text-white shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">Sub-200ms Results</h4>
                  <p className="text-sm text-text-secondary mt-1">Instant responses across all your files powered by vector search</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-24 px-6 relative overflow-hidden bg-[#0A0A0F] text-white">
        <div className="orb orb-1 opacity-40 -bottom-24 -left-12" />
        <div className="orb orb-3 opacity-40 -top-24 -right-12" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
            <div className="text-xs font-semibold tracking-wider text-accent-violet uppercase">The Process</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
              Three steps to a perfectly organized workspace.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            <div className="hidden lg:block absolute top-[52px] left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-white/10 z-0">
              <div
                className="w-2.5 h-2.5 bg-accent-violet rounded-full shadow-[0_0_12px_#7B5CF5] absolute -translate-y-[4.5px] transition-all duration-1000"
                style={{ left: `${(activeStep - 1) * 50}%` }}
              />
            </div>

            {[
              { step: "01", icon: UploadCloud, title: "Upload or Connect", desc: "Drop files directly or connect your Google Drive, Dropbox, or local folders. We handle the rest." },
              { step: "02", icon: Cpu, title: "AI Analyzes & Classifies", desc: "FileFlow reads content, detects MIME types, generates embeddings, and builds your intelligent index." },
              { step: "03", icon: CheckCircle, title: "Review & Organize", desc: "Preview the AI's proposed structure in a before/after split view. Approve, reject, or correct each decision." },
            ].map((s, i) => (
              <div key={i} className={`p-8 rounded-2xl border transition-all duration-500 relative z-10 backdrop-blur-md ${activeStep === i + 1 ? "bg-white/5 border-white/20 shadow-xl" : "bg-white/[0.02] border-white/5 opacity-70"}`}>
                <div className="text-5xl font-extrabold text-white/[0.04] absolute top-5 right-6 select-none">{s.step}</div>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center text-white mb-6 shadow-lg shadow-accent-blue/20">
                  <s.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-[#6B6B8A] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES BENTO GRID ─── */}
      <section className="py-24 px-6 relative z-10 border-t border-border-custom">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary">Everything you need.</h2>
            <p className="text-text-secondary">A complete file intelligence platform in one place.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 auto-rows-[200px]">
            {/* Tile 1 - Large: Smart Inbox Mood Ring */}
            <div className="md:col-span-2 md:row-span-2 rounded-2xl border border-border-custom bg-card-bg p-8 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:border-accent-blue/40 group">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Smart Inbox — Mood Ring</h3>
                <p className="text-sm text-text-secondary leading-relaxed">Drop files into the inbox and watch it glow: blue for docs, amber for images, violet for chaotic mixes.</p>
              </div>
              <div className="flex gap-4 items-center justify-center h-full pt-4">
                <div className="w-24 h-24 rounded-full border-4 border-dashed border-accent-blue group-hover:border-accent-violet group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] shadow-[0_0_20px_rgba(74,140,255,0.2)] transition-all duration-700 flex items-center justify-center">
                  <UploadCloud className="w-8 h-8 text-accent-blue group-hover:text-accent-violet transition-colors duration-700" />
                </div>
                <div className="flex-1 flex flex-col gap-2 max-w-[180px]">
                  <div className="h-6 rounded bg-bg-primary border border-border-custom w-full flex items-center px-3 text-[10px] text-text-secondary font-medium">
                    invoice_may.pdf → Docs
                  </div>
                  <div className="h-6 rounded bg-bg-primary border border-border-custom w-11/12 flex items-center px-3 text-[10px] text-text-secondary font-medium opacity-70">
                    beach.jpg → Images
                  </div>
                  <div className="h-6 rounded bg-bg-primary border border-border-custom w-10/12 flex items-center px-3 text-[10px] text-text-secondary font-medium opacity-50">
                    script.py → Code
                  </div>
                </div>
              </div>
            </div>

            {/* Tile 2 - Tall: Time Machine */}
            <div className="md:row-span-2 rounded-2xl border border-border-custom bg-card-bg p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:border-accent-violet/40">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <History className="w-5 h-5 text-accent-violet" /> Time Machine
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">Drag a timeline scrubber to replay your entire organization history. One-click restore to any past state.</p>
              </div>
              <div className="flex-1 flex flex-col gap-2 pt-6 shrink-0 justify-end">
                <div className="w-full h-2 bg-bg-primary rounded-full overflow-hidden border border-border-custom relative">
                  <div className="h-full bg-gradient-to-r from-accent-blue to-accent-violet w-[70%] rounded-full" />
                  <div className="absolute top-1/2 left-[70%] -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-accent-blue shadow-md" />
                </div>
                <div className="flex justify-between text-[9px] text-text-secondary font-mono">
                  <span>March</span><span>April</span><span>Today</span>
                </div>
                <div className="p-3 bg-bg-primary border border-border-custom rounded-lg text-[10px] space-y-1 mt-2">
                  <div className="font-semibold text-text-primary">Restore to May 10</div>
                  <div className="text-text-secondary">Reverses 42 transactions</div>
                </div>
              </div>
            </div>

            {/* Tile 3 - Wide: Duplicate Intelligence */}
            <div className="md:col-span-2 rounded-2xl border border-border-custom bg-card-bg p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:border-red-500/20">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg flex items-center gap-2"><Copy className="w-4 h-4 text-red-400" /> Duplicate Intelligence</h3>
                <p className="text-sm text-text-secondary">Network graph clusters all duplicate files. Auto-resolves by keeping best quality.</p>
              </div>
              <div className="flex gap-2 justify-end items-center h-10 mt-2">
                <div className="w-8 h-8 rounded-full bg-accent-blue/20 border-2 border-accent-blue flex items-center justify-center text-[8px] text-accent-blue font-bold">Best</div>
                <div className="w-5 h-0.5 bg-border-custom" />
                <div className="w-6 h-6 rounded-full bg-bg-primary border border-border-custom" />
                <div className="w-5 h-0.5 bg-border-custom" />
                <div className="w-6 h-6 rounded-full bg-bg-primary border border-border-custom" />
                <div className="ml-3 px-2 py-1 bg-red-500/10 text-red-400 text-[10px] rounded font-medium">Free 12 GB</div>
              </div>
            </div>

            {/* Tile 4: File DNA */}
            <div className="rounded-2xl border border-border-custom bg-card-bg p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:border-accent-violet/40">
              <div className="space-y-1">
                <h3 className="font-semibold text-sm flex items-center gap-1.5"><Fingerprint className="w-4 h-4 text-accent-violet" /> File DNA</h3>
                <p className="text-xs text-text-secondary">Entity extraction, content density, color palettes</p>
              </div>
              <div className="flex flex-wrap gap-1 pt-2">
                {["Acme Corp", "Q1 2026", "Revenue"].map(t => (
                  <span key={t} className="px-1.5 py-0.5 bg-accent-blue/10 text-accent-blue text-[9px] rounded border border-accent-blue/20">{t}</span>
                ))}
              </div>
            </div>

            {/* Tile 5: Security */}
            <div className="rounded-2xl border border-border-custom bg-card-bg p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 hover:shadow-lg">
              <div className="space-y-1">
                <h3 className="font-semibold text-sm font-sans">GDPR & Privacy</h3>
                <p className="text-xs text-text-secondary">Your data never trains our models</p>
              </div>
              <div className="flex justify-center items-center h-12">
                <ShieldCheck className="w-10 h-10 text-accent-blue" />
              </div>
            </div>

            {/* Tile 6 - Wide: Rules Builder */}
            <div className="md:col-span-2 rounded-2xl border border-border-custom bg-card-bg p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:border-emerald-500/20">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg flex items-center gap-2"><GitMerge className="w-4 h-4 text-emerald-500" /> Automation Rules Builder</h3>
                <p className="text-sm text-text-secondary">No-code IF/THEN rules with automatic conflict detection</p>
              </div>
              <div className="flex gap-2 items-center text-[10px] font-mono mt-3 flex-wrap">
                <span className="px-2 py-1 bg-bg-primary border border-border-custom rounded text-text-secondary">IF content contains "invoice"</span>
                <span className="text-accent-blue font-bold">→</span>
                <span className="px-2 py-1 bg-bg-primary border border-border-custom rounded text-emerald-500">THEN move to Finance/</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimonials" className="py-24 px-6 relative z-10 border-t border-border-custom">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary">Loved by teams everywhere.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { initials: "SM", gradient: "from-accent-blue to-accent-violet", name: "Sarah Mitchell", role: "Design Lead at Figma", quote: "FileFlow transformed our asset library. What used to take hours of manual organization now happens automatically. It's like having a librarian who never sleeps." },
              { initials: "JC", gradient: "from-accent-violet to-accent-blue", name: "James Chen", role: "CTO at Linear", quote: "The semantic search is magic. I can find any document by describing what I remember about it. Our team productivity increased 40% in the first month." },
              { initials: "ER", gradient: "from-accent-blue to-accent-violet", name: "Elena Rodriguez", role: "Operations at Notion", quote: "We migrated 50,000+ files and FileFlow sorted them perfectly. The duplicate detection alone saved us 200GB of storage. Absolutely essential tool." },
            ].map((t) => (
              <div key={t.name} className="bg-glass-bg border border-border-custom rounded-2xl p-8 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 hover:shadow-lg">
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#F59E0B] fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-text-secondary italic leading-relaxed">&quot;{t.quote}&quot;</p>
                </div>
                <div className="flex gap-3 items-center pt-6 border-t border-border-custom mt-6">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-semibold text-sm`}>
                    {t.initials}
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm text-text-primary">{t.name}</h5>
                    <p className="text-xs text-text-secondary">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="relative py-28 px-6 text-center bg-[#0A0A0F] text-[#F0F0F8] overflow-hidden border-t border-white/5">
        <div className="orb orb-1 w-[700px] h-[700px] -top-[200px] -left-[100px] opacity-50" />
        <div className="orb orb-2 w-[600px] h-[600px] -bottom-[200px] -right-[100px] opacity-40" />

        <div className="max-w-2xl mx-auto relative z-10 space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Your files are waiting.
            <br />
            <span className="font-serif italic gradient-text">Let FileFlow sort it out.</span>
          </h2>
          <p className="text-base text-[#6B6B8A] leading-relaxed max-w-lg mx-auto">
            Stop losing time to disorganized files. Get started in under 60 seconds.
          </p>

          <div className="flex gap-4 justify-center items-center flex-wrap pt-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-accent-blue hover:bg-accent-blue/90 text-white font-semibold px-8 py-3.5 rounded-full shadow-[0_4px_14px_rgba(0,85,255,0.25)] hover:shadow-[0_6px_20px_rgba(0,85,255,0.35)] transition-all hover:scale-[1.02]"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 bg-transparent hover:bg-white/5 text-[#F0F0F8] border border-white/10 hover:border-white/30 font-semibold px-8 py-3.5 rounded-full transition-all"
            >
              Explore Features
            </a>
          </div>

          <div className="text-xs text-[#6B6B8A] pt-4">
            No credit card required · Cancel anytime
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-footer-bg text-footer-text py-16 px-6 relative z-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-4 mb-12">
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center text-white font-bold text-lg">
                F
              </div>
              <span className="font-semibold text-xl tracking-tight text-white">FileFlow</span>
            </Link>
            <p className="text-sm text-[#6B6B8A] leading-relaxed max-w-sm">
              Your files, finally intelligent. AI-powered organization for modern teams.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" aria-label="GitHub" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#6B6B8A] hover:text-white transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
              </a>
              <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#6B6B8A] hover:text-white transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase">Product</h4>
            <ul className="space-y-2.5 list-none p-0 text-sm text-[#6B6B8A]">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase">Company</h4>
            <ul className="space-y-2.5 list-none p-0 text-sm text-[#6B6B8A]">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase">Legal</h4>
            <ul className="space-y-2.5 list-none p-0 text-sm text-[#6B6B8A]">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#6B6B8A]">
          <span>© 2026 FileFlow. All rights reserved.</span>
          <span>Built with ❤️ and AI</span>
        </div>
      </footer>
    </div>
  )
}
