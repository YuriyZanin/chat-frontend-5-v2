import { apiFetch } from './fetcher';

// ============ 1. START - начало авторизации ============
export type PlusofonStartPayload = {
  phone_number: string;
};

export type PlusofonStartResponse = {
  session_uid: string;
  session_secret: string;
  call_number: string;
  expires_at: string;
  poll_interval_seconds: number;
  attempt_number: number;
  block_duration_seconds: number | null;
  block_created_at: string | null;
};

/**
 * Старт авторизации через Plusofon Reverse Flash Call
 * @returns Данные сессии и номер для звонка
 */
export const plusofonStart = (data: PlusofonStartPayload): Promise<PlusofonStartResponse> => {
  return apiFetch<PlusofonStartResponse>('/api/v1/auth/providers/plusofon/flash-call/start/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// ============ 2. STATUS - проверка статуса сессии ============
export type PlusofonStatusResponse = {
  session_uid: string;
  status: 'pending' | 'verified' | 'expired' | 'failed';
  attempt_number: number;
  expires_at: string;
  verified_at?: string;
};

/**
 * Проверка статуса auth-сессии Plusofon
 * @param sessionUid - ID сессии из plusofonStart
 */
export const plusofonStatus = (sessionUid: string): Promise<PlusofonStatusResponse> => {
  return apiFetch<PlusofonStatusResponse>(`/api/v1/auth/providers/plusofon/flash-call/status/${sessionUid}/`, {
    method: 'GET',
  });
};

// ============ 3. CLAIM - получение JWT токенов ============
export type PlusofonClaimPayload = {
  // В Swagger не указано тело, возможно только session_uid в URL
  // Но некоторые API требуют session_secret для подтверждения
  session_secret?: string;
};

export type PlusofonClaimResponse = {
  access: string;
  refresh: string;
  is_filled?: boolean; // Аналог is_filled из старой авторизации
};

/**
 * Получение пары JWT токенов после успешной верификации
 * @param sessionUid - ID сессии из plusofonStart
 * @param secret - опционально, session_secret из plusofonStart
 */
export const plusofonClaim = (sessionUid: string, secret?: string): Promise<PlusofonClaimResponse> => {
  const body = secret ? { session_secret: secret } : undefined;

  return apiFetch<PlusofonClaimResponse>(`/api/v1/auth/providers/plusofon/flash-call/claim/${sessionUid}/`, {
    method: 'POST',
    ...(body && { body: JSON.stringify(body) }),
  });
};

// ============ 4. HELPER - удобная функция для полного цикла ============
export type PlusofonAuthResult = {
  success: boolean;
  tokens?: PlusofonClaimResponse;
  sessionUid?: string;
  error?: string;
  status?: PlusofonStatusResponse['status'];
};

/**
 * Полный цикл авторизации через Plusofon с polling
 * @param phoneNumber - номер телефона
 * @param onStatusChange - колбэк при изменении статуса (для UI)
 * @param maxAttempts - максимальное количество попыток polling (по умолчанию 30)
 * @returns Результат авторизации с токенами или ошибкой
 */
export const plusofonFullAuth = async (
  phoneNumber: string,
  onStatusChange?: (status: PlusofonStatusResponse) => void,
  maxAttempts: number = 30,
): Promise<PlusofonAuthResult> => {
  try {
    // 1. Стартуем сессию
    const startData = await plusofonStart({ phone_number: phoneNumber });
    const { session_uid, poll_interval_seconds } = startData;

    // 2. Polling статуса
    let attempts = 0;
    let statusData: PlusofonStatusResponse;

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, poll_interval_seconds * 1000));

      statusData = await plusofonStatus(session_uid);
      onStatusChange?.(statusData);

      if (statusData.status === 'verified') {
        // 3. Получаем токены
        const tokens = await plusofonClaim(session_uid);
        return {
          success: true,
          tokens,
          sessionUid: session_uid,
        };
      }

      if (statusData.status === 'expired' || statusData.status === 'failed') {
        return {
          success: false,
          sessionUid: session_uid,
          error: `Сессия ${statusData.status}`,
          status: statusData.status,
        };
      }

      attempts++;
    }

    return {
      success: false,
      sessionUid: session_uid,
      error: 'Превышено время ожидания подтверждения',
      status: 'expired',
    };
  } catch (error) {
    console.error('Plusofon auth error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка',
    };
  }
};

// ============ 5. Старые типы (если нужны для обратной совместимости) ============
// Можно оставить для других методов авторизации
export type GetCodePayload = {
  phone_number: string;
};

export type GetCodeResponse = {
  phone_number: string;
  code_len: number;
};

export const getAuthCode = (data: GetCodePayload): Promise<GetCodeResponse> => {
  return apiFetch<GetCodeResponse>('/api/auth/get-code', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export type GetTokenPayload = {
  phone_number: string;
  code: string;
};

export type GetTokenResponse = {
  is_filled: boolean;
};

export const getAuthToken = (data: GetTokenPayload): Promise<GetTokenResponse> => {
  return apiFetch<GetTokenResponse>('/api/auth/get-token', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
