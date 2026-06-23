// wsAuth.api.ts
import { PlusofonTokenResponse } from '../auth.api';
import { apiFetch } from '../fetcher';
let refreshPromise: Promise<void> | null = null;

export const refreshWsSession = async (refreshUrl: string): Promise<void> => {
  if (refreshPromise) {
    return refreshPromise; // ждём уже запущенный refresh
  }

  refreshPromise = (async (): Promise<void> => {
    const res = await fetch(refreshUrl, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      console.error('WS refresh error:', errorData);
      throw new Error('WS refresh failed');
    }
    console.log('WS refresh success');
    // получаем ws_access_token и ws_refresh_token для домена api.dev.chat.ktsf.ru и записываем в cookies
    const tokens = await res.json();
    // отправляем полученные токены на прокси сервер Next.js
    const response = apiFetch<PlusofonTokenResponse>('/api/auth/get-plusofon-token', {
      method: 'POST',
      body: JSON.stringify({ ...tokens, is_filled: true }),
    });
  })();

  try {
    await refreshPromise;
  } finally {
    refreshPromise = null;
  }
};
