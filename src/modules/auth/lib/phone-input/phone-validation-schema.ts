import { z } from 'zod';

export const phoneSchema = z.string().regex(/^(8|\+7)\s?\d{3}\s?\d{3}\s?\d{2}\s?\d{2}$/, 'Некорректный номер');

export const validatePhoneString = (inputValue: string): boolean => {
  try {
    phoneSchema.parse(inputValue);
    return true;
  } catch (error) {
    return false;
  }
};
