// src/app/api/auth/get-plusofon-token/route.ts
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL!;

export async function POST(req: Request): Promise<Response> {
  try {
    const { access, refresh, is_filled } = await req.json();
    // Формируем ответ (так же как в get-token)
    const response = NextResponse.json({ is_filled });
    // Устанавливаем cookies (такие же как ws_refresh_token) только для домена приложения (Localhost:3000)
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
  } catch (error) {
    console.error('Plusofon claim error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
