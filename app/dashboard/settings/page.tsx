"use client"

import * as React from "react"
import {
    User,
    Settings,
    Bell,
    Shield,
    CreditCard,
    Smartphone,
    Globe,
    Moon,
    Sun,
    Check,
    X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { useData } from "@/context/data-context"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

export default function SettingsPage() {
    const { userProfile, setUserProfile, resetData } = useData()
    const { theme, setTheme } = useTheme()
    const [isSaving, setIsSaving] = React.useState(false)
    const [saved, setSaved] = React.useState(false)
    const [localProfile, setLocalProfile] = React.useState(userProfile)
    const [deleteConfirm, setDeleteConfirm] = React.useState("")
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
    const [isOtpDialogOpen, setIsOtpDialogOpen] = React.useState(false)
    const [otpValue, setOtpValue] = React.useState("")
    const [isVerifyingOtp, setIsVerifyingOtp] = React.useState(false)
    const [skillInput, setSkillInput] = React.useState("")
    const [interestInput, setInterestInput] = React.useState("")

    React.useEffect(() => {
        setLocalProfile(userProfile)
    }, [userProfile])

    const handleSave = async () => {
        // Check if email changed
        if (localProfile.email !== userProfile.email) {
            setIsSaving(true)
            try {
                const response = await fetch("/api/auth/send-otp", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: localProfile.name,
                        email: localProfile.email,
                        password: "dummy-password-for-verification" // send-otp expects a password
                    }),
                })

                if (!response.ok) {
                    throw new Error("Failed to send verification code")
                }

                setIsOtpDialogOpen(true)
                toast.info("Verification code sent", {
                    description: `A code has been sent to ${localProfile.email}`
                })
            } catch (error: any) {
                toast.error("Error", { description: error.message })
            } finally {
                setIsSaving(false)
            }
            return
        }

        setIsSaving(true)
        setTimeout(() => {
            setUserProfile(localProfile)
            setIsSaving(false)
            setSaved(true)
            toast.success("Settings updated successfully")
            setTimeout(() => setSaved(false), 2000)
        }, 1000)
    }

    const handleVerifyOtp = async () => {
        setIsVerifyingOtp(true)
        try {
            const response = await fetch("/api/auth/verify-email-change", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: localProfile.email,
                    otp: otpValue
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Verification failed")
            }

            // Success! Update profile
            setUserProfile(localProfile)
            setIsOtpDialogOpen(false)
            setSaved(true)
            toast.success("Email verified and settings updated")
            setTimeout(() => setSaved(false), 2000)
        } catch (error: any) {
            toast.error("Verification failed", { description: error.message })
        } finally {
            setIsVerifyingOtp(false)
            setOtpValue("")
        }
    }

    const handleDeleteAccount = () => {
        if (deleteConfirm.toLowerCase() === "delete") {
            resetData()
            setIsDeleteDialogOpen(false)
            toast.error("Account deleted successfully", {
                description: "All your data has been removed from this device."
            })
            // Redirect or refresh
            setTimeout(() => window.location.reload(), 1500)
        }
    }

    const addSkill = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && skillInput.trim()) {
            e.preventDefault()
            if (!localProfile.skills.includes(skillInput.trim())) {
                setLocalProfile({
                    ...localProfile,
                    skills: [...localProfile.skills, skillInput.trim()]
                })
            }
            setSkillInput("")
        }
    }

    const removeSkill = (skill: string) => {
        setLocalProfile({
            ...localProfile,
            skills: localProfile.skills.filter(s => s !== skill)
        })
    }

    const addInterest = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && interestInput.trim()) {
            e.preventDefault()
            if (!localProfile.interests.includes(interestInput.trim())) {
                setLocalProfile({
                    ...localProfile,
                    interests: [...localProfile.interests, interestInput.trim()]
                })
            }
            setInterestInput("")
        }
    }

    const removeInterest = (interest: string) => {
        setLocalProfile({
            ...localProfile,
            interests: localProfile.interests.filter(i => i !== interest)
        })
    }

    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setLocalProfile({ ...localProfile, avatar: reader.result as string })
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <div className="flex flex-col h-full px-6 py-8 w-[90%] mx-auto space-y-8 animate-in fade-in duration-500 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            <div className="space-y-0.5">
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>

            <Separator className="my-6" />

            <div className="space-y-12 pb-12">
                {/* Profile Section */}
                <div className="space-y-8">
                    <div className="space-y-1">
                        <h3 className="text-lg font-medium">Public Profile</h3>
                        <p className="text-sm text-muted-foreground">
                            This is how others will see you on the platform.
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <Avatar className="h-24 w-24 border-none shadow-none rounded-xl cursor-pointer hover:opacity-80 transition-opacity" onClick={handleAvatarClick}>
                            <AvatarImage src={localProfile.avatar} className="rounded-xl object-cover" />
                            <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-white rounded-xl">
                                {localProfile.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                            <Button variant="outline" size="sm" className="rounded-xl border-muted-foreground/20" onClick={handleAvatarClick}>Change Avatar</Button>
                            <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 2MB</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                value={localProfile.name}
                                onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
                                placeholder="shadcn"
                                className="bg-muted/10 border-none rounded-xl focus-visible:ring-blue-500/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                value={localProfile.email}
                                onChange={(e) => setLocalProfile({ ...localProfile, email: e.target.value })}
                                placeholder="m@example.com"
                                className="bg-muted/10 border-none rounded-xl focus-visible:ring-blue-500/20"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={localProfile.location}
                                onChange={(e) => setLocalProfile({ ...localProfile, location: e.target.value })}
                                placeholder="San Francisco, CA"
                                className="bg-muted/10 border-none rounded-xl focus-visible:ring-blue-500/20"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                            id="bio"
                            value={localProfile.bio}
                            onChange={(e) => setLocalProfile({ ...localProfile, bio: e.target.value })}
                            className="flex min-h-[100px] w-full rounded-xl border-none bg-muted/10 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Tell us a little bit about yourself"
                        />
                    </div>

                    <Separator className="my-8" />

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Education</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="university">University</Label>
                                <Input
                                    id="university"
                                    value={localProfile.education?.university || ""}
                                    onChange={(e) => setLocalProfile({
                                        ...localProfile,
                                        education: { ...(localProfile.education || {}), university: e.target.value }
                                    })}
                                    placeholder="University of Technology"
                                    className="bg-muted/10 border-none rounded-xl focus-visible:ring-blue-500/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="degree">Degree</Label>
                                <Input
                                    id="degree"
                                    value={localProfile.education?.degree || ""}
                                    onChange={(e) => setLocalProfile({
                                        ...localProfile,
                                        education: { ...(localProfile.education || {}), degree: e.target.value }
                                    })}
                                    placeholder="BS in Computer Science"
                                    className="bg-muted/10 border-none rounded-xl focus-visible:ring-blue-500/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="years">Years</Label>
                                <Input
                                    id="years"
                                    value={localProfile.education?.years || ""}
                                    onChange={(e) => setLocalProfile({
                                        ...localProfile,
                                        education: { ...(localProfile.education || {}), years: e.target.value }
                                    })}
                                    placeholder="2022 - 2026"
                                    className="bg-muted/10 border-none rounded-xl focus-visible:ring-blue-500/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gpa">GPA</Label>
                                <Input
                                    id="gpa"
                                    value={localProfile.education?.gpa || ""}
                                    onChange={(e) => setLocalProfile({
                                        ...localProfile,
                                        education: { ...(localProfile.education || {}), gpa: e.target.value }
                                    })}
                                    placeholder="9.0/10.0"
                                    className="bg-muted/10 border-none rounded-xl focus-visible:ring-blue-500/20"
                                />
                            </div>
                        </div>
                    </div>

                    <Separator className="my-8" />

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Skills & Interests</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label htmlFor="skills">Skills (Press Enter to add)</Label>
                                <Input
                                    id="skills"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyDown={addSkill}
                                    placeholder="Add a skill..."
                                    className="bg-muted/10 border-none rounded-xl focus-visible:ring-blue-500/20"
                                />
                                <div className="flex flex-wrap gap-2">
                                    {localProfile.skills.map(skill => (
                                        <Badge key={skill} variant="secondary" className="rounded-full pl-3 pr-1 py-1 flex items-center gap-1 bg-blue-500/10 text-blue-600 border-none">
                                            {skill}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-4 rounded-full hover:bg-blue-500/20 p-0"
                                                onClick={() => removeSkill(skill)}
                                            >
                                                <X className="size-3" />
                                            </Button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="interests">Interests (Press Enter to add)</Label>
                                <Input
                                    id="interests"
                                    value={interestInput}
                                    onChange={(e) => setInterestInput(e.target.value)}
                                    onKeyDown={addInterest}
                                    placeholder="Add an interest..."
                                    className="bg-muted/10 border-none rounded-xl focus-visible:ring-blue-500/20"
                                />
                                <div className="flex flex-wrap gap-2">
                                    {localProfile.interests.map(interest => (
                                        <Badge key={interest} variant="outline" className="rounded-full pl-3 pr-1 py-1 flex items-center gap-1 border-border/50">
                                            {interest}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-4 rounded-full hover:bg-muted p-0"
                                                onClick={() => removeInterest(interest)}
                                            >
                                                <X className="size-3" />
                                            </Button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-8" />

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Social Links</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="linkedin">LinkedIn URL</Label>
                                <Input
                                    id="linkedin"
                                    value={localProfile.socials.linkedin}
                                    onChange={(e) => setLocalProfile({
                                        ...localProfile,
                                        socials: { ...localProfile.socials, linkedin: e.target.value }
                                    })}
                                    placeholder="https://linkedin.com/in/..."
                                    className="bg-muted/10 border-none rounded-xl focus-visible:ring-blue-500/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="github">GitHub URL</Label>
                                <Input
                                    id="github"
                                    value={localProfile.socials.github}
                                    onChange={(e) => setLocalProfile({
                                        ...localProfile,
                                        socials: { ...localProfile.socials, github: e.target.value }
                                    })}
                                    placeholder="https://github.com/..."
                                    className="bg-muted/10 border-none rounded-xl focus-visible:ring-blue-500/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="twitter">Twitter URL</Label>
                                <Input
                                    id="twitter"
                                    value={localProfile.socials.twitter}
                                    onChange={(e) => setLocalProfile({
                                        ...localProfile,
                                        socials: { ...localProfile.socials, twitter: e.target.value }
                                    })}
                                    placeholder="https://twitter.com/..."
                                    className="bg-muted/10 border-none rounded-xl focus-visible:ring-blue-500/20"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="my-12" />

                {/* Appearance Section */}
                <div className="space-y-8">
                    <div className="space-y-1">
                        <h3 className="text-lg font-medium">Appearance</h3>
                        <p className="text-sm text-muted-foreground">
                            Customize the look and feel of the dashboard.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Label>Theme</Label>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="space-y-2 cursor-pointer group" onClick={() => setTheme("light")}>
                                <div className={`aspect-square rounded-xl border-2 p-4 shadow-none transition-all group-hover:border-blue-400 flex flex-col justify-between ${theme === "light" ? "border-blue-600 bg-white" : "border-transparent bg-muted/20"}`}>
                                    <div className="space-y-2">
                                        <div className="h-2 w-full rounded-full bg-slate-200" />
                                        <div className="h-2 w-2/3 rounded-full bg-slate-200" />
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="h-6 w-6 rounded-full bg-blue-600" />
                                        <div className="h-6 w-6 rounded-full bg-slate-200" />
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-center block mt-2">Light</span>
                            </div>
                            <div className="space-y-2 cursor-pointer group" onClick={() => setTheme("dark")}>
                                <div className={`aspect-square rounded-xl border-2 p-4 shadow-none transition-all group-hover:border-blue-400 flex flex-col justify-between ${theme === "dark" ? "border-blue-600 bg-slate-950" : "border-transparent bg-muted/20"}`}>
                                    <div className="space-y-2">
                                        <div className="h-2 w-full rounded-full bg-slate-800" />
                                        <div className="h-2 w-2/3 rounded-full bg-slate-800" />
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="h-6 w-6 rounded-full bg-blue-600" />
                                        <div className="h-6 w-6 rounded-full bg-slate-800" />
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-center block mt-2">Dark</span>
                            </div>
                            <div className="space-y-2 cursor-pointer group" onClick={() => setTheme("system")}>
                                <div className={`aspect-square rounded-xl border-2 p-4 shadow-none transition-all group-hover:border-blue-400 flex flex-col justify-between ${theme === "system" ? "border-blue-600 bg-slate-100" : "border-transparent bg-muted/20"}`}>
                                    <div className="space-y-2">
                                        <div className="h-2 w-full rounded-full bg-slate-300" />
                                        <div className="h-2 w-2/3 rounded-full bg-slate-300" />
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="h-6 w-6 rounded-full bg-blue-600" />
                                        <div className="h-4 w-4 rounded-full bg-slate-300" />
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-center block mt-2">System</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="my-12" />

                {/* Notifications Section */}
                <div className="space-y-8">
                    <div className="space-y-1">
                        <h3 className="text-lg font-medium">Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                            Configure how you receive alerts and updates.
                        </p>
                    </div>

                    <div className="space-y-2">
                        {[
                            { title: "Email Notifications", desc: "Receive updates via email." },
                            { title: "Push Notifications", desc: "Receive alerts on your device." },
                            { title: "Marketing Emails", desc: "Receive news about new features." },
                            { title: "Security Alerts", desc: "Get notified about suspicious activity." },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between py-4 border-b border-muted/20 last:border-0">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-medium">{item.title}</Label>
                                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                                </div>
                                <Switch defaultChecked={i !== 2} className="rounded-xl" />
                            </div>
                        ))}
                    </div>
                </div>

                <Separator className="my-12" />

                {/* Account Section */}
                <div className="space-y-8">
                    <div className="space-y-1">
                        <h3 className="text-lg font-medium">Account Settings</h3>
                        <p className="text-sm text-muted-foreground">
                            Manage your account security, language, and data.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Language</Label>
                                <Select defaultValue="en">
                                    <SelectTrigger className="rounded-xl border-none bg-muted/10 focus:ring-blue-500/20">
                                        <SelectValue placeholder="Select Language" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-muted/20">
                                        <SelectItem value="en">English (US)</SelectItem>
                                        <SelectItem value="es">Spanish</SelectItem>
                                        <SelectItem value="fr">French</SelectItem>
                                        <SelectItem value="de">German</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-between py-4 border-b border-muted/20">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Two-Factor Authentication</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Secure your account with an extra layer.
                                    </p>
                                </div>
                                <Switch className="rounded-xl" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-4 border-b border-muted/20">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Public Profile Visibility</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Allow others to find your profile.
                                    </p>
                                </div>
                                <Switch defaultChecked className="rounded-xl" />
                            </div>
                            <div className="flex items-center justify-between py-4 border-b border-muted/20">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Personalized Content</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Recommendations based on activity.
                                    </p>
                                </div>
                                <Switch defaultChecked className="rounded-xl" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 space-y-4">
                        <div className="space-y-1">
                            <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
                            <p className="text-sm text-muted-foreground">
                                Irreversible actions for your account.
                            </p>
                        </div>

                        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="destructive" className="rounded-md shadow-none border-none">Delete Account</Button>
                            </DialogTrigger>
                            <DialogContent className="rounded-2xl border-none shadow-2xl">
                                <DialogHeader>
                                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                                    <DialogDescription>
                                        This action cannot be undone. This will permanently delete your account
                                        and remove your data from our servers.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm-delete">Type <span className="font-bold text-destructive">delete</span> to confirm</Label>
                                        <Input
                                            id="confirm-delete"
                                            value={deleteConfirm}
                                            onChange={(e) => setDeleteConfirm(e.target.value)}
                                            placeholder="delete"
                                            className="bg-muted/10 border-none rounded-xl focus-visible:ring-destructive/20"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="rounded-md">Cancel</Button>
                                    <Button
                                        variant="destructive"
                                        disabled={deleteConfirm.toLowerCase() !== "delete"}
                                        onClick={handleDeleteAccount}
                                        className="rounded-md shadow-none"
                                    >
                                        Delete Forever
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* OTP Verification Dialog */}
                <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
                    <DialogContent className="rounded-2xl border-none shadow-2xl sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Verify your new email</DialogTitle>
                            <DialogDescription>
                                We've sent a 6-digit code to <span className="font-medium text-foreground">{localProfile.email}</span>.
                                Please enter it below to confirm the change.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center justify-center py-6 space-y-4">
                            <InputOTP
                                maxLength={6}
                                value={otpValue}
                                onChange={setOtpValue}
                                containerClassName="gap-2"
                            >
                                <InputOTPGroup className="gap-2">
                                    <InputOTPSlot index={0} className="rounded-md border h-12 w-10" />
                                    <InputOTPSlot index={1} className="rounded-md border h-12 w-10" />
                                    <InputOTPSlot index={2} className="rounded-md border h-12 w-10" />
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup className="gap-2">
                                    <InputOTPSlot index={3} className="rounded-md border h-12 w-10" />
                                    <InputOTPSlot index={4} className="rounded-md border h-12 w-10" />
                                    <InputOTPSlot index={5} className="rounded-md border h-12 w-10" />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setIsOtpDialogOpen(false)} className="rounded-md">Cancel</Button>
                            <Button
                                onClick={handleVerifyOtp}
                                disabled={isVerifyingOtp || otpValue.length !== 6}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-none"
                            >
                                {isVerifyingOtp ? "Verifying..." : "Confirm Change"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Global Save Button */}
                <div className="flex justify-end pt-8 border-t border-muted/20">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-6 py-2 transition-all active:scale-95 shadow-none"
                    >
                        {isSaving ? (
                            <>
                                Saving...
                                <Spinner className="ml-2 h-4 w-4" />
                            </>
                        ) : saved ? (
                            <>
                                <Check className="mr-2 h-4 w-4" />
                                Saved
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
