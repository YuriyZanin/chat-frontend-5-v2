const BACKEND_URL = process.env.BACKEND_API_URL!;

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    console.log('[start-plusofon-call] Received body:', body);

    // Валидация phone_number
    if (!body.phone_number) {
      console.log('[start-plusofon-call] Missing phone_number');
      return Response.json({ error: 'phone_number is required' }, { status: 400 });
    }

    console.log(
      '[start-plusofon-call] Sending to backend:',
      `${BACKEND_URL}/api/v1/auth/providers/plusofon/flash-call/start/`,
    );
    console.log('[start-plusofon-call] Request body:', JSON.stringify(body));

    const res = await fetch(`${BACKEND_URL}/api/v1/auth/providers/plusofon/flash-call/start/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('[start-plusofon-call] Backend response status:', res.status);
    console.log('[start-plusofon-call] Backend response statusText:', res.statusText);

    const data = await res.json();

    console.log('[start-plusofon-call] Backend response data:', data);

    // 201 - успешное создание сессии
    if (res.status === 201) {
      console.log('[start-plusofon-call] Session created successfully');
      return Response.json(
        {
          verification_id: data.verification_id,
          verification_secret: data.verification_secret,
          call_number: data.call_number,
          expires_at: data.expires_at,
          poll_interval_seconds: data.poll_interval_seconds,
          attempt_number: data.attempt_number,
          block_duration_seconds: data.block_duration_seconds,
          block_created_at: data.block_created_at,
          session_uid: data.session_uid,
        },
        { status: 201 },
      );
    }

    // 400 - ошибка валидации
    if (res.status === 400) {
      console.log('[start-plusofon-call] Validation error');
      return Response.json(
        { error: data.phone_number?.[0] || data.message || 'Неверный формат номера телефона' },
        { status: 400 },
      );
    }

    // 403 - Plusofon отключен
    if (res.status === 403) {
      console.log('[start-plusofon-call] Plusofon disabled');
      return Response.json({ error: data.message || 'Авторизация через Plusofon отключена' }, { status: 403 });
    }

    // 409 - уже есть активная сессия
    if (res.status === 409) {
      console.log('[start-plusofon-call] Active session exists');
      return Response.json({ error: data.message || 'Сессия авторизации уже активна' }, { status: 409 });
    }

    // 429 - номер заблокирован
    if (res.status === 429) {
      console.log('[start-plusofon-call] Phone blocked');
      return Response.json(
        {
          error: data.message || 'Слишком много попыток',
          blocked_until: data.blocked_until,
          attempt_number: data.attempt_number,
          block_duration_seconds: data.block_duration_seconds,
        },
        { status: 429 },
      );
    }

    // 503 - провайдер недоступен
    if (res.status === 503) {
      console.log('[start-plusofon-call] Provider unavailable');
      return Response.json({ error: data.message || 'Провайдер временно недоступен' }, { status: 503 });
    }

    // Любой другой статус
    console.log('[start-plusofon-call] Unknown error status:', res.status);
    return Response.json({ error: data.message || 'Unknown error' }, { status: res.status });
  } catch (error) {
    console.error('[start-plusofon-call] Fatal error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
