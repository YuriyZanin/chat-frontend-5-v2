import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { usePlusofonGetToken, usePlusofonStart, usePlusofonStatus } from 'shared/query/auth.query';

type UsePhoneStepPlusofonProps = {
  next: () => void;
  onPhoneConfirmed: (phone: string) => void;
};

type UsePhoneStepPlusofonReturn = {
  phoneValue: string;
  isButtonEnabled: boolean;
  isModalOpen: boolean;
  isCallModalOpen: boolean;
  isLoading: boolean;
  callNumber: string | null;
  statusMessage: string;
  error: string | null;
  handleValidationChange: (isValid: boolean, isFilled: boolean) => void;
  handlePhoneChange: (value: string) => void;
  handleNextClick: () => void;
  handleConfirmPhone: () => void;
  handleConfirmCall: () => void;
  handleCloseModal: () => void;
  handleCloseCallModal: () => void;
};

// Функция для извлечения сообщения об ошибке из unknown
const getErrorMessage = (err: unknown): string => {
  if (err && typeof err === 'object') {
    const errorObj = err as Record<string, unknown>;
    if (errorObj.data && typeof errorObj.data === 'object') {
      const data = errorObj.data as Record<string, unknown>;
      if (data.error && typeof data.error === 'string') {
        return data.error;
      }
    }
    if (errorObj.message && typeof errorObj.message === 'string') {
      return errorObj.message;
    }
    if (errorObj.response && typeof errorObj.response === 'object') {
      const response = errorObj.response as Record<string, unknown>;
      if (response.status === 409) {
        return 'CONFLICT';
      }
    }
  }
  return 'Неизвестная ошибка';
};

// Функция для проверки конфликта (409)
const isConflictError = (err: unknown): boolean => {
  if (err && typeof err === 'object') {
    const errorObj = err as Record<string, unknown>;
    if (errorObj.response && typeof errorObj.response === 'object') {
      const response = errorObj.response as Record<string, unknown>;
      if (response.status === 409) {
        return true;
      }
    }
    if (errorObj.data && typeof errorObj.data === 'object') {
      const data = errorObj.data as Record<string, unknown>;
      if (data.status === 409) {
        return true;
      }
    }
  }
  return false;
};

// Функция форматирования номера телефона
const formatPhoneNumber = (phone: string): string => {
  console.log('[formatPhoneNumber] Input raw phone:', phone);

  const cleaned = phone.replace(/\D/g, '');
  console.log('[formatPhoneNumber] After cleaning digits:', cleaned);

  let formatted = '';

  if (cleaned.length === 10) {
    formatted = `+7${cleaned}`;
  } else if (cleaned.length === 11) {
    if (cleaned.startsWith('7')) {
      formatted = `+${cleaned}`;
    } else if (cleaned.startsWith('8')) {
      formatted = `+7${cleaned.slice(1)}`;
    } else {
      formatted = `+${cleaned}`;
    }
  } else if (cleaned.length === 12 && cleaned.startsWith('7')) {
    formatted = `+${cleaned}`;
  } else {
    formatted = `+${cleaned}`;
  }

  console.log('[formatPhoneNumber] Formatted result:', formatted);

  const phoneRegex = /^\+\d{10,15}$/;
  if (!phoneRegex.test(formatted)) {
    console.error('[formatPhoneNumber] Invalid format after formatting:', formatted);
    throw new Error('Неверный формат номера телефона');
  }

  return formatted;
};

