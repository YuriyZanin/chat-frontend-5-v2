'use client';

import { TextInput } from 'modules/settings';
import { useEditProfileBlock } from 'modules/settings/lib/edit-profile-block/use-edit-profile-block';
import { useImageUpload } from 'modules/settings/lib/edit-profile-block/use-image-upload';
import Image from 'next/image';
import { JSX, useState } from 'react';
import { useMediaQuery } from 'shared/hooks';
import { ButtonUI } from 'shared/ui';
import { DateSelector } from '../date-selector';
import { ImageCropperModal } from '../image-cropper/image-cropper-modal';
import styles from './edit-profile-block.module.scss';

export const EditProfileBlock: React.FC = ({}): JSX.Element => {
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

  const {
    profile,
    birthday,
    firstName,
    lastName,
    login,
    info,
    isLoadingProfile,
    isSaving,
    errorProfile,
    errorSave,
    handleBirthdayChange,
    handleFirstNameChange,
    handleLastNameChange,
    handleLoginChange,
    handleInfoChange,
    handleReturnButton,
    handleSave,
  } = useEditProfileBlock();

  const [croppedZoom, setCroppedZoom] = useState<number | null>(null);

  console.log(birthday, firstName, lastName, login, 'vot vot');
  const isMobile = useMediaQuery('(max-width: 410px)');

  const handleConfirmCrop = (file: File, zoom: number): void => {
    setCroppedZoom(zoom);
    closeCropper();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    await handleSave(selectedFile);
  };

  if (isLoadingProfile) {
    return <div>Загрузка профиля...</div>;
  }

  if (errorProfile) {
    return <div>Ошибка загрузки профиля: {errorProfile.message}</div>;
  }

  const avatarSrc = previewUrl || profile?.avatar_url || '/images/settings/noAvatarIcon.svg';

  const avatarStyle: React.CSSProperties = {};
  if (croppedZoom !== null && previewUrl) {
    avatarStyle.transform = `scale(${croppedZoom / 100})`;
    avatarStyle.transition = 'transform 0.3s ease';
  }

  return (
    <>
      <div className={styles.container}>
        <button type="button" className={styles.returnButton} onClick={handleReturnButton}>
          <div className={styles.iconAndLabelContainer}>
            <Image
              src="/images/settings/returnArrowIcon.svg"
              alt=""
              width={21}
              height={21}
              className={styles.returnIcon}
            />
            <span className={styles.labelText}>Редактирование профиля</span>
          </div>
        </button>
        <div className={styles.imageContainer}>
          <div className={styles.avatar}>
            <Image
              src={avatarSrc}
              alt="Аватар"
              width={200}
              height={200}
              className={styles.avatarImage}
              style={avatarStyle}
            />
          </div>
          <button type="button" className={styles.selectImage} onClick={triggerFileSelect}>
            {isMobile ? '+ изменить фото' : 'Выбрать фотографию'}
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
        <form onSubmit={handleSubmit} className={styles.profileForm}>
          <TextInput
            label="Изменить имя"
            placeholder=""
            value={firstName}
            onChange={handleFirstNameChange}
            error={''}
            maxLength={30}
          />
          <TextInput
            label="Изменить фамилию"
            placeholder=""
            value={lastName}
            onChange={handleLastNameChange}
            error={''}
            maxLength={30}
          />
          <TextInput
            label="Изменить никнейм"
            placeholder=""
            value={login}
            onChange={handleLoginChange}
            error={''}
            maxLength={30}
          />
          <DateSelector label="Дата рождения" value={birthday} onChange={handleBirthdayChange} />
          <TextInput
            label="Напишите пару слов о себе"
            placeholder=""
            value={info}
            onChange={handleInfoChange}
            error={''}
            maxLength={250}
          />
          {errorSave && <div className={styles.error}>{errorSave.message}</div>}
          <ButtonUI
            variant="general"
            appearance="primary"
            label={isSaving ? 'Сохранение...' : 'Сохранить'}
            type="submit"
            disabled={isSaving}
          />
        </form>
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
