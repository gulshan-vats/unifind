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
  Star,
  MessageSquare,
  MoreHorizontal,
  Trash2,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import NextLink from "next/link"
import { usePathname } from "next/navigation"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { useChat } from "@/context/chat-context"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
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
      url: "/dashboard/help",
      icon: MessageCircleQuestion,
    },
  ],
}

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { setActiveSessionId, sessions, activeSessionId, toggleSessionFavorite, deleteSession } = useChat()
  const pathname = usePathname()

  const favorites = React.useMemo(() => {
    return sessions.filter(s => s.isFavorite)
  }, [sessions])

  const navMainWithActive = data.navMain.map((item) => ({
    ...item,
    isActive: item.url === "/dashboard"
      ? (pathname === "/dashboard" || pathname.startsWith("/dashboard/chat"))
      : pathname === item.url
  }))
  return (
    <Sidebar collapsible="icon" className="border-r-0" {...props}>
      <SidebarHeader>
        <div className="flex h-14 items-center justify-between px-2 group-data-[collapsible=icon]:justify-center">
          <div className="group-data-[collapsible=icon]:hidden flex items-center gap-2 px-1">
            <div className="flex aspect-square size-5 items-center justify-center rounded-md overflow-hidden">
              <img src="/logo.png" alt="Unifind Logo" className="size-full object-cover" />
            </div>
            <span className="truncate font-medium">Unifind</span>
          </div>
          <div className="flex items-center gap-1.5">
            <NextLink href="/dashboard" passHref>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 group-data-[collapsible=icon]:hidden"
                onClick={() => setActiveSessionId(null)}
                title="New Chat"
              >
                <Plus className="size-4" />
              </Button>
            </NextLink>
            <SidebarTrigger className="size-8 [&>svg]:size-4" />
          </div>
        </div>
        <NavMain items={navMainWithActive} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Favorites</SidebarGroupLabel>
          <SidebarMenu>
            {favorites.length > 0 ? (
              favorites.map((fav) => (
                <SidebarMenuItem key={fav.id}>
                  <SidebarMenuButton asChild isActive={fav.id === activeSessionId}>
                    <NextLink href={`/dashboard/chat/${fav.id}`}>
                      <Star className="mr-2 size-3 fill-yellow-500 text-yellow-500" />
                      <span className="truncate">{fav.title}</span>
                    </NextLink>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal className="size-3" />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48" align="start" side="right">
                      <DropdownMenuItem
                        onClick={() => toggleSessionFavorite(fav.id)}
                        className="cursor-pointer"
                      >
                        <Star className="mr-2 size-4 fill-yellow-500 text-yellow-500" />
                        <span>Unfavorite</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteSession(fav.id)}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="mr-2 size-4" />
                        <span>Delete Chat</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))
            ) : (
              <div className="px-2 text-xs text-muted-foreground">No favorites yet</div>
            )}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarMenu>
            {sessions.filter(s => !s.isFavorite).length > 0 ? (
              sessions.filter(s => !s.isFavorite).slice(0, 5).map((session) => (
                <SidebarMenuItem key={session.id}>
                  <SidebarMenuButton asChild isActive={session.id === activeSessionId}>
                    <NextLink href={`/dashboard/chat/${session.id}`}>
                      <MessageSquare className="mr-2 size-3" />
                      <span className="truncate">{session.title}</span>
                    </NextLink>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal className="size-3" />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48" align="start" side="right">
                      <DropdownMenuItem
                        onClick={() => toggleSessionFavorite(session.id)}
                        className="cursor-pointer"
                      >
                        <Star className="mr-2 size-4" />
                        <span>Favorite</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteSession(session.id)}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="mr-2 size-4" />
                        <span>Delete Chat</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))
            ) : (
              <div className="px-2 text-xs text-muted-foreground">No recent chats</div>
            )}
          </SidebarMenu>
        </SidebarGroup>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
