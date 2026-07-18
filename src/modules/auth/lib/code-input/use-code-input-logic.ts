import { ChangeEvent, FocusEvent, KeyboardEvent, useState } from 'react';
import { validateCodeArray } from './code-validation-schema';

type UseCodeInputLogicReturn = {
  focusedIndex: number | null;
  handleChange: (index: number) => (e: ChangeEvent<HTMLInputElement>) => void;
  handleFocus: (index: number) => (e: FocusEvent<HTMLInputElement>) => void;
  handleBlur: () => () => void;
  handleKeyDown: (index: number) => (e: KeyboardEvent<HTMLInputElement>) => void;
  isValid: boolean;
  isComplete: boolean;
};

type UseCodeInputLogicOptions = {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
};

export const useCodeInputLogic = (options: UseCodeInputLogicOptions): UseCodeInputLogicReturn => {
  const { value, onChange, disabled = false } = options;
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const isValid = validateCodeArray(value);
  const isComplete = value.every((digit) => digit !== '');

  const handleChange =
    (index: number): React.ChangeEventHandler<HTMLInputElement> =>
    (e: ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      const inputValue = e.target.value;
      const digit = inputValue.replace(/\D/g, '').slice(0, 1);

      const newCode = [...value];
      newCode[index] = digit;
      onChange(newCode);

      if (digit && index < 4) {
        const nextInput = document.getElementById(`code-input-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    };

  const handleFocus =
    (index: number): React.FocusEventHandler<HTMLInputElement> =>
    (e: FocusEvent<HTMLInputElement>) => {
      if (disabled) return;
      setFocusedIndex(index);
      e.target.select();
    };

  const handleBlur = () => (): void => {
    if (disabled) return;
    setFocusedIndex(null);
  };

  const handleKeyDown =
    (index: number): React.KeyboardEventHandler<HTMLInputElement> =>
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (value[index] === '' && index > 0) {
          const prevInput = document.getElementById(`code-input-${index - 1}`);
          if (prevInput) {
            prevInput.focus();
          }
        } else if (value[index] !== '') {
          const newCode = [...value];
          newCode[index] = '';
          onChange(newCode);
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        const prevInput = document.getElementById(`code-input-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
        }
      } else if (e.key === 'ArrowRight' && index < 4) {
        const nextInput = document.getElementById(`code-input-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    };

  return {
    focusedIndex,
    handleChange,
    handleFocus,
    handleBlur,
    handleKeyDown,
    isValid,
    isComplete,
  };
};
