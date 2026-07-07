// src/modules/settings/lib/image-cropper/crop-image.ts

export const cropImage = (
  imageUrl: string,
  zoom: number,
  position: { x: number; y: number },
  containerSize: { width: number; height: number },
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.src = imageUrl;

    img.onload = (): void => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Не удалось создать контекст canvas'));
          return;
        }

        canvas.width = containerSize.width;
        canvas.height = containerSize.height;

        const scale = zoom / 300;

        //корректирующий коэффициент
        const positionMultiplier = 1.0; // Попробуйте 1.1 или 1.2 для большего смещения

        // Вычисляем, какую часть исходного изображения нужно вырезать
        // Используем координаты в исходном изображении
        const viewCenterX = img.width / 2 - (position.x * positionMultiplier) / scale;
        const viewCenterY = img.height / 2 - (position.y * positionMultiplier) / scale;
        // Координаты верхнего левого угла в исходном изображении
        const sx = viewCenterX - containerSize.width / 2 / scale;
        const sy = viewCenterY - containerSize.height / 2 / scale;
        const sWidth = containerSize.width / scale;
        const sHeight = containerSize.height / scale;

        // Ограничиваем координаты
        const maxSx = img.width - sWidth;
        const maxSy = img.height - sHeight;

        const validSx = Math.max(0, Math.min(maxSx, sx));
        const validSy = Math.max(0, Math.min(maxSy, sy));
        const validSWidth = Math.min(sWidth, img.width - validSx);
        const validSHeight = Math.min(sHeight, img.height - validSy);

        console.log('Область обрезки в исходном изображении:');
        console.log('sx:', validSx, 'sy:', validSy, 'width:', validSWidth, 'height:', validSHeight);

        // Рисуем напрямую из исходного изображения
        ctx.drawImage(
          img,
          validSx,
          validSy,
          validSWidth,
          validSHeight,
          0,
          0,
          containerSize.width,
          containerSize.height,
        );

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Не удалось создать Blob'));
              return;
            }

            const file = new File([blob], `cropped-image-${Date.now()}.png`, { type: 'image/png' });

            resolve(file);
          },
          'image/png',
          0.92,
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = (): void => {
      reject(new Error('Не удалось загрузить изображение'));
    };
  });
};
