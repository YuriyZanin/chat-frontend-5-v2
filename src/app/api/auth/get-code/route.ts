const BACKEND_URL = process.env.BACKEND_API_URL!;

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();

    const res = await fetch(`${BACKEND_URL}/api/v1/auth/messenger/login/get/code/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return new Response(res.body, {
      status: res.status,
      headers: { 'content-type': '...' },
    });
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
