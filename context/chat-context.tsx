"use client"

import * as React from "react"

export interface Message {
    id: string
    role: "user" | "ai"
    content: string
}

export interface ChatSession {
    id: string
    title: string
    messages: Message[]
    createdAt: number
}

interface ChatContextType {
    sessions: ChatSession[]
    activeSessionId: string | null
    setActiveSessionId: (id: string | null) => void
    createSession: (firstMessage: string) => string
    addMessageToSession: (sessionId: string, message: Message) => void
    deleteSession: (id: string) => void
    updateSessionTitle: (id: string, title: string) => void
}

const ChatContext = React.createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [sessions, setSessions] = React.useState<ChatSession[]>([])
    const [activeSessionId, setActiveSessionId] = React.useState<string | null>(null)
    const isLoaded = React.useRef(false)

    // Load from localStorage on mount
    React.useEffect(() => {
        const saved = localStorage.getItem("chat_sessions")
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                setSessions(parsed)
            } catch (e) {
                console.error("Failed to parse saved sessions", e)
            }
        }
        isLoaded.current = true
    }, [])

    // Save to localStorage on change
    React.useEffect(() => {
        if (isLoaded.current) {
            localStorage.setItem("chat_sessions", JSON.stringify(sessions))
        }
    }, [sessions])

    const createSession = (firstMessage: string) => {
        const id = Date.now().toString()
        const newSession: ChatSession = {
            id,
            title: firstMessage.slice(0, 40) + (firstMessage.length > 40 ? "..." : ""),
            messages: [],
            createdAt: Date.now(),
        }
        setSessions((prev) => [newSession, ...prev])
        setActiveSessionId(id)
        return id
    }

    const addMessageToSession = (sessionId: string, message: Message) => {
        setSessions((prev) =>
            prev.map((s) =>
                s.id === sessionId
                    ? { ...s, messages: [...s.messages, message] }
                    : s
            )
        )
    }

    const deleteSession = (id: string) => {
        setSessions((prev) => prev.filter((s) => s.id !== id))
        if (activeSessionId === id) {
            setActiveSessionId(null)
        }
    }

    const updateSessionTitle = (id: string, title: string) => {
        setSessions((prev) =>
            prev.map((s) => (s.id === id ? { ...s, title } : s))
        )
    }

    return (
        <ChatContext.Provider
            value={{
                sessions,
                activeSessionId,
                setActiveSessionId,
                createSession,
                addMessageToSession,
                deleteSession,
                updateSessionTitle,
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}

export function useChat() {
    const context = React.useContext(ChatContext)
    if (context === undefined) {
        throw new Error("useChat must be used within a ChatProvider")
    }
    return context
}
