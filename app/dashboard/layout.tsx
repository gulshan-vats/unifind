"use client"

import * as React from "react"

import { SidebarLeft } from "@/components/sidebar-left"
import { UserNav } from "@/components/user-nav"
import { DataProvider } from "@/context/data-context"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <DataProvider>
            <SidebarProvider>
                <SidebarLeft />
                <SidebarInset>
                    <header className="bg-background sticky top-0 flex h-14 shrink-0 items-center gap-2 border-b z-50">
                        <div className="flex flex-1 items-center gap-2 px-3">
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbPage className="line-clamp-1 pl-[10px]">
                                            Student Dashboard
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <div className="ml-auto pr-[25px]">
                            <UserNav />
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col h-[calc(100vh-3.5rem)] max-h-[calc(100vh-3.5rem)] overflow-hidden pt-[15px]">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </DataProvider>
    )
}
