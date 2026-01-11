"use client"

import * as React from "react"
import { User, Bot, Copy, Share2, Volume2, Square, Star, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MarkdownRenderer } from "@/components/markdown-renderer"

import { useData } from "@/context/data-context"
import { useChat } from "@/context/chat-context"

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
    const { activeSessionId, deleteMessage } = useChat()
    const messagesEndRef = React.useRef<HTMLDivElement>(null)
    const [speakingId, setSpeakingId] = React.useState<string | null>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    React.useEffect(() => {
        scrollToBottom()
    }, [messages, isLoading])

    return (
        <div className="flex-1 min-h-0 overflow-y-auto w-full space-y-6 p-9 scrollbar-hide [&::-webkit-scrollbar]:hidden overscroll-contain">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={cn(
                        "flex gap-4 w-full animate-in slide-in-from-bottom-2 fade-in duration-300 group",
                        message.role === "user" ? "justify-end" : "justify-start"
                    )}
                >
                    {message.role === "ai" && (
                        <Avatar className="size-8 mt-1">
                            <AvatarImage src="/logo.png" />
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                                <Bot className="size-5" />
                            </AvatarFallback>
                        </Avatar>
                    )}
                    <div
                        className={cn(
                            "px-5 py-3.5 text-sm shadow-sm",
                            message.role === "user"
                                ? "bg-blue-600 text-white rounded-2xl rounded-br-none max-w-[80%]"
                                : "bg-background border border-border text-foreground rounded-2xl rounded-bl-none w-full overflow-hidden"
                        )}
                    >
                        {message.role === "ai" ? (
                            <MarkdownRenderer content={message.content} />
                        ) : (
                            message.content
                        )}
                        {message.role === "ai" && (
                            <div className="flex gap-2 mt-2 pt-2 border-t border-border/50">
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(message.content)
                                        toast.success("Copied to clipboard")
                                    }}
                                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <Copy className="size-3.5" />
                                    Copy
                                </button>
                                <button
                                    onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({
                                                title: "Unifind AI Response",
                                                text: message.content,
                                            }).catch(console.error)
                                        } else {
                                            navigator.clipboard.writeText(message.content)
                                            toast.success("Copied to clipboard")
                                        }
                                    }}
                                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <Share2 className="size-3.5" />
                                    Share
                                </button>
                                <button
                                    onClick={() => {
                                        if (speakingId === message.id) {
                                            window.speechSynthesis.cancel()
                                            setSpeakingId(null)
                                        } else {
                                            window.speechSynthesis.cancel()
                                            const utterance = new SpeechSynthesisUtterance(message.content)
                                            utterance.onend = () => setSpeakingId(null)
                                            window.speechSynthesis.speak(utterance)
                                            setSpeakingId(message.id)
                                        }
                                    }}
                                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {speakingId === message.id ? <Square className="size-3.5 fill-current" /> : <Volume2 className="size-3.5" />}
                                    {speakingId === message.id ? "Stop" : "Listen"}
                                </button>
                                <button
                                    onClick={() => deleteMessage(activeSessionId!, message.id)}
                                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="size-3.5" />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                    {message.role === "user" && (
                        <div className="flex flex-col items-end gap-1">
                            <Avatar className="size-8 mt-1">
                                <AvatarImage src={userProfile.avatar} />
                                <AvatarFallback className="bg-slate-100">
                                    <User className="size-5" />
                                </AvatarFallback>
                            </Avatar>
                            <button
                                onClick={() => deleteMessage(activeSessionId!, message.id)}
                                className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                title="Delete"
                            >
                                <Trash2 className="size-3.5" />
                            </button>
                        </div>
                    )}
                </div>
            ))}
            {isLoading && (
                <div className="flex gap-4 w-full justify-start animate-in slide-in-from-bottom-2 fade-in duration-300">
                    <Avatar className="size-8 mt-1">
                        <AvatarImage src="/logo.png" />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                            <Bot className="size-5" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1.5 shadow-sm">
                        <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    )
}
