"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname
import { Home, BarChart3, ListOrdered, Search, User, LogOut } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { NavUser } from "./nav-user";
import { Button } from "./ui/button";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  menuItems: [
    { label: "Portfolio", icon: Home, href: "/dashboard" },
    { label: "Market", icon: BarChart3, href: "/dashboard/market" },
    { label: "Orders", icon: ListOrdered, href: "/dashboard/orders" },
    { label: "Search", icon: Search, href: "/dashboard/search" },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname(); // Get the current route

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {data.menuItems.map((item, index) => {
            const isActive = pathname === item.href; // Check if current route matches
            return (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton asChild tooltip={item.label}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
                      isActive ? "bg-accent text-white" : "hover:bg-accent"
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
            <LogoutLink>
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
