import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL!;

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();

    const res = await fetch(`${BACKEND_URL}/api/v1/auth/messenger/login/get/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return new Response(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers: {
          'content-type': res.headers.get('content-type') || 'application/json',
        },
      });
    }

    const data = await res.json();
    const { access, refresh, is_filled } = data;

    const response = NextResponse.json({ is_filled });

    response.cookies.set('access', access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 20 * 60,
    });

    response.cookies.set('refresh', refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