export const usePhoneStepPlusofon = ({
  next: _next,
  onPhoneConfirmed,
}: UsePhoneStepPlusofonProps): UsePhoneStepPlusofonReturn => {
  const router = useRouter();

  // States для номера телефона
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isPhoneFilled, setIsPhoneFilled] = useState(false);
  const [phoneValue, setPhoneValue] = useState('');

  // States для модальных окон
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  // States для сессии
  const [callNumber, setCallNumber] = useState<string | null>(null);
  const [sessionUid, setSessionUid] = useState('');
  const [sessionSecret, setSessionSecret] = useState('');
  const [savedPhone, setSavedPhone] = useState('');

  // States для UI
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Refs для polling
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const tokensReceivedRef = useRef(false);
  const isAuthCompletedRef = useRef(false);

  // Мутации
  const { mutate: startSession, isPending: isStarting } = usePlusofonStart();
  const { mutate: checkStatus, isPending: isChecking } = usePlusofonStatus();
  const { mutate: getTokens, isPending: isGettingTokens } = usePlusofonGetToken();

  const isLoading = isStarting || isChecking || isGettingTokens;

  // Остановка polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      console.log('[usePhoneStepPlusofon] Stopping polling');
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Очистка всех состояний
  const resetState = useCallback(() => {
    stopPolling();
    tokensReceivedRef.current = false;
    isAuthCompletedRef.current = false;
    setCallNumber(null);
    setSessionUid('');
    setSessionSecret('');
    setStatusMessage('');
    setError(null);
  }, [stopPolling]);

  // Валидация номера
  const handleValidationChange = useCallback((isValid: boolean, isFilled: boolean) => {
    console.log('[usePhoneStepPlusofon] Validation change:', { isValid, isFilled });
    setIsPhoneValid(isValid);
    setIsPhoneFilled(isFilled);
  }, []);

  // Изменение номера
  const handlePhoneChange = useCallback(
    (value: string) => {
      console.log('[usePhoneStepPlusofon] Phone change:', value);
      setPhoneValue(value);
      setStatusMessage('');
      setError(null);
      resetState();
    },
    [resetState],
  );

  // Шаг 1: Нажатие "Далее" - открываем модалку подтверждения номера
  const handleNextClick = useCallback(() => {
    console.log('[usePhoneStepPlusofon] Next click:', { isPhoneValid, isPhoneFilled, isLoading });
    if (isPhoneValid && isPhoneFilled && !isLoading) {
      setIsModalOpen(true);
    }
  }, [isPhoneValid, isPhoneFilled, isLoading]);

  // Функция для редиректа на основе is_filled
  const redirectBasedOnFilled = useCallback(
    (isFilled: boolean) => {
      console.log('[usePhoneStepPlusofon] Redirecting with is_filled:', isFilled);
      if (!isFilled) {
        router.push('/user');
      } else {
        router.push('/contacts');
      }
    },
    [router],
  );

  // Шаг 2: Подтверждение номера - запускаем сессию
  const handleConfirmPhone = useCallback(() => {
    console.log('[usePhoneStepPlusofon] Confirm phone clicked');
    setIsModalOpen(false);
    resetState();

    try {
      const formattedPhone = formatPhoneNumber(phoneValue);
      console.log('[usePhoneStepPlusofon] Formatted phone:', formattedPhone);

      setSavedPhone(formattedPhone);
      setStatusMessage('Запуск сессии...');
      setError(null);

      startSession(
        { phone_number: formattedPhone },
        {
          onSuccess: (data) => {
            console.log('[usePhoneStepPlusofon] Session started successfully:', data);
            setCallNumber(data.call_number);
            setSessionUid(data.session_uid);
            setSessionSecret(data.verification_secret);
            setIsCallModalOpen(true);
            setStatusMessage('');
          },
          onError: (err: unknown) => {
            console.error('[usePhoneStepPlusofon] Start session error:', err);
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
            setStatusMessage('');
            resetState();
          },
        },
      );
    } catch (err) {
      console.error('[usePhoneStepPlusofon] Phone formatting error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Неверный формат номера телефона';
      setError(errorMessage);
      setStatusMessage('');
    }
  }, [phoneValue, startSession, resetState]);

  // Шаг 4: Polling статуса
  const startPolling = useCallback(() => {
    let attempts = 0;
    const maxAttempts = 60;

    stopPolling();
    tokensReceivedRef.current = false;

    console.log('[usePhoneStepPlusofon] Starting polling for session:', sessionUid);

    pollingIntervalRef.current = setInterval(() => {
      attempts++;
      console.log(`[usePhoneStepPlusofon] Polling status attempt ${attempts}/${maxAttempts}`);

      if (isAuthCompletedRef.current || tokensReceivedRef.current) {
        console.log('[usePhoneStepPlusofon] Auth already completed, stopping polling');
        stopPolling();
        return;
      }

      checkStatus(
        {
          verification_id: sessionUid,
          verification_secret: sessionSecret,
        },
        {
          onSuccess: (statusData) => {
            console.log('[usePhoneStepPlusofon] Status check:', statusData.status);

            if (statusData.status === 'verified') {
              console.log('[usePhoneStepPlusofon] Session verified, getting tokens...');
              stopPolling();
              setStatusMessage('Звонок подтверждён! Получение токенов...');

              if (!tokensReceivedRef.current && !isAuthCompletedRef.current) {
                getTokens(
                  {
                    verification_id: sessionUid,
                    verification_secret: sessionSecret,
                  },
                  {
                    onSuccess: (tokenData) => {
                      console.log(
                        '[usePhoneStepPlusofon] Tokens received successfully, is_filled:',
                        tokenData.is_filled,
                      );
                      tokensReceivedRef.current = true;
                      isAuthCompletedRef.current = true;
                      setStatusMessage('');
                      onPhoneConfirmed(savedPhone);
                      redirectBasedOnFilled(tokenData.is_filled);
                    },
                    onError: (err: unknown) => {
                      console.error('[usePhoneStepPlusofon] Get tokens error:', err);

                      if (isConflictError(err)) {
                        console.log('[usePhoneStepPlusofon] Session already consumed, assuming success');
                        tokensReceivedRef.current = true;
                        isAuthCompletedRef.current = true;
                        setStatusMessage('');
                        onPhoneConfirmed(savedPhone);
                        router.push('/contacts');
                      } else {
                        setError('Ошибка получения токенов');
                        setStatusMessage('');
                        resetState();
                      }
                    },
                  },
                );
              }
            } else if (statusData.status === 'consumed') {
              console.log('[usePhoneStepPlusofon] Session already consumed, assuming success');
              tokensReceivedRef.current = true;
              isAuthCompletedRef.current = true;
              stopPolling();
              setStatusMessage('');
              onPhoneConfirmed(savedPhone);
              router.push('/contacts');
            } else if (statusData.status === 'expired') {
              console.log('[usePhoneStepPlusofon] Session expired');
              stopPolling();
              setError('Время сессии истекло');
              setStatusMessage('');
              resetState();
            } else if (statusData.status === 'failed') {
              console.log('[usePhoneStepPlusofon] Session failed');
              stopPolling();
              setError('Ошибка верификации');
              setStatusMessage('');
              resetState();
            }
          },
          onError: (err: unknown) => {
            console.error('[usePhoneStepPlusofon] Status check error:', err);

            if (attempts >= maxAttempts) {
              stopPolling();
              setError('Превышено время ожидания');
              setStatusMessage('');
              resetState();
            }
          },
        },
      );

      if (attempts >= maxAttempts && !tokensReceivedRef.current) {
        console.log('[usePhoneStepPlusofon] Max attempts reached');
        stopPolling();
        setError('Превышено время ожидания подтверждения');
        setStatusMessage('');
        resetState();
      }
    }, 2000);
  }, [
    sessionUid,
    sessionSecret,
    checkStatus,
    getTokens,
    stopPolling,
    savedPhone,
    onPhoneConfirmed,
    redirectBasedOnFilled,
    resetState,
    router,
  ]);

  // Шаг 3: Пользователь подтвердил, что позвонил
  const handleConfirmCall = useCallback(() => {
    console.log('[usePhoneStepPlusofon] Confirm call clicked, starting polling');
    setIsCallModalOpen(false);
    setStatusMessage('Ожидаем подтверждение звонка...');
    setError(null);
    startPolling();
  }, [startPolling]);

  const handleCloseModal = useCallback(() => {
    console.log('[usePhoneStepPlusofon] Close modal');
    setIsModalOpen(false);
  }, []);

  const handleCloseCallModal = useCallback(() => {
    console.log('[usePhoneStepPlusofon] Close call modal');
    setIsCallModalOpen(false);
    resetState();
  }, [resetState]);

  const isButtonEnabled = isPhoneFilled && isPhoneValid && !isLoading;

  return {
    phoneValue,
    isButtonEnabled,
    isModalOpen,
    isCallModalOpen,
    isLoading,
    callNumber,
    statusMessage,
    error,
    handleValidationChange,
    handlePhoneChange,
    handleNextClick,
    handleConfirmPhone,
    handleConfirmCall,
    handleCloseModal,
    handleCloseCallModal,
  };
};
