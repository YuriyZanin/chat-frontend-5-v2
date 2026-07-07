// src/modules/settings/ui/image-cropper/image-cropper.tsx
'use client';

import { useEffect } from 'react';
import styles from './image-cropper.module.scss';
// Обновляем хук, чтобы он принимал начальные значения
import { useImageCropper } from 'modules/settings/lib/image-cropper/use-image-cropper';
import Image from 'next/image';
import Close from './img/close.svg';
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
    setPosition,
    position,
    containerRef,
    fileInputRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    isDragging,
  } = useImageCropper(initialPreviewUrl, initialOriginalFile); // <-- Передаём пропсы в хук

  // Сброс при изменении зума
  useEffect(() => {
    if (zoom <= 100) {
      setPosition({ x: 0, y: 0 });
    }
  }, [zoom]);

  const handleConfirm = (): void => {
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
          <Close />
        </button>
      </div>

      <div
        className={styles.previewContainer}
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseDown={handleMouseDown}
        style={{
          cursor: zoom > 100 ? (isDragging ? 'grabbing' : 'grab') : 'default',
        }}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className={styles.previewImage}
            draggable={false}
            style={{
              transform: `translate(calc(${position.x}px), calc(${position.y}px)) scale(${zoom / 100})`,
              transformOrigin: 'center center',
            }}
          />
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
          min={0}
          max={150}
          value={zoom - 100}
          onChange={(e) => {
            const newZoom = Number(e.target.value) + 100;
            setZoom(newZoom);
            if (newZoom <= 100) {
              setPosition({ x: 0, y: 0 });
            }
          }}
          className={styles.slider}
        />
        <button onClick={handleConfirm} disabled={!previewUrl}>
          <Image src={'/images/settings/okImageCropperIcon.svg'} alt="" width={36} height={36} />
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
