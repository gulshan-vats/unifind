"use client"

import * as React from "react"
import { User, Bot } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MarkdownRenderer } from "@/components/markdown-renderer"

import { useData } from "@/context/data-context"

export interface Message {
    id: string
    role: "user" | "ai"
    content: string
}

interface ChatListProps {
    messages: Message[]
    isLoading: boolean
}

export function ChatList({ messages, isLoading }: ChatListProps) {
    const { userProfile } = useData()
    const messagesEndRef = React.useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    React.useEffect(() => {
        scrollToBottom()
    }, [messages, isLoading])

    return (
        <div className="flex-1 min-h-0 overflow-y-auto w-full space-y-6 p-4 scrollbar-hide [&::-webkit-scrollbar]:hidden overscroll-contain">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={cn(
                        "flex gap-4 w-full animate-in slide-in-from-bottom-2 fade-in duration-300",
                        message.role === "user" ? "justify-end" : "justify-start"
                    )}
                >
                    {message.role === "ai" && (
                        <Avatar className="size-8 mt-1">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                                <Bot className="size-5" />
                            </AvatarFallback>
                        </Avatar>
                    )}
                    <div
                        className={cn(
                            "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                            message.role === "user"
                                ? "bg-blue-600 text-white rounded-br-none"
                                : "bg-muted text-foreground rounded-bl-none"
                        )}
                    >
                        {message.role === "ai" ? (
                            <MarkdownRenderer content={message.content} />
                        ) : (
                            message.content
                        )}
                    </div>
                    {message.role === "user" && (
                        <Avatar className="size-8 mt-1">
                            <AvatarImage src={userProfile.avatar} />
                            <AvatarFallback className="bg-slate-100">
                                <User className="size-5" />
                            </AvatarFallback>
                        </Avatar>
                    )}
                </div>
            ))}
            {isLoading && (
                <div className="flex gap-4 w-full justify-start animate-in slide-in-from-bottom-2 fade-in duration-300">
                    <Avatar className="size-8 mt-1">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                            <Bot className="size-5" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-2.5 flex items-center gap-1 shadow-sm">
                        <span className="size-1.5 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="size-1.5 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="size-1.5 bg-foreground/50 rounded-full animate-bounce"></span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    )
}
