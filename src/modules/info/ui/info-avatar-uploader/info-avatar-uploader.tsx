import { useUpdateProfileAvatarQuery } from 'modules/info/api/info.query';
import { useInfoEditGroupStore } from 'modules/info/model/info.edit-group.store';
import { useImageUpload } from 'modules/settings/lib/edit-profile-block/use-image-upload';
import { ImageCropperModal } from 'modules/settings/ui/image-cropper/image-cropper-modal';
import Image from 'next/image';
import { JSX, useState } from 'react';
import styles from './info-avatar-uploader.module.scss';
import { InfoAvatarUploaderProps } from './info-avatar-uploader.props';

export const InfoAvatarUploader = ({ avatarHref }: InfoAvatarUploaderProps): JSX.Element => {
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [croppedZoom, setCroppedZoom] = useState<number | null>(null);
  const { mutate: updateAvatar } = useUpdateProfileAvatarQuery();
  const { setGroupData } = useInfoEditGroupStore();

  const {
    selectedFile,
    previewUrl,
    error: imageUploadError,
    handleFileChange,
    triggerFileSelect,
    fileInputRef,
    isCropperOpen,
    closeCropper,
  } = useImageUpload();

  const avatarSrc = previewUrl || avatarHref || '/images/profile/group-default.png';
  const avatarStyle: React.CSSProperties = {};
  if (croppedZoom !== null && previewUrl) {
    avatarStyle.transform = `scale(${croppedZoom / 100})`;
    avatarStyle.transition = 'transform 0.3s ease';
  }

  const handleConfirmCrop = async (file: File, zoom: number): Promise<void> => {
    setCroppedZoom(zoom);
    closeCropper();

    setIsUploadingAvatar(true);
    try {
      await updateAvatar(file, { onSettled: (data) => setGroupData({ avatarUid: data?.uid }) });
    } catch (error) {
      console.error('Ошибка загрузки аватара:', error);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.avatar}>
          <Image src={avatarSrc} alt="Аватар группы" width={200} height={200} className="" style={avatarStyle} />
        </div>
        <button type="button" className={styles.selectImage} onClick={triggerFileSelect} disabled={isUploadingAvatar}>
          {isUploadingAvatar ? 'Загрузка...' : 'Изменить фотографию'}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        {imageUploadError && <div className={styles.error}>{imageUploadError}</div>}
      </div>

      {isCropperOpen && (
        <div className={styles.overlay}>
          <ImageCropperModal
            isOpen={isCropperOpen}
            onClose={closeCropper}
            onConfirm={handleConfirmCrop}
            initialPreviewUrl={previewUrl}
            initialOriginalFile={selectedFile}
          />
        </div>
      )}
    </>
  );
};
