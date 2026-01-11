import * as React from "react"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar"

import { useData } from "@/context/data-context"

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { userProfile } = useData()
  return (
    <Sidebar
      collapsible="none"
      className="sticky top-0 hidden h-svh border-l lg:flex"
      {...props}
    >
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        <NavUser user={userProfile} />
      </SidebarHeader>
      <SidebarContent>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* Content removed as requested */}
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
