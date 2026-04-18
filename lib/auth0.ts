import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { NextResponse } from "next/server";

export const auth0 = new Auth0Client({
  authorizationParameters: {
    scope: process.env.AUTH0_SCOPE,
    audience: process.env.AUTH0_AUDIENCE,
  },

  async onCallback(error, context, session) {
    const baseUrl = process.env.APP_BASE_URL || process.env.AUTH0_BASE_URL || "http://localhost:3000";

    if (error) {
      return NextResponse.redirect(new URL(`/?auth_error=${error.message}`, baseUrl));
    }

    if (session?.tokenSet?.accessToken) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/callback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: session.tokenSet.accessToken }),
        });
      } catch (err) {
        console.error("[Raphael] DB user sync failed:", err);
      }
    }

    // CRITICAL FIX: Explicitly redirect the user to the returnTo path
    const returnTo = context.returnTo || "/dashboard";
    return NextResponse.redirect(new URL(returnTo, baseUrl));
  },
});