import { ChangeEvent, FocusEvent, useState } from 'react';
import { validatePhoneString } from './phone-validation-schema';
import { usePhoneFormatting } from './use-phone-formatting';

type UsePhoneInputReturn = {
  value: string;
  error: string | null;
  isFocused: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFocus: () => void;
  handleBlur: (e: FocusEvent<HTMLInputElement>) => void;
  formattedValue: string;
  isValid: boolean;
  isFilled: boolean;
};

type UsePhoneInputOptions = {
  onChange?: (value: string) => void;
  onValidationChange?: (isValid: boolean, isFilled: boolean) => void;
};

export const usePhoneInput = (options: UsePhoneInputOptions = {}): UsePhoneInputReturn => {
  const { onChange, onValidationChange } = options;
  const [internalValue, setInternalValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const formatPhone = usePhoneFormatting();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputValue = e.target.value;

    let newValue = inputValue;
    if (inputValue.startsWith('+') && !inputValue.startsWith('+7')) {
      newValue = '+' + inputValue.substring(1).replace(/\D/g, '');
      setInternalValue(newValue);
      onChange?.(newValue);
      const newIsFilled = newValue.trim() !== '';
      const newIsValid = validatePhoneString(newValue);
      onValidationChange?.(newIsValid, newIsFilled);
      return;
    }

    const formattedValue = formatPhone(inputValue);
    newValue = formattedValue;

    setInternalValue(newValue);
    onChange?.(newValue);

    if (error) {
      setError(null);
    }

    const newIsFilled = newValue.trim() !== '';
    const newIsValid = validatePhoneString(newValue);
    onValidationChange?.(newIsValid, newIsFilled);
  };

  const handleFocus = (): void => {
    setIsFocused(true);
  };

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    setIsFocused(false);

    const inputValue = internalValue;

    let newError: string | null = null;
    let isValid = false;
    const isFilled = inputValue.trim() !== '';

    if (isFilled) {
      if (!validatePhoneString(inputValue)) {
        newError = 'Некорректный номер';
      } else {
        isValid = true;
      }
    }
    setError(newError);

    onValidationChange?.(isValid, isFilled);
  };

  const formattedValue = formatPhone(internalValue);
  const isValid = validatePhoneString(internalValue);
  const isFilled = internalValue.trim() !== '';

  return {
    value: internalValue,
    error,
    isFocused,
    handleChange,
    handleFocus,
    handleBlur,
    formattedValue,
    isValid,
    isFilled,
  };
};
