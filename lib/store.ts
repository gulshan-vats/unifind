// Global in-memory store for OTPs
// In a real production app with multiple instances, use Redis instead.

declare global {
    var otpStore: Map<string, { code: string; expires: number; data: any }> | undefined
}

export const otpStore = globalThis.otpStore ?? new Map<string, { code: string; expires: number; data: any }>()

if (process.env.NODE_ENV !== "production") {
    globalThis.otpStore = otpStore
}
