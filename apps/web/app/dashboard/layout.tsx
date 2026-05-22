import { Sidebar } from "@/components/sidebar"
import { DashboardNav } from "@/components/dashboard-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex">
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Main Content Wrapper - offset by sidebar width on md+ screens */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen">
        <DashboardNav />
        <main className="flex-1 overflow-x-hidden p-6 lg:p-8 bg-bg-primary">
          {children}
        </main>
      </div>
    </div>
  )
}
