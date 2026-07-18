// lib/dual-input/use-dual-input.ts
import { useState } from 'react';

type UseDualInputProps = {
  maxFirst?: number;
  maxSecond?: number;
  initialFirst?: string;
  initialSecond?: string;
};

type UseDualInputReturn = {
  firstFocused: boolean;
  secondFocused: boolean;
  firstLength: number;
  secondLength: number;
  setFirstLength: (length: number) => void;
  setSecondLength: (length: number) => void;
  handleFirstFocus: () => void;
  handleFirstBlur: () => void;
  handleSecondFocus: () => void;
  handleSecondBlur: () => void;
  handleClearFirst: () => void;
  handleClearSecond: () => void;
};

export const useDualInput = ({
  maxFirst = 50,
  maxSecond = 100,
  initialFirst = '',
  initialSecond = '',
}: UseDualInputProps = {}): UseDualInputReturn => {
  const [firstFocused, setFirstFocused] = useState(false);
  const [secondFocused, setSecondFocused] = useState(false);
  const [firstLength, setFirstLength] = useState(initialFirst.length);
  const [secondLength, setSecondLength] = useState(initialSecond.length);

  const handleFirstFocus = (): void => setFirstFocused(true);
  const handleFirstBlur = (): void => setFirstFocused(false);
  const handleSecondFocus = (): void => setSecondFocused(true);
  const handleSecondBlur = (): void => setSecondFocused(false);

  const handleClearFirst = (): void => setFirstLength(0);
  const handleClearSecond = (): void => setSecondLength(0);

  return {
    firstFocused,
    secondFocused,
    firstLength,
    secondLength,
    setFirstLength,
    setSecondLength,
    handleFirstFocus,
    handleFirstBlur,
    handleSecondFocus,
    handleSecondBlur,
    handleClearFirst,
    handleClearSecond,
  };
};
