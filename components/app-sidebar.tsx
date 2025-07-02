// app-sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, ListOrdered, Search, LogOut } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar, // Import useSidebar here
} from "@/components/ui/sidebar";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { NavUser } from "./nav-user";

const data = {
  user: {
    name: "ADMIN",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  menuItems: [
    { label: "Portfolio", icon: Home, href: "/dashboard" },
    { label: "Market", icon: BarChart3, href: "/dashboard/market" },
    { label: "clients", icon: ListOrdered, href: "/dashboard/clients" },
    { label: "Search", icon: Search, href: "/dashboard/search" },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar(); // Destructure isMobile and setOpenMobile

  const handleNavigationClick = () => {
    if (isMobile) {
      setOpenMobile(false); // Close the sidebar if it's in mobile view
    }
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {data.menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton asChild tooltip={item.label}>
                  <Link
                    href={item.href}
                    onClick={handleNavigationClick} // Add onClick handler here
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
                      isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/80" // Adjusted for better contrast
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout" className="bg-red-900 hover:bg-red-800 text-white w-full">
              <LogoutLink onClick={handleNavigationClick}> {/* Add onClick to LogoutLink too */}
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </LogoutLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}