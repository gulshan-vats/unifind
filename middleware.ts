import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { nextUrl } = req

    const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard")
    const isAuthRoute = nextUrl.pathname === "/login" || nextUrl.pathname === "/signup"
    const isRootRoute = nextUrl.pathname === "/"

    if (isRootRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL("/dashboard", nextUrl))
        }
        return NextResponse.redirect(new URL("/login", nextUrl))
    }

    if (isDashboardRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", nextUrl))
    }

    if (isAuthRoute && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }

    return NextResponse.next()
})

export const config = {
    matcher: ["/", "/dashboard/:path*", "/login", "/signup"],
}
