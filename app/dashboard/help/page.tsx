"use client"

import * as React from "react"
import {
    MessageCircleQuestion,
    Mail,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Shield,
    Zap,
    Users
} from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const faqs = [
    {
        question: "What is Unifind?",
        answer: "Unifind is an AI-powered platform designed to help students find internships, hackathons, and educational resources tailored to their needs. Our goal is to simplify the search process and empower students to reach their full potential.",
        icon: Zap
    },
    {
        question: "How do I search for internships?",
        answer: "You can use the 'Internships' tab in the sidebar to browse available opportunities. You can filter by location, company, or role to find the perfect fit for you.",
        icon: Search
    },
    {
        question: "Can I save my favorite chats?",
        answer: "Yes! You can favorite any chat session by clicking the three dots menu next to the chat in the sidebar and selecting 'Favorite'. These will appear in your 'Favorites' section for easy access.",
        icon: Star
    },
    {
        question: "Is my data secure?",
        answer: "We take your privacy seriously. Your personal information and chat history are stored securely and are only accessible by you. We do not share your data with third parties without your explicit consent.",
        icon: Shield
    },
    {
        question: "How can I contribute to Unifind?",
        answer: "We're always looking for feedback and contributions! If you have suggestions or want to report a bug, please reach out to us via email.",
        icon: Users
    }
]

import { Search, Star } from "lucide-react"

export default function HelpPage() {
    const [openIndex, setOpenIndex] = React.useState<number | null>(0)

    return (
        <div className="flex flex-col h-full px-6 py-8 w-[90%] mx-auto space-y-8 animate-in fade-in duration-500 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            <div className="space-y-0.5">
                <h2 className="text-3xl font-bold tracking-tight">Help & Support</h2>
                <p className="text-muted-foreground">
                    Find answers to common questions and get in touch with our team.
                </p>
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* FAQ Section */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                        <MessageCircleQuestion className="size-5 text-blue-600" />
                        Frequently Asked Questions
                    </h3>
                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <Card key={index} className="border-none bg-muted/10 overflow-hidden transition-all hover:bg-muted/20">
                                <Collapsible
                                    open={openIndex === index}
                                    onOpenChange={() => setOpenIndex(openIndex === index ? null : index)}
                                >
                                    <CollapsibleTrigger asChild>
                                        <button className="flex items-center justify-between w-full p-4 text-left font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-background shadow-sm">
                                                    <faq.icon className="size-4 text-blue-600" />
                                                </div>
                                                {faq.question}
                                            </div>
                                            {openIndex === index ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                                        </button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <div className="px-4 pb-4 pt-0 text-sm text-muted-foreground leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Contact Section */}
                <div className="space-y-6">
                    <Card className="border-none bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="size-5" />
                                Connect With Us
                            </CardTitle>
                            <CardDescription className="text-blue-100">
                                Have a specific question or need technical assistance?
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                                <p className="text-xs uppercase tracking-wider font-bold text-blue-200 mb-1">Email Support</p>
                                <p className="text-lg font-medium">support@unifind.com</p>
                            </div>
                            <Button
                                className="w-full bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-semibold shadow-lg transition-all active:scale-95"
                                onClick={() => window.location.href = "mailto:support@unifind.com"}
                            >
                                Send an Email
                                <ExternalLink className="ml-2 size-4" />
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none bg-muted/10">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Community</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Join our community of students to share resources and find opportunities together.
                            <Button variant="link" className="p-0 h-auto text-blue-600 mt-2">Join Discord (Coming Soon)</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
