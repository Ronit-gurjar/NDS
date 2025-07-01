import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggel";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarInset>
          {/* Persistent Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex w-full justify-between items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <h1 className="text-2xl font-bold ar-one-sans">Signal Hunt Admin</h1>
              <div className="flex justify-end">
                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Dynamic Content */}
          <div className="p-6">{children}</div>
        </SidebarInset>
      </main>
    </SidebarProvider>
  );
}
