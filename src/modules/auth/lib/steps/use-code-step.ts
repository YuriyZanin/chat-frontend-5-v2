import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { GetTokenPayload } from 'shared/api/auth.api';
import { useGetAuthToken } from 'shared/query/auth.query';

type UseCodeStepProps = {
  phone: string;
};

type UseCodeStepReturn = {
  code: string[];
  error: string | undefined;
  timeLeft: number;
  isTimerActive: boolean;
  blockTimeLeft: number;
  isBlockTimerActive: boolean;
  justStartedBlock: boolean;
  isCodeComplete: boolean;
  isSubmitting: boolean;
  isCodeNotArriving: boolean;
  handleCodeChange: (newCode: string[]) => void;
  handleResendCode: () => void;
  handleCodeDontArrive: () => void;
  handleSupportModalClose: () => void;
};

export const useCodeStep = ({ phone }: UseCodeStepProps): UseCodeStepReturn => {
  const [code, setCode] = useState<string[]>(['', '', '', '', '']);
  const [error, setError] = useState<string | undefined>(undefined);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(5);

  const [timeLeft, setTimeLeft] = useState<number>(56);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);

  const [blockTimeLeft, setBlockTimeLeft] = useState<number>(0);

  const [isCodeNotArriving, setIsCodeNotArriving] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (isTimerActive && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime === 0) {
            clearInterval(timerId);
            setIsTimerActive(false);
            return newTime;
          }
          return newTime;
        });
      }, 1000);
    }

    return (): void => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [isTimerActive, timeLeft]);

  useEffect(() => {
    let blockTimerId: NodeJS.Timeout;

    if (blockTimeLeft > 0) {
      blockTimerId = setInterval(() => {
        setBlockTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime === 0) {
            clearInterval(blockTimerId);
          }
          return newTime;
        });
      }, 1000);
    }

    return (): void => {
      if (blockTimerId) {
        clearInterval(blockTimerId);
      }
    };
  }, [blockTimeLeft]);

  const handleResendCode = (): void => {
    console.log('Отправляем новый код...');
    if (blockTimeLeft > 0) {
      console.log('Невозможно отправить новый код: активна блокировка.');
      setError(`Попытки исчерпаны. Повтор через ${Math.floor(blockTimeLeft / 60)} мин ${blockTimeLeft % 60} сек.`);
      return;
    }
    if (isTimerActive) {
      console.log('Невозможно отправить новый код: обычный таймер активен.');
      setError(`Повторная отправка возможна через ${timeLeft} сек.`);
      return;
    }

    setTimeLeft(56);
    setIsTimerActive(true);
    setError(undefined);
  };

  const { mutate: getAuthToken, isPending: isTokenRequestPending } = useGetAuthToken();

  const handleCodeChange = useCallback(
    (newCode: string[]) => {
      if (blockTimeLeft > 0) {
        console.log('Невозможно изменить код: активна блокировка.');
        setError(`Попытки исчерпаны. Повтор через ${Math.floor(blockTimeLeft / 60)} мин ${blockTimeLeft % 60} сек.`);
        setCode(['', '', '', '', '']);
        return;
      }

      setCode(newCode);

      const isCodeCompleteNow = newCode.every((digit) => digit !== '');

      if (isCodeCompleteNow) {
        const payload: GetTokenPayload = {
          phone_number: phone,
          code: newCode.join(''),
        };

        console.log('Отправляемый код:', newCode.join(''), 'номер:', phone);

        getAuthToken(payload, {
          onSuccess: (data) => {
            console.log('Код верный, сбрасываем состояния блокировки.');
            setAttemptsLeft(5);
            setBlockTimeLeft(0);
            setError(undefined);

            if (!data.is_filled) {
              router.push(`/user`);
            } else {
              router.push('/contacts');
            }
          },
          onError: () => {
            console.log('Код неверный.');
            const newAttempts = attemptsLeft - 1;
            setAttemptsLeft(newAttempts);

            if (newAttempts <= 0) {
              console.log('Попытки исчерпаны. Запускаем таймер блокировки.');
              setBlockTimeLeft(3600);

              setError(
                `Попытки исчерпаны. Повтор через ${Math.floor(blockTimeLeft / 60)} мин ${blockTimeLeft % 60} сек.`,
              );
            } else {
              setError(`Код введен неверно. Осталось попыток: ${newAttempts}`);
            }

            setCode(['', '', '', '', '']);
          },
        });
      } else {
        if (error) {
          setError(undefined);
        }
      }
    },
    [error, blockTimeLeft, phone, getAuthToken, attemptsLeft, router],
  );

  const handleCodeDontArrive = (): void => {
    setIsCodeNotArriving(true);
  };

  const handleSupportModalClose = (): void => {
    setIsCodeNotArriving(false);
  };

  const isBlockTimerActive = blockTimeLeft > 0;
  const justStartedBlock = isBlockTimerActive && blockTimeLeft === 3600;
  const isCodeComplete = code.every((digit) => digit !== '');

  return {
    code,
    error,
    timeLeft,
    isTimerActive,
    blockTimeLeft,
    isBlockTimerActive,
    justStartedBlock,
    isCodeComplete,
    isSubmitting: isTokenRequestPending,
    isCodeNotArriving,
    handleCodeChange,
    handleResendCode,
    handleCodeDontArrive,
    handleSupportModalClose,
  };
};
