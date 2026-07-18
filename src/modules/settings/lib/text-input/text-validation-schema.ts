import { z } from 'zod';

export const nameSchema = z
  .string()
  .max(30, 'Не более 30 символов')
  .regex(/^[a-zA-Zа-яА-ЯёЁ\s\-]*$/, 'Используйте только буквы, пробел или тире');

export const loginSchema = z
  .string()
  .max(30, 'Не более 30 символов')
  .regex(/^[a-zA-Zа-яА-ЯёЁ0-9_]*$/, 'Используйте только буквы, цифры и _');

export const validateName = (value: string): { isValid: boolean; error?: string } => {
  if (value === '') {
    return { isValid: true };
  }

  try {
    nameSchema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      if (error) {
        return { isValid: false, error: error.message };
      } else {
        return { isValid: false, error: 'Ошибка валидации имени' };
      }
    }
    return { isValid: false, error: 'Неизвестная ошибка валидации имени' };
  }
};

export const validateLogin = (value: string): { isValid: boolean; error?: string } => {
  if (value === '') {
    return { isValid: true };
  }

  try {
    loginSchema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      if (error) {
        return { isValid: false, error: error.message };
      } else {
        return { isValid: false, error: 'Ошибка валидации логина' };
      }
    }
    return { isValid: false, error: 'Неизвестная ошибка валидации логина' };
  }
};
