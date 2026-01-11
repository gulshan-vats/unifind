"use client"

import * as React from "react"
import { useData } from "@/context/data-context"
import {
    Mail,
    MapPin,
    Calendar,
    BookOpen,
    GraduationCap,
    Award,
    Trophy,
    Linkedin,
    Github,
    Twitter,
    ExternalLink
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
    const { userProfile } = useData()

    return (
        <div className="flex flex-col w-full p-4 md:p-8 space-y-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-20 [&::-webkit-scrollbar]:hidden">
            {/* Header Section */}
            <div className="relative rounded-3xl bg-gradient-to-br from-blue-600/10 via-violet-600/10 to-background border border-border/50 p-10 md:p-20">
                <div className="absolute top-0 right-0 p-4">
                    <a href="/dashboard/settings">
                        <Button variant="outline" size="sm" className="rounded-full bg-background/50 backdrop-blur-sm">
                            Edit Profile
                        </Button>
                    </a>
                </div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                    <Avatar className="size-32 md:size-44 border-4 border-background shadow-2xl">
                        <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                        <AvatarFallback className="text-4xl">{userProfile.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{userProfile.name}</h1>
                            <p className="text-xl text-muted-foreground mt-2">
                                {userProfile.education?.degree || "Student"} @ {userProfile.education?.university || "University"}
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="size-4" />
                                {userProfile.location || "Location not set"}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Mail className="size-4" />
                                {userProfile.email}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar className="size-4" />
                                Joined January 2026
                            </div>
                        </div>

                        <div className="flex justify-center md:justify-start gap-3">
                            {userProfile.socials?.linkedin && (
                                <a href={userProfile.socials.linkedin} target="_blank" rel="noopener noreferrer">
                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-500/10 hover:text-blue-500">
                                        <Linkedin className="size-5" />
                                    </Button>
                                </a>
                            )}
                            {userProfile.socials?.github && (
                                <a href={userProfile.socials.github} target="_blank" rel="noopener noreferrer">
                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-zinc-800/10 hover:text-zinc-800 dark:hover:text-white">
                                        <Github className="size-5" />
                                    </Button>
                                </a>
                            )}
                            {userProfile.socials?.twitter && (
                                <a href={userProfile.socials.twitter} target="_blank" rel="noopener noreferrer">
                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-sky-500/10 hover:text-sky-500">
                                        <Twitter className="size-5" />
                                    </Button>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="md:col-span-2 space-y-8">
                    <Card className="rounded-3xl border-border/50 bg-background/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="size-5 text-blue-500" />
                                About
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                {userProfile.bio || "No bio added yet. Go to settings to tell us about yourself!"}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl border-border/50 bg-background/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GraduationCap className="size-5 text-violet-500" />
                                Education
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {userProfile.education?.university ? (
                                <div className="flex gap-4">
                                    <div className="size-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
                                        <GraduationCap className="size-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">{userProfile.education.university} • {userProfile.education.years}</p>
                                        {userProfile.education.gpa && (
                                            <p className="text-sm text-muted-foreground mt-1 italic">GPA: {userProfile.education.gpa}</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No education details added yet.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl border-border/50 bg-background/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="size-5 text-amber-500" />
                                Achievements
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex gap-4">
                                <div className="size-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
                                    <Trophy className="size-6 text-amber-500" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">Unifind Member</h4>
                                    <p className="text-sm text-muted-foreground">Joined the community in 2026</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    <Card className="rounded-3xl border-border/50 bg-background/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Skills</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {userProfile.skills.length > 0 ? (
                                userProfile.skills.map((skill) => (
                                    <Badge key={skill} variant="secondary" className="rounded-full px-3 py-1 bg-muted/50 border-none">
                                        {skill}
                                    </Badge>
                                ))
                            ) : (
                                <p className="text-xs text-muted-foreground">No skills added yet.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl border-border/50 bg-background/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Interests</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {userProfile.interests.length > 0 ? (
                                userProfile.interests.map((interest) => (
                                    <Badge key={interest} variant="outline" className="rounded-full px-3 py-1 border-border/50">
                                        {interest}
                                    </Badge>
                                ))
                            ) : (
                                <p className="text-xs text-muted-foreground">No interests added yet.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl border-border/50 bg-gradient-to-br from-blue-600 to-violet-600 text-white p-6">
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold">Ready for your next opportunity?</h3>
                            <p className="text-blue-50 text-sm">
                                Explore internships and hackathons tailored for your profile.
                            </p>
                            <a href="/dashboard/internships">
                                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-semibold">
                                    Browse Opportunities
                                </Button>
                            </a>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
