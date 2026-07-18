import { NextResponse } from 'next/server';

export async function POST(): Promise<Response> {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('access');
  response.cookies.delete('refresh');
  return response;
}
