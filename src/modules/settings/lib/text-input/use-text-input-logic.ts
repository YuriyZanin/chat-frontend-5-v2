import { ChangeEvent, FocusEvent, useState } from 'react';

type UseTextInputLogicReturn = {
  isFocused: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFocus: (e: FocusEvent<HTMLInputElement>) => void;
  handleBlur: (e: FocusEvent<HTMLInputElement>) => void;
};

type UseTextInputLogicOptions = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  maxLength?: number;
};

export const useTextInputLogic = (options: UseTextInputLogicOptions): UseTextInputLogicReturn => {
  const { onChange, disabled = false, maxLength = 30 } = options;
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (disabled) return;

    let inputValue = e.target.value;
    if (inputValue.length > maxLength) {
      inputValue = inputValue.slice(0, maxLength);
    }
    onChange(inputValue);
  };

  const handleFocus: React.FocusEventHandler<HTMLInputElement> = () => {
    if (disabled) return;
    setIsFocused(true);
  };

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = () => {
    if (disabled) return;
    setIsFocused(false);
  };

  return {
    isFocused,
    handleChange,
    handleFocus,
    handleBlur,
  };
};
