import { useCallback } from 'react';

const formatDigitsWithSpaces = (digits: string): string => {
  let formatted = '';
  let remaining = digits;
  const lengths = [3, 3, 2, 2];

  for (const length of lengths) {
    if (remaining.length > 0) {
      const part = remaining.substring(0, length);
      formatted += (formatted ? ' ' : '') + part;
      remaining = remaining.substring(length);
    }
  }

  return formatted;
};

export const usePhoneFormatting = (): ((inputValue: string) => string) => {
  return useCallback((inputValue: string): string => {
    const digitsOnly = inputValue.replace(/\D/g, '');
    let prefix = '';
    let digitsToFormat = '';

    if (digitsOnly.startsWith('8')) {
      prefix = '+7';
      digitsToFormat = digitsOnly.substring(1);
    } else if (digitsOnly.startsWith('7')) {
      prefix = '+7';
      digitsToFormat = digitsOnly.substring(1);
    } else if (digitsOnly.length > 0) {
      prefix = '+7';
      digitsToFormat = digitsOnly;
    }

    const formattedDigits = digitsToFormat ? formatDigitsWithSpaces(digitsToFormat) : '';

    return prefix + (formattedDigits ? ' ' + formattedDigits : '');
  }, []);
};
