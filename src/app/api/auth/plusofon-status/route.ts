// src/app/api/auth/plusofon-status/route.ts
const BACKEND_URL = process.env.BACKEND_API_URL!;

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { verification_secret, verification_id } = body;

    // Валидация
    if (!verification_secret) {
      return Response.json({ error: 'verification_secret is required' }, { status: 400 });
    }
    if (!verification_id) {
      return Response.json({ error: 'session_uid  is required' }, { status: 400 });
    }
    // Запрос к бэкенду (POST с телом, содержащим session_secret)
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/providers/plusofon/flash-call/status/${verification_id}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ verification_secret }),
    });

    const data = await res.json();

    // 200 - успешный ответ
    if (res.status === 200) {
      return Response.json(
        {
          verification_id: data.verification_id,
          status: data.status, // "pending", "verified", "expired", "failed"
          expires_at: data.expires_at,
          verified_at: data.verified_at,
          consumed_at: data.consumed_at,
          poll_interval_seconds: data.poll_interval_seconds,
          is_claim_validable: data.is_claim_validable,
        },
        { status: 200 },
      );
    }

    // 403 - неверный session_secret
    if (res.status === 403) {
      return Response.json({ error: data.message || 'Секрет auth-сессии не прошел проверку' }, { status: 403 });
    }

    // 404 - сессия не найдена
    if (res.status === 404) {
      return Response.json({ error: data.message || 'Auth-сессия не найдена' }, { status: 404 });
    }

    // Любой другой статус
    return Response.json({ error: data.message || 'Unknown error' }, { status: res.status });
  } catch (error) {
    console.error('Plusofon status error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
