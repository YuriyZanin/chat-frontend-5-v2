// src/modules/settings/ui/image-cropper/image-cropper.tsx
'use client';

import { useEffect, useRef } from 'react';
import styles from './image-cropper.module.scss';
// Обновляем хук, чтобы он принимал начальные значения
import { useImageCropper } from 'modules/settings/lib/image-cropper/use-image-cropper';
import Image from 'next/image';

type ImageCropperProps = {
  onClose: () => void;
  onConfirm: (file: File, zoom: number) => void;
  initialPreviewUrl: string | null; // <-- Новый пропс
  initialOriginalFile: File | null; // <-- Новый пропс
};

export const ImageCropper: React.FC<ImageCropperProps> = ({
  onClose,
  onConfirm,
  initialPreviewUrl, // <-- Получаем пропс
  initialOriginalFile, // <-- Получаем пропс
}: ImageCropperProps) => {
  const {
    zoom,
    setZoom,
    previewUrl, // <-- Это теперь будет из хука, инициализированного с initialPreviewUrl
    originalFile, // <-- Это теперь будет из хука, инициализированного с initialOriginalFile
    handleFileChange,
    reset,
  } = useImageCropper(initialPreviewUrl, initialOriginalFile); // <-- Передаём пропсы в хук

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Устанавливаем CSS-переменную для масштаба
  useEffect(() => {
    const container = document.querySelector(`.${styles.previewContainer}`) as HTMLElement | null;
    if (container) {
      container.style.setProperty('--zoom', `${zoom / 100}`);
    }
  }, [zoom]);

  const handleConfirm = (): void => {
    // Используем originalFile из хука (который теперь синхронизирован)
    if (originalFile) {
      onConfirm(originalFile, zoom);
    }
  };

  const handleCancel = (): void => {
    reset();
    onClose();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Настроить отображение фото</h2>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
      </div>

      <div className={styles.previewContainer}>
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className={styles.previewImage} draggable={false} />
        ) : (
          <div className={styles.placeholder}>
            <span>Выберите изображение</span>
          </div>
        )}
        <div className={styles.shadow}></div>
      </div>

      <div className={styles.sliderContainer}>
        <input
          type="range"
          min="50"
          max="200"
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className={styles.slider}
        />
        <button className={''} onClick={handleConfirm} disabled={!previewUrl}>
          <Image src={'/images/settings/okImageCropperIcon.svg'} alt="" width={36} height={36} className={''} />
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png,.bmp,image/jpeg,image/png,image/bmp"
        multiple
        style={{ display: 'none' }}
        onClick={() => {
          if (fileInputRef.current) fileInputRef.current.value = '';
        }}
      />
    </div>
  );
};
