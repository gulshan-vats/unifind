"use client"

import * as React from "react"

interface Internship {
    title: string
    company: string
    deadline: string | null
    applyUrl: string
    eligibility?: string
    location?: string
}

interface Hackathon {
    title: string
    organization: string
    date: string | null
    applyUrl: string
    prizes?: string
    location?: string
}

interface UserProfile {
    name: string
    email: string
    avatar: string
}

interface DataContextType {
    internships: Internship[]
    setInternships: (data: Internship[]) => void
    hackathons: Hackathon[]
    setHackathons: (data: Hackathon[]) => void
    hasFetchedInternships: boolean
    setHasFetchedInternships: (val: boolean) => void
    hasFetchedHackathons: boolean
    setHasFetchedHackathons: (val: boolean) => void
    userProfile: UserProfile
    setUserProfile: (profile: UserProfile) => void
    resetData: () => void
}

const DataContext = React.createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [internships, setInternships] = React.useState<Internship[]>([])
    const [hackathons, setHackathons] = React.useState<Hackathon[]>([])
    const [hasFetchedInternships, setHasFetchedInternships] = React.useState(false)
    const [hasFetchedHackathons, setHasFetchedHackathons] = React.useState(false)
    const [userProfile, setUserProfile] = React.useState<UserProfile>({
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg"
    })
    const [isLoaded, setIsLoaded] = React.useState(false)

    // Load from localStorage on mount
    React.useEffect(() => {
        const savedProfile = localStorage.getItem("unifind_user_profile")
        if (savedProfile) {
            try {
                setUserProfile(JSON.parse(savedProfile))
            } catch (e) {
                console.error("Failed to parse saved profile", e)
            }
        }
        setIsLoaded(true)
    }, [])

    // Save to localStorage on change, but only after initial load
    React.useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("unifind_user_profile", JSON.stringify(userProfile))
        }
    }, [userProfile, isLoaded])

    const resetData = () => {
        localStorage.removeItem("unifind_user_profile")
        setInternships([])
        setHackathons([])
        setHasFetchedInternships(false)
        setHasFetchedHackathons(false)
        setUserProfile({
            name: "shadcn",
            email: "m@example.com",
            avatar: "/avatars/shadcn.jpg"
        })
    }

    return (
        <DataContext.Provider
            value={{
                internships,
                setInternships,
                hackathons,
                setHackathons,
                hasFetchedInternships,
                setHasFetchedInternships,
                hasFetchedHackathons,
                setHasFetchedHackathons,
                userProfile,
                setUserProfile,
                resetData,
            }}
        >
            {children}
        </DataContext.Provider>
    )
}

export function useData() {
    const context = React.useContext(DataContext)
    if (context === undefined) {
        throw new Error("useData must be used within a DataProvider")
    }
    return context
}
