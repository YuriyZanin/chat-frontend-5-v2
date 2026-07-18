import { NextResponse } from 'next/server';
import { Tokens } from './session.types';

const COOKIE_CONFIG = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
} as const;
const ACCESS_TOKEN_MAX_AGE = 20 * 60;
const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60;

/**
 * Устанавливает auth cookies в ответ
 */
export const setAuthCookies = (response: NextResponse, tokens: Tokens): NextResponse => {
  response.cookies.set({
    name: 'access',
    value: tokens.access,
    ...COOKIE_CONFIG,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  response.cookies.set({
    name: 'refresh',
    value: tokens.refresh,
    ...COOKIE_CONFIG,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
  return response;
};

/**
 * Удаляет auth cookies
 */
export const clearAuthCookies = (response: NextResponse): NextResponse => {
  response.cookies.delete('access');
  response.cookies.delete('refresh');
  return response;
};
