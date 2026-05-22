"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  Sparkles,
  ArrowRight,
  Play,
  Brain,
  Search,
  Copy,
  Zap,
  Layers,
  Clock,
  UploadCloud,
  Cpu,
  CheckCircle,
  Check,
  Star,
  ShieldCheck,
  FileText,
  Table as TableIcon,
  Presentation,
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
            // Cubic ease-out
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

  // Step connector dot animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev % 3) + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-accent-blue/20 flex flex-col font-sans transition-colors duration-500">
      <NavBar />

      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-16 px-6 overflow-hidden"
      >
        {/* Background Drift Orbs */}
        <div className="orb orb-1 -bottom-48 -left-24 opacity-60 dark:opacity-40" />
        <div className="orb orb-2 -top-24 -right-24 opacity-60 dark:opacity-40" />

        {/* 3D Canvas Hero Animation */}
        <div className="w-full h-[360px] md:h-[400px] relative mb-8 z-10 max-w-lg">
          <ThreeHero />
        </div>

        {/* Hero Copy */}
        <div className="relative z-20 text-center max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-semibold tracking-wider uppercase text-accent-violet border border-glass-border">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered File Intelligence
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text-primary leading-[1.1] md:leading-[1.1]">
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
            <a
              href="#demo"
              className="inline-flex items-center gap-2 bg-transparent hover:bg-bg-surface text-text-primary border border-border-custom hover:border-text-secondary font-semibold px-8 py-3.5 rounded-full text-base transition-all"
            >
              <Play className="w-4 h-4 fill-current text-accent-blue" />
              Watch Demo
            </a>
          </div>

          <div className="flex items-center justify-center gap-3 pt-6 text-sm text-text-secondary">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-bg-primary bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center text-white text-[10px] font-bold">
                JD
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-bg-primary bg-gradient-to-br from-accent-violet to-accent-blue flex items-center justify-center text-white text-[10px] font-bold">
                MK
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-bg-primary bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center text-white text-[10px] font-bold">
                AL
              </div>
            </div>
            <span>Trusted by 12,000+ professionals</span>
          </div>
        </div>

        {/* Scroll down indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowRight className="w-5 h-5 rotate-90 text-text-secondary" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-bg-surface py-16 px-6 relative z-10 border-y border-border-custom">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 text-center">
          <div className="relative py-4 px-6">
            <div className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-2 flex justify-center">
              <Counter value={4.2} suffix=" GB" />
            </div>
            <div className="text-sm text-text-secondary">saved on average per user</div>
            <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-12 w-[1px] bg-border-custom" />
          </div>

          <div className="relative py-4 px-6">
            <div className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-2 flex justify-center">
              <Counter value={98.6} suffix="%" />
            </div>
            <div className="text-sm text-text-secondary">classification accuracy</div>
            <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-12 w-[1px] bg-border-custom" />
          </div>

          <div className="relative py-4 px-6">
            <div className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-2 flex justify-center">
              <Counter value={200} prefix="< " suffix="ms" />
            </div>
            <div className="text-sm text-text-secondary">semantic search latency</div>
          </div>
        </div>
      </section>

      {/* Feature 1: Intelligence Layer */}
      <section id="features" className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-6">
            <div className="text-xs font-semibold tracking-wider text-accent-violet uppercase">
              Intelligence Layer
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary leading-tight">
              Designed to Help You Do More
              <br />
              <span className="font-serif italic gradient-text">With Less Chaos.</span>
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Our AI engine reads content, understands context, and automatically organizes your files with human-level precision. No more manual sorting or endless folder hierarchies.
            </p>

            <ul className="space-y-6 list-none p-0">
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center text-white shrink-0 shadow-md shadow-accent-blue/10">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">AI Document Classification</h4>
                  <p className="text-sm text-text-secondary mt-1">Automatic MIME detection and content-aware sorting</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center text-white shrink-0 shadow-md shadow-accent-blue/10">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">Semantic Search</h4>
                  <p className="text-sm text-text-secondary mt-1">Find files by meaning, not just filenames, using vector embeddings</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center text-white shrink-0 shadow-md shadow-accent-blue/10">
                  <Copy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">Smart Duplicate Detection</h4>
                  <p className="text-sm text-text-secondary mt-1">Identify and merge duplicate files across all your connected storage</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Browser Mockup */}
          <div className="relative">
            <div className="rounded-2xl border border-border-custom bg-card-bg overflow-hidden shadow-2xl transition-transform duration-700 lg:rotate-y-[-6deg] lg:rotate-x-[2deg] hover:rotate-y-[0deg] hover:rotate-x-[0deg]">
              {/* Browser Header */}
              <div className="flex gap-1.5 p-3.5 bg-bg-surface border-b border-border-custom">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
              </div>
              {/* Browser Content Mock */}
              <div className="p-6 bg-bg-primary min-h-[300px] flex gap-4">
                {/* Sidebar */}
                <div className="w-32 bg-bg-surface rounded-lg p-3 space-y-2.5 hidden sm:block shrink-0 border border-border-custom">
                  <div className="h-6 bg-border-custom rounded-md w-10/12" />
                  <div className="h-6 bg-border-custom rounded-md w-8/12" />
                  <div className="h-6 bg-border-custom rounded-md w-9/12" />
                  <div className="h-6 bg-border-custom rounded-md w-7/12" />
                </div>
                {/* Dashboard Grid */}
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-bg-surface rounded-lg p-4 border border-border-custom flex flex-col items-center justify-center gap-2 aspect-square shadow-sm"
                    >
                      <div className="w-8 h-8 rounded bg-gradient-to-br from-accent-blue to-accent-violet opacity-60" />
                      <div className="h-2 bg-border-custom rounded w-3/4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2: Semantic Search */}
      <section className="py-24 px-6 relative z-10 bg-bg-surface/50 border-t border-border-custom">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Mockup Left */}
          <div className="order-2 lg:order-1 relative">
            <div className="rounded-2xl border border-border-custom bg-card-bg p-6 shadow-2xl transition-transform duration-700 lg:rotate-y-[6deg] lg:rotate-x-[2deg] hover:rotate-y-[0deg] hover:rotate-x-[0deg] space-y-4 max-w-md mx-auto">
              <div className="flex items-center gap-3 px-4 py-3 bg-bg-primary rounded-full border border-border-custom text-text-secondary text-sm">
                <Search className="w-4.5 h-4.5" />
                <span>Q3 financial projections</span>
                <span className="w-0.5 h-4.5 bg-accent-blue animate-pulse" />
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
                    <p className="text-xs text-text-secondary mt-1">
                      &quot;...Q3 forecast sheet with updated assumptions...&quot;
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-bg-primary rounded-xl border border-border-custom flex gap-3.5 opacity-60">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center text-white shrink-0">
                    <Presentation className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm">Board_Q3_Review.pptx</h5>
                    <p className="text-xs text-text-secondary mt-1">
                      &quot;...slide 7: Q3 financial projections summary...&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copy Right */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="text-xs font-semibold tracking-wider text-accent-violet uppercase">
              Semantic Search
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary leading-tight">
              Find Anything.
              <br />
              <span className="font-serif italic gradient-text">In Seconds.</span>
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Stop hunting through folders. Our vector embedding technology understands the meaning behind your documents, letting you search in natural language and get instant, relevant results.
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
                  <h4 className="font-semibold text-text-primary">Vector Embeddings</h4>
                  <p className="text-sm text-text-secondary mt-1">Every file is mapped in semantic space for meaning-based retrieval</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center text-white shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">Instant Results</h4>
                  <p className="text-sm text-text-secondary mt-1">Sub-200ms response time across millions of documents</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 relative overflow-hidden bg-[#0A0A0F] text-white">
        <div className="orb orb-1 opacity-40 -bottom-24 -left-12" />
        <div className="orb orb-3 opacity-40 -top-24 -right-12" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
            <div className="text-xs font-semibold tracking-wider text-accent-violet uppercase">
              The Process
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
              Three steps to a perfectly organized workspace.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            {/* Step Line Connector */}
            <div className="hidden lg:block absolute top-[52px] left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-white/10 z-0">
              <div
                className="w-2.5 h-2.5 bg-accent-violet rounded-full shadow-[0_0_12px_#7B5CF5] absolute -translate-y-[4.5px] transition-all duration-1000"
                style={{
                  left: `${(activeStep - 1) * 50}%`,
                }}
              />
            </div>

            {/* Step 1 */}
            <div
              className={`p-8 rounded-2xl border transition-all duration-500 relative z-10 backdrop-blur-md ${
                activeStep === 1
                  ? "bg-white/5 border-white/20 shadow-xl"
                  : "bg-white/[0.02] border-white/5 opacity-70"
              }`}
            >
              <div className="text-5xl font-extrabold text-white/[0.04] absolute top-5 right-6 select-none">
                01
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center text-white mb-6 shadow-lg shadow-accent-blue/20">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Upload or Connect</h3>
              <p className="text-sm text-[#6B6B8A] leading-relaxed">
                Drop files directly or connect your Google Drive, Dropbox, or local folders. We handle the rest.
              </p>
            </div>

            {/* Step 2 */}
            <div
              className={`p-8 rounded-2xl border transition-all duration-500 relative z-10 backdrop-blur-md ${
                activeStep === 2
                  ? "bg-white/5 border-white/20 shadow-xl"
                  : "bg-white/[0.02] border-white/5 opacity-70"
              }`}
            >
              <div className="text-5xl font-extrabold text-white/[0.04] absolute top-5 right-6 select-none">
                02
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center text-white mb-6 shadow-lg shadow-accent-blue/20">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">AI Analyzes & Classifies</h3>
              <p className="text-sm text-[#6B6B8A] leading-relaxed">
                FileFlow reads content, detects MIME types, generates embeddings, and builds your intelligent index.
              </p>
            </div>

            {/* Step 3 */}
            <div
              className={`p-8 rounded-2xl border transition-all duration-500 relative z-10 backdrop-blur-md ${
                activeStep === 3
                  ? "bg-white/5 border-white/20 shadow-xl"
                  : "bg-white/[0.02] border-white/5 opacity-70"
              }`}
            >
              <div className="text-5xl font-extrabold text-white/[0.04] absolute top-5 right-6 select-none">
                03
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center text-white mb-6 shadow-lg shadow-accent-blue/20">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Review & Organize</h3>
              <p className="text-sm text-[#6B6B8A] leading-relaxed">
                Preview the dry-run, approve changes, and watch real-time organization happen in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-24 px-6 relative text-center">
        <div className="orb orb-2 w-[700px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 dark:opacity-20" />
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary">
            See FileFlow in Action.
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto">
            Watch 200 chaotic files become a perfect structure in under 10 seconds.
          </p>

          <div className="relative rounded-2xl overflow-hidden border border-border-custom bg-card-bg aspect-video shadow-2xl max-w-3xl mx-auto group cursor-pointer hover:scale-[1.01] transition-all duration-300">
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-110 transition-all duration-300 group-hover:shadow-[0_0_50px_rgba(0,85,255,0.2)]">
                <Play className="w-7 h-7 text-accent-blue fill-current ml-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="py-24 px-6 relative z-10 border-t border-border-custom">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary">
              Everything you need.
            </h2>
            <p className="text-text-secondary">
              A complete file intelligence platform in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 auto-rows-[200px]">
            {/* Tile 1 - Large */}
            <div className="md:col-span-2 md:row-span-2 rounded-2xl border border-border-custom bg-card-bg p-8 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:border-text-secondary">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Real-time Organization</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Watch files sort themselves as you upload
                </p>
              </div>
              <div className="flex gap-4 items-center justify-center h-full pt-4">
                {/* Progress Ring Ring */}
                <div className="w-20 h-20 rounded-full border-8 border-border-custom border-t-accent-blue animate-spin" />
                <div className="flex-1 flex flex-col gap-2 max-w-[200px]">
                  <div className="h-6 rounded bg-bg-primary border border-border-custom w-full flex items-center px-3 text-[10px] text-text-secondary font-medium">
                    invoice_may_2026.pdf → Documents
                  </div>
                  <div className="h-6 rounded bg-bg-primary border border-border-custom w-11/12 flex items-center px-3 text-[10px] text-text-secondary font-medium opacity-70">
                    photo_beach.jpg → Images
                  </div>
                </div>
              </div>
            </div>

            {/* Tile 2 - Tall */}
            <div className="md:row-span-2 rounded-2xl border border-border-custom bg-card-bg p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:border-text-secondary">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Undo/Redo System</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Full transaction history with one-click rollback
                </p>
              </div>
              <div className="flex-1 flex flex-col gap-2 pt-6 shrink-0 justify-end">
                <div className="p-3 bg-bg-primary border border-border-custom rounded-lg text-[10px] space-y-1">
                  <div className="font-semibold text-text-primary">Moved 4 files</div>
                  <div className="text-text-secondary">Undo operation</div>
                </div>
                <div className="p-3 bg-bg-primary border border-border-custom rounded-lg text-[10px] space-y-1 opacity-60">
                  <div className="font-semibold text-text-primary">Sorted 18 images</div>
                  <div className="text-text-secondary">Rolled back</div>
                </div>
              </div>
            </div>

            {/* Tile 3 - Wide */}
            <div className="md:col-span-2 rounded-2xl border border-border-custom bg-card-bg p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:border-text-secondary">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Apple-Style Dashboard</h3>
                <p className="text-sm text-text-secondary">Beautiful, minimal interface designed for focus</p>
              </div>
              <div className="flex gap-2 justify-end items-end h-8">
                <div className="w-1/4 h-2 bg-gradient-to-r from-accent-blue to-accent-violet rounded-full opacity-35" />
                <div className="w-2/4 h-2 bg-gradient-to-r from-accent-violet to-accent-blue rounded-full opacity-65" />
                <div className="w-1/4 h-2 bg-gradient-to-r from-accent-blue to-accent-violet rounded-full opacity-35" />
              </div>
            </div>

            {/* Tile 4 */}
            <div className="rounded-2xl border border-border-custom bg-card-bg p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:border-text-secondary">
              <div className="space-y-1">
                <h3 className="font-semibold text-sm">Google OAuth</h3>
                <p className="text-xs text-text-secondary">Secure sign-in</p>
              </div>
              <div className="flex justify-center items-center h-12">
                <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Tile 5 */}
            <div className="rounded-2xl border border-border-custom bg-card-bg p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:border-text-secondary">
              <div className="space-y-1">
                <h3 className="font-semibold text-sm font-sans">GDPR</h3>
                <p className="text-xs text-text-secondary">Privacy built-in</p>
              </div>
              <div className="flex justify-center items-center h-12">
                <ShieldCheck className="w-10 h-10 text-accent-blue" />
              </div>
            </div>

            {/* Tile 6 - Wide */}
            <div className="md:col-span-2 rounded-2xl border border-border-custom bg-card-bg p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:border-text-secondary">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Semantic Vector Search</h3>
                <p className="text-sm text-text-secondary">Meaning-based retrieval across all your content</p>
              </div>
              <div className="flex gap-1.5 items-end justify-center h-10">
                <div className="w-2.5 h-6 bg-accent-blue rounded-full opacity-40" />
                <div className="w-2.5 h-10 bg-accent-violet rounded-full opacity-60" />
                <div className="w-2.5 h-8 bg-accent-blue rounded-full opacity-50" />
                <div className="w-2.5 h-12 bg-accent-violet rounded-full opacity-80 animate-pulse-slow" />
                <div className="w-2.5 h-7 bg-accent-blue rounded-full opacity-55" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 relative z-10 bg-bg-surface/50 border-t border-border-custom">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
            <div className="text-xs font-semibold tracking-wider text-accent-violet uppercase">
              Pricing
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-text-primary">
              Simple, transparent pricing.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            {/* Free */}
            <div className="bg-card-bg rounded-2xl border border-border-custom p-8 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 hover:shadow-md">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-xl text-text-primary">Free</h3>
                  <div className="text-4xl font-bold tracking-tight text-text-primary mt-3">
                    $0<span className="text-sm font-normal text-text-secondary">/mo</span>
                  </div>
                </div>
                <ul className="space-y-3.5 list-none p-0 text-sm text-text-secondary">
                  <li className="flex gap-2.5 items-center">
                    <Check className="w-4.5 h-4.5 text-[#22C55E]" />
                    10GB storage
                  </li>
                  <li className="flex gap-2.5 items-center">
                    <Check className="w-4.5 h-4.5 text-[#22C55E]" />
                    Basic AI sorting
                  </li>
                  <li className="flex gap-2.5 items-center">
                    <Check className="w-4.5 h-4.5 text-[#22C55E]" />
                    5 workspaces
                  </li>
                  <li className="flex gap-2.5 items-center">
                    <Check className="w-4.5 h-4.5 text-[#22C55E]" />
                    Standard search
                  </li>
                </ul>
              </div>
              <Link
                href="/dashboard"
                className="w-full inline-flex items-center justify-center bg-transparent hover:bg-bg-surface border border-border-custom hover:border-text-secondary text-text-primary text-sm font-semibold py-3 rounded-full mt-8 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Pro - Featured with Shimmer */}
            <div className="bg-card-bg rounded-2xl border-2 border-transparent relative flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl scale-100 md:scale-[1.03] overflow-hidden"
              style={{
                borderImage: "linear-gradient(135deg, var(--accent-blue), var(--accent-violet)) 1",
                borderRadius: "16px"
              }}
            >
              {/* Custom border rounding patch for CSS border-image */}
              <div className="absolute inset-0 border-[2px] border-accent-blue/30 rounded-2xl pointer-events-none" />
              <div className="absolute top-0 right-6 bg-gradient-to-r from-accent-blue to-accent-violet text-white text-[10px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-b-lg shadow-sm">
                Most Popular
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <h3 className="font-semibold text-xl text-text-primary">Pro</h3>
                  <div className="text-4xl font-bold tracking-tight text-text-primary mt-3">
                    $12<span className="text-sm font-normal text-text-secondary">/mo</span>
                  </div>
                </div>
                <ul className="space-y-3.5 list-none p-0 text-sm text-text-secondary">
                  <li className="flex gap-2.5 items-center">
                    <Check className="w-4.5 h-4.5 text-[#22C55E]" />
                    Unlimited storage
                  </li>
                  <li className="flex gap-2.5 items-center">
                    <Check className="w-4.5 h-4.5 text-[#22C55E]" />
                    AI classification
                  </li>
                  <li className="flex gap-2.5 items-center">
                    <Check className="w-4.5 h-4.5 text-[#22C55E]" />
                    Semantic search
                  </li>
                  <li className="flex gap-2.5 items-center">
                    <Check className="w-4.5 h-4.5 text-[#22C55E]" />
                    Duplicate detection
                  </li>
                  <li className="flex gap-2.5 items-center">
                    <Check className="w-4.5 h-4.5 text-[#22C55E]" />
                    Priority support
                  </li>
                </ul>
              </div>
              <div className="px-8 pb-8">
                <Link
                  href="/dashboard"
                  className="w-full inline-flex items-center justify-center bg-accent-blue hover:bg-accent-blue/90 text-white text-sm font-semibold py-3 rounded-full transition-colors shadow-lg shadow-accent-blue/15"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Team */}
            <div className="bg-card-bg rounded-2xl border border-border-custom p-8 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 hover:shadow-md">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-xl text-text-primary">Team</h3>
                  <div className="text-4xl font-bold tracking-tight text-text-primary mt-3">
                    $29<span className="text-sm font-normal text-text-secondary">/mo per seat</span>
                  </div>
                </div>
                <ul className="space-y-3.5 list-none p-0 text-sm text-text-secondary">
                  <li className="flex gap-2.5 items-center">
                    <Check className="w-4.5 h-4.5 text-[#22C55E]" />
                    Everything in Pro
                  </li>
                  <li className="flex gap-2.5 items-center">
                    <Check className="w-4.5 h-4.5 text-[#22C55E]" />
                    RBAC & permissions
                  </li>
                  <li className="flex gap-2.5 items-center">
                    <Check className="w-4.5 h-4.5 text-[#22C55E]" />
                    Audit logs
                  </li>
                  <li className="flex gap-2.5 items-center">
                    <Check className="w-4.5 h-4.5 text-[#22C55E]" />
                    Shared workspaces
                  </li>
                  <li className="flex gap-2.5 items-center">
                    <Check className="w-4.5 h-4.5 text-[#22C55E]" />
                    Webhooks & API
                  </li>
                </ul>
              </div>
              <button
                className="w-full inline-flex items-center justify-center bg-transparent hover:bg-bg-surface border border-border-custom hover:border-text-secondary text-text-primary text-sm font-semibold py-3 rounded-full mt-8 transition-colors"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 relative z-10 border-t border-border-custom">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary">Loved by thousands.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sarah Mitchell */}
            <div className="bg-glass-bg border border-border-custom rounded-2xl p-8 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 hover:shadow-lg">
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#F59E0B] fill-current" />
                  ))}
                </div>
                <p className="text-sm text-text-secondary italic leading-relaxed">
                  &quot;FileFlow transformed our asset library. What used to take hours of manual organization now happens automatically. It&apos;s like having a librarian who never sleeps.&quot;
                </p>
              </div>
              <div className="flex gap-3 items-center pt-6 border-t border-border-custom mt-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center text-white font-semibold text-sm">
                  SM
                </div>
                <div>
                  <h5 className="font-semibold text-sm text-text-primary">Sarah Mitchell</h5>
                  <p className="text-xs text-text-secondary">Design Lead at Figma</p>
                </div>
              </div>
            </div>

            {/* James Chen */}
            <div className="bg-glass-bg border border-border-custom rounded-2xl p-8 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 hover:shadow-lg">
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#F59E0B] fill-current" />
                  ))}
                </div>
                <p className="text-sm text-text-secondary italic leading-relaxed">
                  &quot;The semantic search is magic. I can find any document by describing what I remember about it. Our team productivity increased 40% in the first month.&quot;
                </p>
              </div>
              <div className="flex gap-3 items-center pt-6 border-t border-border-custom mt-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-violet to-accent-blue flex items-center justify-center text-white font-semibold text-sm">
                  JC
                </div>
                <div>
                  <h5 className="font-semibold text-sm text-text-primary">James Chen</h5>
                  <p className="text-xs text-text-secondary">CTO at Linear</p>
                </div>
              </div>
            </div>

            {/* Elena Rodriguez */}
            <div className="bg-glass-bg border border-border-custom rounded-2xl p-8 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 hover:shadow-lg">
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#F59E0B] fill-current" />
                  ))}
                </div>
                <p className="text-sm text-text-secondary italic leading-relaxed">
                  &quot;We migrated 50,000+ files and FileFlow sorted them perfectly. The duplicate detection alone saved us 200GB of storage. Absolutely essential tool.&quot;
                </p>
              </div>
              <div className="flex gap-3 items-center pt-6 border-t border-border-custom mt-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center text-white font-semibold text-sm">
                  ER
                </div>
                <div>
                  <h5 className="font-semibold text-sm text-text-primary">Elena Rodriguez</h5>
                  <p className="text-xs text-text-secondary">Operations at Notion</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
            Join 12,000+ professionals who&apos;ve already transformed their digital workspace.
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
              href="#"
              className="inline-flex items-center gap-2 bg-transparent hover:bg-white/5 text-[#F0F0F8] border border-white/10 hover:border-white/30 font-semibold px-8 py-3.5 rounded-full"
            >
              View Documentation
            </a>
          </div>

          <div className="text-xs text-[#6B6B8A] pt-4">
            No credit card required · Google Sign-In only · Cancel anytime
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-footer-bg text-footer-text py-16 px-6 relative z-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-4 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center text-white font-bold text-lg">
                F
              </div>
              <span className="font-semibold text-xl tracking-tight text-white">
                FileFlow
              </span>
            </Link>
            <p className="text-sm text-[#6B6B8A] leading-relaxed max-w-sm">
              Your files, finally intelligent. AI-powered organization for modern teams.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" aria-label="GitHub" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#6B6B8A] hover:text-white transition-colors">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#6B6B8A] hover:text-white transition-colors">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links 1 */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase">Product</h4>
            <ul className="space-y-2.5 list-none p-0 text-sm text-[#6B6B8A]">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase">Company</h4>
            <ul className="space-y-2.5 list-none p-0 text-sm text-[#6B6B8A]">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
            </ul>
          </div>

          {/* Links 3 */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase">Legal</h4>
            <ul className="space-y-2.5 list-none p-0 text-sm text-[#6B6B8A]">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
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
