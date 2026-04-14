// app/api/auth/access-token/route.ts
import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function GET() {
    try {
        const { token } = await auth0.getAccessToken();
        return NextResponse.json({ token });
    } catch {
        return NextResponse.json({ token: null }, { status: 401 });
    }
}