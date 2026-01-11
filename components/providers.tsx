"use client"

import * as React from "react"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"
import { ChatProvider } from "@/context/chat-context"
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <ChatProvider>
                    {children}
                    <Toaster position="top-center" richColors />
                </ChatProvider>
            </ThemeProvider>
        </SessionProvider>
    )
}
