"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Command } from "lucide-react"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function OTPForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter()
  const [otp, setOtp] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const signupData = sessionStorage.getItem("signupData")
      if (!signupData) {
        setError("Session expired. Please sign up again.")
        toast.error("Session expired", {
          description: "Please return to signup and try again."
        })
        return
      }

      const { email } = JSON.parse(signupData)

      const result = await signIn("credentials", {
        email,
        otp,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
        toast.error("Verification failed", {
          description: result.error
        })
      } else {
        sessionStorage.removeItem("signupData")
        toast.success("Email verified!", {
          description: "You have been logged in successfully."
        })
        router.push("/dashboard")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
      toast.error("Something went wrong", {
        description: "Please try again or request a new code."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    const signupData = sessionStorage.getItem("signupData")
    if (!signupData) {
      toast.error("Session expired", {
        description: "Please return to signup and try again."
      })
      return
    }

    const formData = JSON.parse(signupData)

    toast.promise(
      fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }),
      {
        loading: "Sending new code...",
        success: "New code sent!",
        error: "Failed to send code",
      }
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Command className="size-6" />
              </div>
              <span className="sr-only">Unifind</span>
            </a>
            <h1 className="text-xl font-bold">Enter verification code</h1>
            <FieldDescription>
              We sent a 6-digit code to your email address
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="otp" className="sr-only">
              Verification code
            </FieldLabel>
            <InputOTP
              maxLength={6}
              id="otp"
              required
              value={otp}
              onChange={setOtp}
              containerClassName="gap-4"
            >
              <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            {error && (
              <FieldDescription className="text-center text-destructive">
                {error}
              </FieldDescription>
            )}
            <FieldDescription className="text-center">
              Didn&apos;t receive the code?{" "}
              <button type="button" onClick={handleResend} className="underline hover:text-primary">
                Resend
              </button>
            </FieldDescription>
          </Field>
          <Field>
            <Button type="submit" disabled={isLoading || otp.length !== 6}>
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#" className="underline">Terms of Service</a>{" "}
        and <a href="#" className="underline">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
