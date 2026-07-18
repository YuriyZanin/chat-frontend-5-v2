import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { clearAuthCookies, doRefresh, setAuthCookies } from 'shared/api/session';

export default async function proxy(req: NextRequest): Promise<NextResponse> {
  try {
    const path = req.nextUrl.pathname;
    const cookiesStore = await cookies();
    const accessToken = cookiesStore.get('access')?.value;
    const refreshToken = cookiesStore.get('refresh')?.value;

    if (path === '/auth' && accessToken) {
      return NextResponse.redirect(new URL('/contacts', req.url));
    }

    if (accessToken) {
      return NextResponse.next();
    }

    if (refreshToken) {
      try {
        const tokens = await doRefresh(refreshToken);

        const response =
          path === '/auth' ? NextResponse.redirect(new URL('/contacts', req.url)) : NextResponse.rewrite(req.url);

        setAuthCookies(response, tokens);

        return response;
      } catch (error: unknown) {
        if (error instanceof Error && error.message === 'REFRESH_TOKEN_INVALID') {
          const res = NextResponse.redirect(new URL('/auth', req.url));
          clearAuthCookies(res);
          return res;
        }

        console.error('Refresh error:', error);
        return NextResponse.next();
      }
    }

    if (path === '/auth' || path === '/support') {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/auth', req.url));
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|images/).*)'],
};
