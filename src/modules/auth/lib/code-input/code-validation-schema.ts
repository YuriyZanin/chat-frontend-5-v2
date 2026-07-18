import { z } from 'zod';

const codeDigitSchema = z.string().regex(/^\d?$/, 'Должна быть цифрой');

export const codeSchema = z.array(codeDigitSchema).length(5, 'Код должен состоять из 5 символов');

export const validateCodeArray = (codeArray: string[]): boolean => {
  try {
    codeSchema.parse(codeArray);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const isCodeComplete = (codeArray: string[]): boolean => {
  return codeArray.every((digit) => digit !== '');
};
