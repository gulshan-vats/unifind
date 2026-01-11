import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { otpStore } from "@/lib/store"

const resend = new Resend(process.env.RESEND_API_KEY)


export async function POST(request: NextRequest) {
    try {
        const { name, email, password } = await request.json()

        // Validate email
        if (!email || !email.includes("@")) {
            return NextResponse.json(
                { message: "Invalid email address" },
                { status: 400 }
            )
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        // Store OTP with 10-minute expiration
        otpStore.set(email, {
            code: otp,
            expires: Date.now() + 10 * 60 * 1000,
            data: { name, email, password },
        })

        console.log(`📧 Storing OTP for ${email}: ${otp}`)
        console.log(`📦 OTP Store now has ${otpStore.size} entries`)

        // Send email with Resend
        try {
            if (!process.env.RESEND_API_KEY) {
                console.error("RESEND_API_KEY is not configured")
                console.log(`\n🔐 OTP for ${email}: ${otp}\n`)

                return NextResponse.json({
                    message: "OTP sent successfully (check console in development)",
                    otp: process.env.NODE_ENV === "development" ? otp : undefined,
                })
            }

            console.log(`📤 Attempting to send email to ${email}...`)

            const result = await resend.emails.send({
                from: "Unifind <onboarding@resend.dev>",
                to: email,
                subject: "Your Unifind Verification Code",
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Welcome to Unifind!</h2>
            <p>Hi ${name},</p>
            <p>Thank you for signing up. Please use the following verification code to complete your registration:</p>
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
              <h1 style="color: #1f2937; margin: 0; font-size: 32px; letter-spacing: 8px;">${otp}</h1>
            </div>
            <p style="color: #6b7280;">This code will expire in 10 minutes.</p>
            <p style="color: #6b7280;">If you didn't request this code, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #9ca3af; font-size: 12px;">This is an automated message from Unifind. Please do not reply to this email.</p>
          </div>
        `,
            })

            console.log(`✅ Email sent successfully to ${email}`)
            console.log(`📧 Resend Email ID: ${result.data?.id}`)

            return NextResponse.json({
                message: "OTP sent successfully",
                emailId: result.data?.id
            })
        } catch (emailError: any) {
            console.error("❌ Failed to send email:", emailError)
            console.error("Error details:", {
                message: emailError.message,
                statusCode: emailError.statusCode,
                name: emailError.name
            })

            // Always log OTP in development for testing
            if (process.env.NODE_ENV === "development") {
                console.log(`\n🔐 FALLBACK - OTP for ${email}: ${otp}\n`)
                console.log(`⚠️ Email failed but OTP is stored. You can use the code above.`)
                return NextResponse.json({
                    message: "OTP generated (email failed, check console)",
                    otp,
                })
            }

            return NextResponse.json(
                {
                    message: "Failed to send verification email. Please try again.",
                    error: emailError.message
                },
                { status: 500 }
            )
        }
    } catch (error) {
        console.error("Send OTP error:", error)
        return NextResponse.json(
            { message: "Failed to send OTP" },
            { status: 500 }
        )
    }
}
