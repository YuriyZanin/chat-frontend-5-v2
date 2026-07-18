import type { FileMessageApi } from '../model/messages-list/create-text-message.api.schema';

export const fileToBase64 = async (file: File): Promise<FileMessageApi> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (): void => {
      const base64String = reader.result as string;
      // Убираем префикс (например, "data:image/png;base64,")
      const pureBase64 = base64String.split(',')[1];

      resolve({
        data: pureBase64, // Cодержимое файла в формате Base64
        filename: file.name, // Имя файла с расширением
      });
    };

    reader.onerror = (error): void => reject(error);
    reader.readAsDataURL(file);
  });
};
