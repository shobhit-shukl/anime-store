import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/auth";

export default async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // 1. Define protected routes (Admin Dashboard & Sensitive APIs)
    const isAdminRoute = path.startsWith("/admin");
    const isProtectedApi = (path.startsWith("/api/movie") || path.startsWith("/api/webseries")) && request.method !== "GET";

    // 2. Check for token
    const token = request.cookies.get("admin_token")?.value;
    let user = null;

    if (token) {
        user = await verifyJWT(token);
    }

    // 3. Logic for Protected Routes
    if (isAdminRoute || isProtectedApi) {
        if (!user || user.role !== "admin") {
            // API request? Return JSON error
            if (path.startsWith("/api")) {
                return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
            }
            // Page request? Redirect to login
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // 4. Redirect Admin away from login if already logged in
    const isLoginRoute = path === "/login";
    if (isLoginRoute && user?.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public (public folder)
         */
        "/((?!_next/static|_next/image|favicon.ico|public).*)",
    ],
};
