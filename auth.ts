import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { otpStore } from "@/lib/store"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Credentials({
            name: "OTP",
            credentials: {
                email: { label: "Email", type: "email" },
                otp: { label: "OTP", type: "text" },
            },
            async authorize(credentials) {
                const email = credentials.email as string
                const otp = credentials.otp as string

                if (!email || !otp) return null

                const storedOtp = otpStore.get(email)

                if (!storedOtp) {
                    throw new Error("OTP not found or expired")
                }

                if (Date.now() > storedOtp.expires) {
                    otpStore.delete(email)
                    throw new Error("OTP expired")
                }

                if (storedOtp.code !== otp) {
                    throw new Error("Invalid OTP")
                }

                // OTP is valid
                const user = {
                    id: email,
                    email: email,
                    name: storedOtp.data.name || email.split("@")[0],
                    image: null,
                }

                // Clear OTP after successful use
                otpStore.delete(email)

                return user
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub!
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id
            }
            return token
        },
    },
})
