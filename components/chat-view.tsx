"use client"

import * as React from "react"
import { ChatList } from "@/components/chat-list"
import { PromptBox } from "@/components/prompt-box"
import { cn } from "@/lib/utils"
import { useParams, useRouter } from "next/navigation"
import { useChat, Message } from "@/context/chat-context"

export function ChatView() {
    const params = useParams()
    const router = useRouter()
    const sessionId = params?.id as string | undefined

    const {
        sessions,
        activeSessionId,
        createSession,
        addMessageToSession,
        setActiveSessionId
    } = useChat()

    const [isLoading, setIsLoading] = React.useState(false)

    // Sync URL with Context
    React.useEffect(() => {
        if (sessionId && sessionId !== activeSessionId) {
            setActiveSessionId(sessionId)
        } else if (!sessionId && activeSessionId) {
            setActiveSessionId(null)
        }
    }, [sessionId, activeSessionId, setActiveSessionId])

    const activeSession = sessions.find(s => s.id === activeSessionId)
    const messages = activeSession?.messages || []

    const handleSendMessage = async (content: string, isWebSearch: boolean, files: File[]) => {
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
        setIsLoading(true)

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
                        Hello, Student
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        How can I help you today?
                    </p>
                </div>
            )}

            {hasMessages && (
                <ChatList messages={messages} isLoading={isLoading} />
            )}

            <PromptBox
                onSubmit={handleSendMessage}
                isLoading={isLoading}
                hasMessages={hasMessages}
            />
        </div>
    )
}
