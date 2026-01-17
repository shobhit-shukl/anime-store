import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow access to the home page and API routes
    if (
        pathname === '/' ||
        pathname.startsWith('/api/') ||
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/static/') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Redirect all other routes to the coming soon page
    return NextResponse.redirect(new URL('/', request.url));
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
