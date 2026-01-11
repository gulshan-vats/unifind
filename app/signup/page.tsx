"use client"

import * as React from "react"
import { Command } from "lucide-react"
import { SignupForm } from "@/components/signup-form"

const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
  "https://images.unsplash.com/photo-1614850523296-d8c1af93d400",
  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e",
  "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4",
  "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead",
]

export default function SignupPage() {
  const [bgImage, setBgImage] = React.useState("")

  React.useEffect(() => {
    const randomImage = BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)]
    setBgImage(`${randomImage}?auto=format&fit=crop&q=80&w=1920`)
  }, [])

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <img src="/logo.png" alt="Unifind Logo" className="size-6 rounded-md" />
            Unifind
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block overflow-hidden">
        {bgImage && (
          <>
            <img
              src={bgImage}
              alt="Authentication Background"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.7] animate-in fade-in duration-1000"
            />
            {/* Creative Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          </>
        )}
      </div>
    </div>
  )
}
