import { NextRequest } from 'next/server';
import { route } from 'shared/api/session';

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }): Promise<Response> {
  const resolvedParams = await params;
  return route(req, resolvedParams.path);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }): Promise<Response> {
  const resolvedParams = await params;
  return route(req, resolvedParams.path);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }): Promise<Response> {
  const resolvedParams = await params;
  return route(req, resolvedParams.path);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }): Promise<Response> {
  const resolvedParams = await params;
  return route(req, resolvedParams.path);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }): Promise<Response> {
  const resolvedParams = await params;
  return route(req, resolvedParams.path);
}
