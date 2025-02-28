import { Calendar, ChartArea, ChartBarIncreasing, Home, Inbox, List, LogOutIcon, Search, Settings, User2 } from "lucide-react"

import {
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {LogoutLink} from "@kinde-oss/kinde-auth-nextjs/components"
import { Button } from "./ui/button"

// Menu items.
const items = [
  {
    title: "Portfolio",
    url: "#",
    icon: Home,
  },
  {
    title: "Market",
    url: "#",
    icon: ChartArea,
  },
  {
    title: "Orders",
    url: "#",
    icon: List,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Account Settings",
    url: "#",
    icon: User2,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <LogoutLink>
            <Button variant={"destructive"} className="w-full"><span><LogOutIcon/></span>Logout</Button>
        </LogoutLink>
      </SidebarFooter>
    </Sidebar>
  )
}
