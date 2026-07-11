// src/modules/settings/ui/image-cropper/image-cropper-modal.tsx
'use client';

import { useNewGroupStore } from 'modules/new-group/model/new-group-store';
import { JSX } from 'react';
import { ImageCropper } from './image-cropper';
import styles from './image-cropper.module.scss'; // Убедитесь, что у вас есть этот файл
type ImageCropperModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (file: File, zoom: number) => void;
  initialPreviewUrl: string | null; // <-- Новый пропс
  initialOriginalFile: File | null; // <-- Новый пропс
};

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialPreviewUrl, // <-- Получаем пропс
  initialOriginalFile, // <-- Получаем пропс
}: ImageCropperModalProps): JSX.Element => {
  const setAvatarPreviewStore = useNewGroupStore((s) => s.setAvatarPreview);
  const setAvatarFileStore = useNewGroupStore((s) => s.setAvatarFile);
  const handleCancel = (): void => {
    setAvatarPreviewStore(null);
    setAvatarFileStore(null);
    onClose();
  };
  if (!isOpen) return <></>;
  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleCancel();
        }
      }}
    >
      {/* Передаём previewUrl и originalFile в ImageCropper */}
      <ImageCropper
        onClose={handleCancel}
        onConfirm={onConfirm}
        initialPreviewUrl={initialPreviewUrl}
        initialOriginalFile={initialOriginalFile}
      />
    </div>
  );
};
