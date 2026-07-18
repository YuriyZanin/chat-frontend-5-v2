import { useMutation, UseMutationResult } from '@tanstack/react-query';
import {
  // Старые функции
  getAuthCode,
  getAuthToken,
  GetCodePayload,
  GetCodeResponse,
  GetTokenPayload,
  GetTokenResponse,
  plusofonFullAuth,
  plusofonGetToken,
  // Новые функции для Plusofon
  plusofonStart,
  PlusofonStartPayload,
  PlusofonStartResponse,
  plusofonStatus,
  PlusofonStatusPayload,
  PlusofonStatusResponse,
  PlusofonTokenPayload,
  PlusofonTokenResponse,
} from 'shared/api/auth.api';

// Тип для результата полной авторизации
type PlusofonFullAuthResult = {
  success: boolean;
  is_filled?: boolean;
  error?: string;
};

// Тип для параметров полной авторизации
type PlusofonFullAuthParams = {
  phoneNumber: string;
  onStatusChange?: (status: PlusofonStatusResponse) => void;
};

// Тип для мутации полной авторизации
type UsePlusofonFullAuthMutation = UseMutationResult<PlusofonFullAuthResult, unknown, PlusofonFullAuthParams, unknown>;

// ============ СТАРЫЕ ХУКИ (для обратной совместимости) ============
export const useGetAuthCode = (): UseMutationResult<GetCodeResponse, unknown, GetCodePayload, unknown> => {
  return useMutation({
    mutationFn: getAuthCode,
  });
};

export const useGetAuthToken = (): UseMutationResult<GetTokenResponse, unknown, GetTokenPayload, unknown> => {
  return useMutation({
    mutationFn: getAuthToken,
  });
};

// ============ НОВЫЕ ХУКИ ДЛЯ PLUSOFON ============

// Хук для старта сессии Plusofon
export const usePlusofonStart = (): UseMutationResult<
  PlusofonStartResponse,
  unknown,
  PlusofonStartPayload,
  unknown
> => {
  return useMutation({
    mutationFn: plusofonStart,
  });
};

// Хук для проверки статуса Plusofon
export const usePlusofonStatus = (): UseMutationResult<
  PlusofonStatusResponse,
  unknown,
  PlusofonStatusPayload,
  unknown
> => {
  return useMutation({
    mutationFn: plusofonStatus,
  });
};

// Хук для получения токена Plusofon
export const usePlusofonGetToken = (): UseMutationResult<
  PlusofonTokenResponse,
  unknown,
  PlusofonTokenPayload,
  unknown
> => {
  return useMutation({
    mutationFn: plusofonGetToken,
  });
};

// Хук для полного цикла авторизации Plusofon (с polling)
export const usePlusofonFullAuth = (): UsePlusofonFullAuthMutation => {
  return useMutation({
    mutationFn: ({ phoneNumber, onStatusChange }: PlusofonFullAuthParams) =>
      plusofonFullAuth(phoneNumber, onStatusChange),
  });
};
