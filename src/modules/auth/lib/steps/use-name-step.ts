import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useUpdateProfile } from 'shared/query/profile.query';
import { checkUniqueName } from '../../api/unique-name-check.api';
import { validateLogin, validateName } from '../text-input/text-validation-schema';

type UseNameStepProps = {
  next: () => void;
};

type UseNameStepReturn = {
  firstName: string;
  login: string;
  firstNameError: string | undefined;
  loginError: string | undefined;
  isFormValid: boolean;
  isSubmitting: boolean;
  isNameTouched: boolean;
  isLoginTouched: boolean;
  handleIsNameTouched: () => void;
  handleIsLoginTouched: () => void;
  handleFirstNameChange: (value: string) => void;
  handleLoginChange: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
};

export const useNameStep = ({ next }: UseNameStepProps): UseNameStepReturn => {
  const [firstName, setFirstName] = useState<string>('');
  const [login, setLogin] = useState<string>('');
  const [firstNameError, setFirstNameError] = useState<string | undefined>(undefined);
  const [loginError, setLoginError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isNameTouched, setIsNameTouched] = useState(false);
  const [isLoginTouched, setIsLoginTouched] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: updateProfileMutation } = useUpdateProfile();

  const handleIsNameTouched = (): void => {
    setIsNameTouched(true);
  };

  const handleIsLoginTouched = (): void => {
    setIsLoginTouched(true);
  };

  useEffect(() => {
    if (isNameTouched && firstName.trim() === '') {
      setFirstNameError('Заполните поле');
    }
  }, [firstName, isNameTouched]);
  // const handleFirstNameChange = useCallback((value: string) => {
  //   setFirstName(value);
  //   if (value !== '') {
  //     const validation = validateName(value);
  //     console.log('NAME VALIDATION:', value, validation);
  //     if (!validation.isValid) {
  //       setFirstNameError(validation.error);
  //     } else {
  //       setFirstNameError(undefined);
  //     }
  //   } else {
  //     setFirstNameError(undefined);
  //   }
  // }, []);

  const handleFirstNameChange = useCallback((value: string) => {
    setFirstName(value);

    const validation = validateName(value);

    if (!validation.isValid) {
      setFirstNameError(validation.error);
    } else {
      setFirstNameError(undefined);
    }
  }, []);

  const handleLoginChange = useCallback((value: string) => {
    setLogin(value);
    if (value !== '') {
      const validation = validateLogin(value);
      console.log('LOGIN VALIDATION:', value, validation);

      if (!validation.isValid) {
        setLoginError(validation.error);
      } else {
        setLoginError(undefined);
      }
    } else {
      setLoginError(undefined);
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        setFirstNameError(undefined);
        setLoginError(undefined);

        let hasErrors = false;

        if (!firstName.trim()) {
          setFirstNameError('Заполните поле');
          hasErrors = true;
        } else {
          const nameValidation = validateName(firstName);
          if (!nameValidation.isValid) {
            setFirstNameError(nameValidation.error);
            hasErrors = true;
          }
        }

        if (!login.trim()) {
          setLoginError('Заполните поле');
          hasErrors = true;
        } else {
          const loginValidation = validateLogin(login);
          if (!loginValidation.isValid) {
            setLoginError(loginValidation.error);
            hasErrors = true;
          }
        }

        if (hasErrors) {
          return;
        }

        const data = await queryClient.fetchQuery({
          queryKey: ['unique-name-check', login],
          queryFn: () => checkUniqueName(login),
          staleTime: 5 * 60 * 1000,
        });

        if ('messages' in data) {
          if (data.messages.includes('Этот nickname свободен')) {
          } else if (data.messages.includes('Пользователь с таким ником уже существует.')) {
            setLoginError('Такой никнейм уже занят.');
            return;
          } else {
            setLoginError(`Ошибка проверки: ${data.messages}`);
            return;
          }
        } else if ('field_name' in data) {
          setLoginError(`Ошибка валидации: ${data.field_name.join(', ')}`);
          return;
        } else if ('detail' in data) {
          setLoginError(`Ошибка авторизации: ${data.detail}`);
          return;
        } else if ('message' in data) {
          setLoginError(`Ошибка: ${data.message}`);
          return;
        } else {
          setLoginError('Неизвестная ошибка при проверке уникальности.');
          return;
        }

        const profileData = {
          nickname: login,
          first_name: firstName,
        };

        updateProfileMutation(profileData, {
          onSuccess: (profileData) => {
            console.log('Профиль успешно сохранён:', profileData);
            next();
          },
          onError: async (error) => {
            console.error('Ошибка при сохранении профиля:', error, profileData);
            if (error instanceof Response) {
              try {
                const errorText = await error.text();
                console.error('Тело ошибки от бэкенда:', errorText);
              } catch (e) {
                console.error('Не удалось прочитать тело ошибки:', e);
              }
            }
            setLoginError('Ошибка при сохранении профиля. Попробуйте позже.');
          },
        });
      } catch (error) {
        console.error('Ошибка при отправке формы:', error);
        setLoginError('Ошибка при отправке формы. Попробуйте позже.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [firstName, login, next, queryClient, updateProfileMutation],
  );

  // const isFormValid =
  //   firstName.trim() !== '' &&
  //   login.trim() !== '' &&
  //   firstNameError === undefined &&
  //   loginError === undefined;

  const isFormValid = firstName.trim() !== '' && login.trim() !== '' && !firstNameError && !loginError;

  console.log('STATE:', {
    firstName,
    login,
    firstNameError,
    loginError,
    isFormValid,
    isSubmitting,
  });
  return {
    firstName,
    login,
    firstNameError,
    loginError,
    isFormValid,
    isSubmitting,
    isNameTouched,
    isLoginTouched,
    handleIsNameTouched,
    handleIsLoginTouched,
    handleFirstNameChange,
    handleLoginChange,
    handleSubmit,
  };
};
