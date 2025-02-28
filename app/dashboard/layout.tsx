import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeToggle } from "@/components/ui/theme-toggel"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
    <AppSidebar />
      <main>
        <div className="flex flex-row justify-between w-screen pl-5 pr-5 pt-2">
        <SidebarTrigger />
        <ThemeToggle/>
        </div>
        
            {children}
        
      </main>
    </SidebarProvider>
  )
}
