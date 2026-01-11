"use client"

import {
  ArrowUpRight,
  Link,
  MoreHorizontal,
  StarOff,
  Trash2,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import NextLink from "next/link"
import { useChat } from "@/context/chat-context"

export function NavFavorites() {
  const { isMobile } = useSidebar()
  const { sessions, activeSessionId, deleteSession } = useChat()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
      <SidebarMenu>
        {sessions.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
              asChild
              isActive={activeSessionId === item.id}
              title={item.title}
            >
              <NextLink href={`/dashboard/chat/${item.id}`}>
                <span>💬</span>
                <span className="truncate">{item.title}</span>
              </NextLink>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: item.title, url: window.location.href })
                  } else {
                    navigator.clipboard.writeText(window.location.href)
                  }
                }}>
                  <Link className="text-muted-foreground" />
                  <span>Share Chat</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(window.location.href, "_blank")}>
                  <ArrowUpRight className="text-muted-foreground" />
                  <span>Open in New Tab</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => deleteSession(item.id)} className="text-destructive focus:text-destructive">
                  <Trash2 className="size-4 mr-2" />
                  <span>Delete Chat</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        {sessions.length === 0 && (
          <div className="px-4 py-2 text-xs text-muted-foreground italic">
            No recent chats
          </div>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
