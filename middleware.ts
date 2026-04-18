import { auth0 } from "@/lib/auth0";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const authRes = await auth0.middleware(req);

  // If the user is accessing a protected route and is not authenticated,
  // auth0.middleware will redirect them to /auth/login automatically.
  const { pathname } = req.nextUrl;
  const isProtected = pathname.startsWith("/app)") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/generate") ||
    pathname.startsWith("/courses") ||
    pathname.startsWith("/profile");

  return authRes;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
