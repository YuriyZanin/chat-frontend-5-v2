// wsAuth.api.ts

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
  })();

  try {
    await refreshPromise;
  } finally {
    refreshPromise = null;
  }
};
