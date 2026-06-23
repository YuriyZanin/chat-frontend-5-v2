import { Tokens } from './session.types';

const BACKEND = process.env.BACKEND_API_URL!;
const AUTH_REFRESH_PATH = '/api/v1/auth/login/refresh/token/';
const REFRESH_CLEANUP_DELAY = 5000;

const activeRefreshes = new Map<string, Promise<Tokens>>();

/**
 * Извлекает user_id из JWT токена
 */
const getUserId = (token: string): string => {
  try {
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(Buffer.from(base64Payload, 'base64url').toString('utf-8'));
    return payload.user_id;
  } catch {
    throw new Error('INVALID_TOKEN_FORMAT');
  }
};

/**
 * Универсальный запрос на обновление токенов
 */
const refreshTokens = async (refreshToken: string): Promise<Tokens> => {
  const response = await fetch(`${BACKEND}${AUTH_REFRESH_PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refreshToken }),
    credentials: 'include',
  });

  if (response.status === 401) {
    throw new Error('REFRESH_TOKEN_INVALID');
  }

  if (!response.ok) {
    throw new Error(`REFRESH_FAILED: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

/**
 * Управляет конкурентным обновлением токенов
 */
export const doRefresh = async (refreshToken: string): Promise<Tokens> => {
  const userId = getUserId(refreshToken);

  if (!userId) {
    throw new Error('INVALID_TOKEN_FORMAT');
  }

  const existingRefresh = activeRefreshes.get(userId);
  if (existingRefresh) {
    return existingRefresh;
  }

  const refreshPromise = refreshTokens(refreshToken);

  activeRefreshes.set(userId, refreshPromise);

  refreshPromise
    .finally(() => {
      setTimeout(() => {
        activeRefreshes.delete(userId);
      }, REFRESH_CLEANUP_DELAY);
    })
    .catch(() => {
      activeRefreshes.delete(userId);
    });

  return refreshPromise;
};
