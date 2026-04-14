import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { NextResponse } from "next/server";

export const auth0 = new Auth0Client({
  authorizationParameters: {
    scope: process.env.AUTH0_SCOPE,
    audience: process.env.AUTH0_AUDIENCE,
  },

  async onCallback(error, context, session) {
    // Handle auth errors
    if (error) {
      return NextResponse.redirect(
        new URL(`/?auth_error=${error.message}`, process.env.AUTH0_BASE_URL!)
      );
    }

    // Sync user to your DB — runs server-side, non-blocking
    if (session?.tokenSet?.accessToken) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/callback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: session.tokenSet.accessToken }),
        });
      } catch (err) {
        console.error("[Raphael] DB user sync failed:", err);
        // Non-blocking — login still succeeds
      }
    }

    // Let Auth0 handle the final redirect automatically by doing a native NextResponse.next()
    return NextResponse.next();
  },
});