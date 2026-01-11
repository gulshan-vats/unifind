"use client"

import * as React from "react"
import { useSession } from "next-auth/react"

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
    bio: string
    location: string
    education: {
        degree: string
        university: string
        years: string
        gpa: string
    }
    skills: string[]
    interests: string[]
    socials: {
        linkedin: string
        github: string
        twitter: string
    }
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
        avatar: "/avatars/shadcn.jpg",
        bio: "Passionate student explorer at Unifind. I'm focused on leveraging AI to find the best opportunities for my career growth.",
        location: "San Francisco, CA",
        education: {
            degree: "Bachelor of Science in Computer Science",
            university: "University of Technology",
            years: "2022 - 2026",
            gpa: "9.0/10.0"
        },
        skills: ["React", "Next.js", "TypeScript", "Python", "Node.js", "Tailwind CSS", "AI/ML", "Git"],
        interests: ["Web Development", "Open Source", "UI/UX Design", "Blockchain", "Cloud Computing"],
        socials: {
            linkedin: "",
            github: "",
            twitter: ""
        }
    })
    const [isLoaded, setIsLoaded] = React.useState(false)

    const { data: session } = useSession()

    // Sync user profile with session
    React.useEffect(() => {
        if (session?.user) {
            const { name, email, image } = session.user
            setUserProfile(prev => ({
                ...prev,
                name: name || prev.name,
                email: email || prev.email,
                avatar: image || prev.avatar,
            }))
        }
    }, [session])

    // Load from localStorage on mount
    React.useEffect(() => {
        const savedProfile = localStorage.getItem("unifind_user_profile")
        if (savedProfile) {
            try {
                const parsed = JSON.parse(savedProfile)
                // Merge with initial state to ensure new fields exist
                setUserProfile(prev => ({
                    ...prev,
                    ...parsed,
                    // Deep merge for nested objects if necessary
                    education: { ...prev.education, ...(parsed.education || {}) },
                    socials: { ...prev.socials, ...(parsed.socials || {}) },
                    skills: parsed.skills || prev.skills,
                    interests: parsed.interests || prev.interests,
                }))
            } catch (e) {
                console.error("Failed to parse saved profile", e)
            }
        }
        setIsLoaded(true)
    }, [])

    // Save to localStorage whenever userProfile changes
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
            avatar: "/avatars/shadcn.jpg",
            bio: "",
            location: "",
            education: {
                degree: "",
                university: "",
                years: "",
                gpa: ""
            },
            skills: [],
            interests: [],
            socials: {
                linkedin: "",
                github: "",
                twitter: ""
            }
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
