import { useCallback, useState } from 'react';
import { GetCodePayload } from 'shared/api/auth.api';
import { useGetAuthCode } from 'shared/query/auth.query';

type UsePhoneStepProps = {
  next: () => void;
  onPhoneConfirmed: (phone: string) => void;
};

type UsePhoneStepReturn = {
  phoneValue: string;
  isButtonEnabled: boolean;
  isModalOpen: boolean;
  isLoading: boolean;
  error: string | null;
  handleValidationChange: (isValid: boolean, isFilled: boolean) => void;
  handlePhoneChange: (value: string) => void;
  handleNextClick: () => void;
  handleConfirmPhone: () => void;
  handleCloseModal: () => void;
};

export const usePhoneStep = ({ next, onPhoneConfirmed }: UsePhoneStepProps): UsePhoneStepReturn => {
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(false);
  const [isPhoneFilled, setIsPhoneFilled] = useState<boolean>(false);
  const [phoneValue, setPhoneValue] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { mutate: getAuthCode, isPending: isCodeRequestPending, error: codeRequestError } = useGetAuthCode();

  const handleValidationChange = useCallback((isValid: boolean, isFilled: boolean) => {
    setIsPhoneValid(isValid);
    setIsPhoneFilled(isFilled);
  }, []);

  const handlePhoneChange = useCallback((value: string) => {
    setPhoneValue(value);
  }, []);

  const handleNextClick = useCallback(() => {
    if (isPhoneValid && isPhoneFilled && !isCodeRequestPending) {
      setIsModalOpen(true);
    }
  }, [isPhoneValid, isPhoneFilled, isCodeRequestPending]);

  const handleConfirmPhone = useCallback(() => {
    setIsModalOpen(false);

    if (isPhoneValid && isPhoneFilled) {
      const cleanPhone = phoneValue.replace(/\D/g, '');
      const formattedPhone = cleanPhone.startsWith('7') || cleanPhone.startsWith('8') ? `+${cleanPhone}` : phoneValue;
      console.log('Отправляемый phoneValue:', formattedPhone);

      const payload: GetCodePayload = {
        phone_number: formattedPhone,
      };

      getAuthCode(payload, {
        onSuccess: () => {
          onPhoneConfirmed(formattedPhone);
          next();
        },
        onError: (error) => {},
      });
    } else {
    }
  }, [phoneValue, isPhoneValid, isPhoneFilled, getAuthCode, next, onPhoneConfirmed]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const isButtonEnabled = isPhoneFilled && isPhoneValid && !isCodeRequestPending;

  return {
    phoneValue,
    isButtonEnabled,
    isModalOpen,
    isLoading: isCodeRequestPending,
    error: codeRequestError ? (codeRequestError as Error).message : null,
    handleValidationChange,
    handlePhoneChange,
    handleNextClick,
    handleConfirmPhone,
    handleCloseModal,
  };
};
