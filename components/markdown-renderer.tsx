"use client"

import * as React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { CodeBlock } from "@/components/code-block"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface MarkdownRendererProps {
    content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "")
                    return !inline && match ? (
                        <CodeBlock
                            language={match[1]}
                            value={String(children).replace(/\n$/, "")}
                        />
                    ) : (
                        <code
                            className={cn(
                                "bg-muted px-1.5 py-0.5 rounded-md font-mono text-sm text-foreground",
                                className
                            )}
                            {...props}
                        >
                            {children}
                        </code>
                    )
                },
                table({ children }) {
                    return (
                        <div className="my-4 w-full overflow-y-auto rounded-lg border">
                            <Table>{children}</Table>
                        </div>
                    )
                },
                thead({ children }) {
                    return <TableHeader>{children}</TableHeader>
                },
                tbody({ children }) {
                    return <TableBody>{children}</TableBody>
                },
                tr({ children }) {
                    return <TableRow>{children}</TableRow>
                },
                th({ children }) {
                    return <TableHead>{children}</TableHead>
                },
                td({ children }) {
                    return <TableCell>{children}</TableCell>
                },
                a({ href, children }) {
                    return (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            {children}
                        </a>
                    )
                },
                ul({ children }) {
                    return <ul className="list-disc pl-6 my-2 space-y-1">{children}</ul>
                },
                ol({ children }) {
                    return <ol className="list-decimal pl-6 my-2 space-y-1">{children}</ol>
                },
                li({ children }) {
                    return <li className="leading-relaxed">{children}</li>
                },
                p({ children }) {
                    return <p className="leading-relaxed mb-2 last:mb-0">{children}</p>
                },
                h1({ children }) {
                    return <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>
                },
                h2({ children }) {
                    return <h2 className="text-xl font-bold mt-5 mb-3">{children}</h2>
                },
                h3({ children }) {
                    return <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>
                },
                blockquote({ children }) {
                    return <blockquote className="border-l-4 border-primary pl-4 italic my-4">{children}</blockquote>
                }
            }}
        >
            {content}
        </ReactMarkdown>
    )
}
