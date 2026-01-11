"use client"

import * as React from "react"
import { ArrowUp, Mic, Paperclip, Globe, X, File as FileIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface PromptBoxProps {
    onSubmit: (value: string, isWebSearch: boolean, files: File[]) => void
    isLoading: boolean
    hasMessages: boolean
}

export function PromptBox({ onSubmit, isLoading, hasMessages }: PromptBoxProps) {
    const [inputValue, setInputValue] = React.useState("")
    const [isWebSearch, setIsWebSearch] = React.useState(false)
    const [files, setFiles] = React.useState<File[]>([])
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleSendMessage = () => {
        if (!inputValue.trim() && files.length === 0) return
        onSubmit(inputValue, isWebSearch, files)
        setInputValue("")
        setFiles([])
        setIsWebSearch(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSendMessage()
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles((prev) => [...prev, ...Array.from(e.target.files || [])])
        }
    }

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index))
    }

    return (
        <div className={cn(
            "w-full transition-all duration-500 ease-in-out z-10 shrink-0",
            hasMessages ? "p-4" : "relative mt-4 p-4 pt-2"
        )}>
            <div className="relative flex flex-col w-full bg-background/80 backdrop-blur-xl rounded-3xl border border-input/50 focus-within:border-ring/50 focus-within:ring-1 focus-within:ring-ring/50 transition-all shadow-sm hover:shadow-md">

                {files.length > 0 && (
                    <div className="flex gap-2 p-4 pb-0 overflow-x-auto scrollbar-hide">
                        {files.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-xl border text-xs shrink-0">
                                <FileIcon className="size-3.5 text-muted-foreground" />
                                <span className="max-w-[100px] truncate">{file.name}</span>
                                <button onClick={() => removeFile(index)} className="hover:bg-muted rounded-full p-0.5">
                                    <X className="size-3 text-muted-foreground" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-center w-full p-4">
                    <div className="flex gap-2 mr-2">
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                        />
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full text-muted-foreground hover:text-foreground"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Paperclip className="size-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Attach files</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                    </div>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything..."
                        className="flex-1 bg-transparent border-none outline-none text-lg placeholder:text-muted-foreground/70"
                    />
                    <div className="flex gap-2 ml-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={cn(
                                            "rounded-full transition-colors",
                                            isWebSearch ? "text-blue-600 bg-blue-50 hover:bg-blue-100" : "text-muted-foreground hover:text-foreground"
                                        )}
                                        onClick={() => setIsWebSearch(!isWebSearch)}
                                    >
                                        <Globe className="size-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Web Search</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
                            <Mic className="size-5" />
                        </Button>
                        <Button
                            size="icon"
                            className={cn("rounded-full shadow-sm transition-colors", (inputValue.trim() || files.length > 0) ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-muted text-muted-foreground")}
                            onClick={handleSendMessage}
                            disabled={(!inputValue.trim() && files.length === 0) || isLoading}
                        >
                            <ArrowUp className="size-5" />
                        </Button>
                    </div>
                </div>
            </div>
            {!hasMessages && (
                <div className="mt-4 flex flex-wrap gap-2 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-backwards">
                    {["Summarize this article", "Help me study", "Plan my schedule", "Find scholarships"].map((suggestion) => (
                        <Button
                            key={suggestion}
                            variant="outline"
                            className="rounded-full text-sm font-normal bg-background/50 hover:bg-background transition-colors"
                            onClick={() => setInputValue(suggestion)}
                        >
                            {suggestion}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    )
}
