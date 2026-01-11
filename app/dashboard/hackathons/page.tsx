"use client"

import * as React from "react"
import { Search, Loader2, ExternalLink, Calendar, AlertCircle, Filter, Trophy, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useData } from "@/context/data-context"

interface Hackathon {
    title: string
    date: string | null
    applyUrl: string
    prizes?: string
    location?: string
}

export default function HackathonsPage() {
    const { hackathons, setHackathons, hasFetchedHackathons, setHasFetchedHackathons } = useData()
    const [filteredHackathons, setFilteredHackathons] = React.useState<Hackathon[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    // Filters
    const [locationFilter, setLocationFilter] = React.useState("All")
    const [searchQuery, setSearchQuery] = React.useState("")

    const fetchHackathons = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch("/api/hackathons", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: "all" }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch hackathons")
            }

            const results = Array.isArray(data) ? data : []
            setHackathons(results)
            setHasFetchedHackathons(true)
            setFilteredHackathons(results)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    // Initial load
    React.useEffect(() => {
        if (!hasFetchedHackathons) {
            fetchHackathons()
        } else {
            setFilteredHackathons(hackathons)
        }
    }, [hasFetchedHackathons])

    // Apply filters
    React.useEffect(() => {
        let filtered = hackathons.filter((item) => {
            const matchesLocation =
                locationFilter === "All" ||
                (item.location && item.location.toLowerCase().includes(locationFilter.toLowerCase())) ||
                (locationFilter === "Remote" && item.location?.toLowerCase().includes("online"))

            const matchesSearch =
                (item.title?.toLowerCase() || "").includes(searchQuery.toLowerCase())

            return matchesLocation && matchesSearch
        })
        setFilteredHackathons(filtered)
    }, [locationFilter, searchQuery, hackathons])

    const locations = [
        "All",
        "Remote",
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
        "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
        "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
        "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
        "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
        "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
    ]

    return (
        <div className="flex flex-col h-full py-4 space-y-4 overflow-hidden items-center">
            <div className="w-[90%] flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by hackathon title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-card border-muted-foreground/20 focus-visible:ring-blue-500/20"
                    />
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchHackathons}
                    disabled={isLoading}
                    className="gap-2"
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCw className="h-4 w-4" />}
                    Refresh
                </Button>
            </div>

            {error && (
                <div className="w-[90%] flex items-center gap-2 p-4 text-sm text-destructive bg-destructive/10 rounded-xl border border-destructive/20">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}

            <div className="w-[90%] flex-1 border rounded-none bg-card overflow-hidden flex flex-col shadow-sm">
                <div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden">
                    <Table className="table-fixed w-full">
                        <TableHeader className="sticky top-0 z-10 shadow-sm">
                            <TableRow className="bg-muted/50 hover:bg-muted/50 border-b">
                                <TableHead className="text-foreground font-semibold uppercase tracking-wider text-[10px] h-10 pl-[25px] w-[35%]">
                                    Hackathon
                                </TableHead>
                                <TableHead className="text-foreground font-semibold uppercase tracking-wider text-[10px] h-10 w-[15%]">
                                    <div className="flex items-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="-ml-3 h-8 gap-1 hover:bg-transparent data-[state=open]:bg-transparent">
                                                    <span className="uppercase tracking-wider text-[10px]">Location</span>
                                                    <Filter className="h-3 w-3" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start" className="w-48">
                                                <DropdownMenuLabel>Filter by Location</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                {locations.map((loc) => (
                                                    <DropdownMenuItem
                                                        key={loc}
                                                        onClick={() => setLocationFilter(loc)}
                                                        className={cn(locationFilter === loc && "bg-accent font-medium")}
                                                    >
                                                        {loc}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableHead>
                                <TableHead className="text-foreground font-semibold uppercase tracking-wider text-[10px] h-10 w-[20%]">
                                    Date
                                </TableHead>
                                <TableHead className="text-foreground font-semibold uppercase tracking-wider text-[10px] h-10 text-right pr-[25px] w-[20%]">Link</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 15 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="pl-[25px]"><div className="h-4 w-60 bg-muted animate-pulse rounded" /></TableCell>
                                        <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                                        <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                                        <TableCell className="text-right pr-[25px]"><div className="h-8 w-20 bg-muted animate-pulse rounded ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                filteredHackathons.map((item, index) => {
                                    return (
                                        <TableRow key={index} className="hover:bg-muted/50 transition-colors border-b">
                                            <TableCell className="py-3 pl-[25px]">
                                                <div className="flex flex-col gap-1 max-w-[350px]">
                                                    <span className="font-medium truncate" title={item.title}>{item.title}</span>
                                                    {item.prizes && (
                                                        <div className="flex items-center gap-1 text-[10px] text-amber-600 font-bold uppercase">
                                                            <Trophy className="h-3 w-3" />
                                                            {item.prizes}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {(item.location || "Not specified").split(/[/,&]|\band\b/i).map((loc, i) => (
                                                        <Badge key={i} variant="outline" className="font-normal rounded-md px-3 truncate max-w-[120px]" title={loc.trim()}>
                                                            {loc.trim()}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {item.date || "TBA"}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right py-3 pr-[25px]">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="rounded-lg gap-1.5 hover:text-blue-600 h-8"
                                                    asChild
                                                >
                                                    <a
                                                        href={item.applyUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        Register <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                    {!isLoading && filteredHackathons.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground">
                            No hackathons found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
