import { z } from 'zod';

// export const nameSchema = z
//   .string()
//   .max(30, 'Не более 30 символов')
//   .regex(/^[a-zA-Zа-яА-ЯёЁ\s\-]*$/, 'Используйте только буквы, пробел или тире');

// export const loginSchema = z
//   .string()
//   .max(30, 'Не более 30 символов')
//   .regex(/^[a-zA-Zа-яА-ЯёЁ0-9_]*$/, 'Используйте только буквы, цифры и _');

export const nameSchema = z
  .string()
  .min(2, 'Не менее 2 символов')
  .max(30, 'Не более 30 символов')
  .regex(/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/, 'Используйте только буквы, пробел или тире');

export const loginSchema = z
  .string()
  .min(5, 'Не менее 5 символов')
  .max(32, 'Не более 32 символов')
  .regex(/^[a-zA-Zа-яА-ЯёЁ0-9_]+$/, 'Используйте только буквы, цифры и _');

export const validateName = (value: string): { isValid: boolean; error?: string } => {
  // if (value === '') {
  //   return { isValid: true };
  // }

  try {
    nameSchema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.issues[0]?.message || 'Ошибка валидации имени',
      };
    }
    return { isValid: false, error: 'Неизвестная ошибка валидации имени' };
  }
};

export const validateLogin = (value: string): { isValid: boolean; error?: string } => {
  // if (value === '') {
  //   return { isValid: true };
  // }

  try {
    loginSchema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.issues[0]?.message || 'Ошибка валидации логина',
      };
    }
    return { isValid: false, error: 'Неизвестная ошибка валидации логина' };
  }
};
