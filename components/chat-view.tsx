"use client"

import * as React from "react"
import { ChatList } from "@/components/chat-list"
import { PromptBox } from "@/components/prompt-box"
import { cn } from "@/lib/utils"
import { Star, MoreVertical, Trash2 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useParams, useRouter } from "next/navigation"
import { useChat, Message } from "@/context/chat-context"
import { useData } from "@/context/data-context"

export function ChatView() {
    const params = useParams()
    const router = useRouter()
    const sessionId = params?.id as string | undefined

    const {
        sessions,
        activeSessionId,
        createSession,
        addMessageToSession,
        setActiveSessionId,
        isLoading,
        setIsLoading,
        toggleSessionFavorite,
        deleteSession
    } = useChat()
    const { userProfile } = useData()

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "Good Morning"
        if (hour < 18) return "Good Afternoon"
        return "Good Evening"
    }

    // Sync URL with Context
    React.useEffect(() => {
        if (sessionId && sessionId !== activeSessionId) {
            setActiveSessionId(sessionId)
        } else if (!sessionId && activeSessionId && !isLoading) {
            setActiveSessionId(null)
        }
    }, [sessionId, activeSessionId, setActiveSessionId, isLoading])

    const activeSession = sessions.find(s => s.id === activeSessionId)
    const messages = activeSession?.messages || []

    const handleSendMessage = async (content: string, isWebSearch: boolean, files: File[]) => {
        setIsLoading(true)
        let currentSessionId = sessionId

        if (!currentSessionId) {
            currentSessionId = createSession(content)
            router.push(`/dashboard/chat/${currentSessionId}`)
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: content + (files.length > 0 ? ` [Attached: ${files.map(f => f.name).join(", ")}]` : "") + (isWebSearch ? " [Web Search Enabled]" : ""),
        }

        if (currentSessionId) {
            addMessageToSession(currentSessionId, userMessage)
        }

        try {
            // Convert files to base64
            const processedFiles = await Promise.all(files.map(async (file) => {
                return new Promise<{ data: string; mimeType: string }>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve({
                        data: reader.result as string,
                        mimeType: file.type
                    });
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            }));

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: content,
                    isWebSearch,
                    files: processedFiles
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch response");
            }

            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: data.text,
            }
            if (currentSessionId) {
                addMessageToSession(currentSessionId, aiResponse)
            }
        } catch (error: any) {
            console.error("Chat Error:", error);
            const errorResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: `Error: ${error.message || "Something went wrong."}`,
            }
            if (currentSessionId) {
                addMessageToSession(currentSessionId, errorResponse)
            }
        } finally {
            setIsLoading(false)
        }
    }

    const hasMessages = messages.length > 0

    return (
        <div className={cn(
            "flex flex-col w-full max-w-4xl mx-auto h-full",
            hasMessages ? "justify-between" : "items-center justify-center"
        )}>
            {!hasMessages && (
                <div className="text-center space-y-2 mb-8 animate-in fade-in zoom-in duration-500 px-4">
                    <h1 className="text-4xl font-medium bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                        {getGreeting()}, {userProfile?.name?.split(" ")[0] || "Student"}
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        How can I help you today?
                    </p>
                </div>
            )}

            {hasMessages && (
                <>
                    <ChatList messages={messages} isLoading={isLoading} />
                </>
            )}

            <PromptBox
                onSubmit={handleSendMessage}
                isLoading={isLoading}
                hasMessages={hasMessages}
            />
        </div>
    )
}
