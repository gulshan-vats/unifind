"use client"

import * as React from "react"
import {
  AudioWaveform,
  Command,
  Home,
  Inbox,
  MessageCircleQuestion,
  Search,
  Settings2,
  Sparkles,
  Plus,
  Briefcase,
  Trophy,
  FileText,
} from "lucide-react"

import NextLink from "next/link"
import { usePathname } from "next/navigation"
import { NavFavorites } from "@/components/nav-favorites"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { useChat } from "@/context/chat-context"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  teams: [
    {
      name: "Unifind",
      logo: Command,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Ask AI",
      url: "/dashboard",
      icon: Sparkles,
    },
    {
      title: "Internships",
      url: "/dashboard/internships",
      icon: Briefcase,
    },
    {
      title: "Hackathons",
      url: "/dashboard/hackathons",
      icon: Trophy,
    },
    {
      title: "Resource Hub",
      url: "/dashboard/resources",
      icon: FileText,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
    },
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],
}

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { setActiveSessionId } = useChat()
  const pathname = usePathname()

  const navMainWithActive = data.navMain.map((item) => ({
    ...item,
    isActive: item.url === "/dashboard"
      ? (pathname === "/dashboard" || pathname.startsWith("/dashboard/chat"))
      : pathname === item.url
  }))
  return (
    <Sidebar collapsible="icon" className="border-r-0" {...props}>
      <SidebarHeader>
        <div className="flex h-14 items-center justify-between px-1 pb-[10px] group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!pb-[10px]">
          <div className="group-data-[collapsible=icon]:hidden flex items-center gap-2 px-1.5">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-5 items-center justify-center rounded-md">
              <Command className="size-3" />
            </div>
            <span className="truncate font-medium">Unifind</span>
          </div>
          <div className="flex items-center gap-2">
            <NextLink href="/dashboard" passHref>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 group-data-[collapsible=icon]:hidden"
                onClick={() => setActiveSessionId(null)}
                title="New Chat"
              >
                <Plus className="size-4" />
              </Button>
            </NextLink>
            <SidebarTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-7" />
          </div>
        </div>
        <NavMain items={navMainWithActive} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
