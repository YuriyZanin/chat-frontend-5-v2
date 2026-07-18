import { useCallback, useEffect, useRef, useState } from 'react';

type UseTextAreaProps = {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  disabled?: boolean;
};

type UseTextAreaReturn = {
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleFocus: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  isFocused: boolean;
};

export const useTextArea = ({
  value,
  onChange,
  maxLength = 500,
  disabled = false,
}: UseTextAreaProps): UseTextAreaReturn => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const prevValueRef = useRef(value);

  useEffect(() => {
    const prevValue = prevValueRef.current;
    if (prevValue !== value) {
      prevValueRef.current = value;
      if (value.length > maxLength) {
        const truncatedValue = value.slice(0, maxLength);
        prevValueRef.current = truncatedValue;
        onChange(truncatedValue);
      }
    }
  }, [value, maxLength, onChange]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (disabled) return;

      let inputValue = e.target.value;
      if (inputValue.length > maxLength) {
        inputValue = inputValue.slice(0, maxLength);
      }
      onChange(inputValue);
    },
    [onChange, maxLength, disabled],
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      if (disabled) return;
      setIsFocused(true);
    },
    [disabled],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      if (disabled) return;
      setIsFocused(false);
    },
    [disabled],
  );

  return {
    handleChange,
    handleFocus,
    handleBlur,
    isFocused,
  };
};
