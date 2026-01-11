"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Button } from "@/components/ui/button"

interface CodeBlockProps {
    language: string
    value: string
}

export function CodeBlock({ language, value }: CodeBlockProps) {
    const [isCopied, setIsCopied] = React.useState(false)

    const copyToClipboard = async () => {
        if (!navigator.clipboard) return
        await navigator.clipboard.writeText(value)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
    }

    return (
        <div className="relative w-full rounded-lg bg-zinc-950 font-mono text-sm my-4 overflow-hidden border border-zinc-800">
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
                <span className="text-xs text-zinc-400 lowercase">{language}</span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                    onClick={copyToClipboard}
                >
                    {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span className="sr-only">Copy code</span>
                </Button>
            </div>
            <SyntaxHighlighter
                language={language}
                style={oneDark}
                customStyle={{
                    margin: 0,
                    padding: "1rem",
                    background: "transparent",
                    fontSize: "0.875rem",
                }}
                wrapLines={true}
                wrapLongLines={true}
            >
                {value}
            </SyntaxHighlighter>
        </div>
    )
}
