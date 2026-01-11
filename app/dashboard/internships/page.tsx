"use client"

import * as React from "react"
import { Search, Loader2, ExternalLink, Calendar, AlertCircle, Filter, RotateCw } from "lucide-react"
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

interface Internship {
    title: string
    company: string
    deadline: string | null
    applyUrl: string
    eligibility?: string
    location?: string
}

export default function InternshipsPage() {
    const { internships, setInternships, hasFetchedInternships, setHasFetchedInternships } = useData()
    const [filteredInternships, setFilteredInternships] = React.useState<Internship[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    // Filters
    const [locationFilter, setLocationFilter] = React.useState("All")
    const [searchQuery, setSearchQuery] = React.useState("")

    const fetchInternships = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch("/api/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: "all" }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch internships")
            }

            const results = Array.isArray(data) ? data : []
            setInternships(results)
            setHasFetchedInternships(true)
            setFilteredInternships(results)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    // Initial load
    React.useEffect(() => {
        if (!hasFetchedInternships) {
            fetchInternships()
        } else {
            setFilteredInternships(internships)
        }
    }, [hasFetchedInternships])

    // Apply filters
    React.useEffect(() => {
        let filtered = internships.filter((item) => {
            const matchesLocation =
                locationFilter === "All" ||
                (item.location && item.location.toLowerCase().includes(locationFilter.toLowerCase())) ||
                (locationFilter === "Remote" && item.location?.toLowerCase().includes("remote"))

            const matchesSearch =
                (item.company?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                (item.title?.toLowerCase() || "").includes(searchQuery.toLowerCase())

            return matchesLocation && matchesSearch
        })
        setFilteredInternships(filtered)
    }, [locationFilter, searchQuery, internships])

    const calculateDeadlineStatus = (deadline: string | null) => {
        if (!deadline) return { text: "No deadline", isPassed: false, variant: "secondary" as const }

        const deadlineDate = new Date(deadline)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const diffTime = deadlineDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays < 0) {
            return { text: "Passed", isPassed: true, variant: "destructive" as const }
        } else if (diffDays <= 7) {
            return { text: `${diffDays} days left`, isPassed: false, variant: "outline" as const }
        } else {
            return { text: `${diffDays} days left`, isPassed: false, variant: "secondary" as const }
        }
    }

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
                        placeholder="Search by company or role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-card border-muted-foreground/20 focus-visible:ring-blue-500/20"
                    />
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchInternships}
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
                                <TableHead className="text-foreground font-semibold uppercase tracking-wider text-[10px] h-10 pl-[25px] w-[20%]">
                                    Company
                                </TableHead>
                                <TableHead className="text-foreground font-semibold uppercase tracking-wider text-[10px] h-10 w-[20%]">
                                    Role
                                </TableHead>
                                <TableHead className="text-foreground font-semibold uppercase tracking-wider text-[10px] h-10 w-[20%]">
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
                                    Deadline
                                </TableHead>
                                <TableHead className="text-foreground font-semibold uppercase tracking-wider text-[10px] h-10 text-right pr-[25px] w-[20%]">Link</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 15 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="pl-[25px]"><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                                        <TableCell><div className="h-4 w-40 bg-muted animate-pulse rounded" /></TableCell>
                                        <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                                        <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                                        <TableCell className="text-right pr-[25px]"><div className="h-8 w-20 bg-muted animate-pulse rounded ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                filteredInternships.map((item, index) => {
                                    const status = calculateDeadlineStatus(item.deadline)
                                    return (
                                        <TableRow key={index} className="hover:bg-muted/50 transition-colors border-b">
                                            <TableCell className="font-medium py-3 pl-[25px] truncate max-w-[150px]" title={item.company}>
                                                {item.company}
                                            </TableCell>
                                            <TableCell className="py-3 truncate max-w-[200px]" title={item.title}>
                                                {item.title}
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <Badge variant="outline" className="font-normal rounded-md truncate max-w-[120px]" title={item.location || "Not specified"}>
                                                    {item.location || "Not specified"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm text-muted-foreground">
                                                        {item.deadline ? item.deadline.split('T')[0] : "N/A"}
                                                    </span>
                                                    <Badge variant={status.variant} className="w-fit text-[9px] py-0 px-1 h-3.5 uppercase font-bold">
                                                        {status.text}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right py-3 pr-[25px]">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="rounded-lg gap-1.5 hover:text-blue-600 h-8"
                                                    asChild
                                                    disabled={status.isPassed}
                                                >
                                                    <a
                                                        href={item.applyUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={cn(status.isPassed && "pointer-events-none opacity-50")}
                                                    >
                                                        Apply <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                    {!isLoading && filteredInternships.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground">
                            No internships found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
