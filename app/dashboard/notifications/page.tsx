"use client"

import * as React from "react"
import {
    Bell,
    CheckCircle2,
    Info,
    AlertCircle,
    Briefcase,
    Trophy,
    Search,
    MoreHorizontal,
    Trash2,
    Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const NOTIFICATIONS = [
    {
        id: "1",
        title: "New Internship Match",
        description: "A new Software Engineering internship at Google matches your profile.",
        time: "2 hours ago",
        type: "match",
        icon: Briefcase,
        iconColor: "text-blue-500",
        bgColor: "bg-blue-500/10",
        isRead: false
    },
    {
        id: "2",
        title: "Hackathon Starting Soon",
        description: "The Global AI Hackathon starts in 24 hours. Don't forget to join your team!",
        time: "5 hours ago",
        type: "alert",
        icon: Trophy,
        iconColor: "text-amber-500",
        bgColor: "bg-amber-500/10",
        isRead: false
    },
    {
        id: "3",
        title: "Profile Viewed",
        description: "A recruiter from Microsoft viewed your public profile.",
        time: "1 day ago",
        type: "info",
        icon: Search,
        iconColor: "text-violet-500",
        bgColor: "bg-violet-500/10",
        isRead: true
    },
    {
        id: "4",
        title: "System Update",
        description: "Unifind has been updated with new AI features for better resource discovery.",
        time: "2 days ago",
        type: "system",
        icon: Info,
        iconColor: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        isRead: true
    }
]

export default function NotificationsPage() {
    const [notifications, setNotifications] = React.useState(NOTIFICATIONS)

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })))
    }

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id))
    }

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n))
    }

    return (
        <div className="flex flex-col w-full max-w-4xl mx-auto p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                    <p className="text-muted-foreground">Stay updated with your latest opportunities and activities.</p>
                </div>
                <Button variant="outline" size="sm" onClick={markAllAsRead} className="rounded-xl">
                    <Check className="mr-2 size-4" />
                    Mark all as read
                </Button>
            </div>

            <div className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <Card
                            key={notification.id}
                            className={`rounded-2xl border-border/50 transition-all hover:shadow-md ${!notification.isRead ? 'bg-muted/30 border-l-4 border-l-blue-500' : 'bg-background'}`}
                        >
                            <CardContent className="p-4 flex items-start gap-4">
                                <div className={`size-10 rounded-xl ${notification.bgColor} flex items-center justify-center shrink-0`}>
                                    <notification.icon className={`size-5 ${notification.iconColor}`} />
                                </div>

                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className={`font-semibold ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                                            {notification.title}
                                        </h4>
                                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {notification.description}
                                    </p>
                                    <div className="flex items-center gap-2 pt-2">
                                        {!notification.isRead && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                onClick={() => markAsRead(notification.id)}
                                            >
                                                Mark as read
                                            </Button>
                                        )}
                                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider py-0 h-5">
                                            {notification.type}
                                        </Badge>
                                    </div>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="size-8 rounded-full">
                                            <MoreHorizontal className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-xl">
                                        <DropdownMenuItem
                                            onClick={() => deleteNotification(notification.id)}
                                            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                        >
                                            <Trash2 className="mr-2 size-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="size-16 rounded-full bg-muted flex items-center justify-center">
                            <Bell className="size-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-semibold text-xl">All caught up!</h3>
                            <p className="text-muted-foreground">You don't have any new notifications at the moment.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
