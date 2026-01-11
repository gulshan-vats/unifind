import { NextRequest, NextResponse } from "next/server"
import { otpStore } from "@/lib/store"

export async function POST(request: NextRequest) {
    try {
        const { email, otp } = await request.json()

        if (!email || !otp) {
            return NextResponse.json(
                { message: "Email and OTP are required" },
                { status: 400 }
            )
        }

        const storedOtp = otpStore.get(email)

        if (!storedOtp) {
            return NextResponse.json(
                { message: "OTP not found or expired" },
                { status: 400 }
            )
        }

        if (Date.now() > storedOtp.expires) {
            otpStore.delete(email)
            return NextResponse.json(
                { message: "OTP expired" },
                { status: 400 }
            )
        }

        if (storedOtp.code !== otp) {
            return NextResponse.json(
                { message: "Invalid OTP" },
                { status: 400 }
            )
        }

        // OTP is valid
        // Clear OTP after successful use
        otpStore.delete(email)

        return NextResponse.json({
            message: "Email verified successfully",
            success: true
        })
    } catch (error) {
        console.error("Verify OTP error:", error)
        return NextResponse.json(
            { message: "Failed to verify OTP" },
            { status: 500 }
        )
    }
}
