import Image from 'next/image';
import { JSX } from 'react';
import { ButtonUI } from 'shared/ui/button';
import { Modal } from 'shared/ui/modal';
import { usePhoneStepPlusofon } from '../../lib/steps/use-phone-step-plusofon';
import { PhoneNumberInput } from '../../ui/phone-number-input';
import styles from './phone-step.module.scss';

type PhoneStepProps = {
  next: () => void;
  prev: () => void;
  onPhoneConfirmed: (phone: string) => void;
};

export const PhoneStep: React.FC<PhoneStepProps> = ({ next, prev, onPhoneConfirmed }: PhoneStepProps): JSX.Element => {
  const {
    phoneValue,
    isButtonEnabled,
    isModalOpen,
    isCallModalOpen,
    isLoading,
    callNumber,
    statusMessage,
    error,
    handleValidationChange,
    handlePhoneChange,
    handleNextClick,
    handleConfirmPhone,
    handleConfirmCall,
    handleCloseModal,
    handleCloseCallModal,
  } = usePhoneStepPlusofon({ next, onPhoneConfirmed });

  console.log('[PhoneStep] Render state:', {
    isButtonEnabled,
    isModalOpen,
    isCallModalOpen,
    isLoading,
    callNumber,
    statusMessage,
    error,
  });

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <button className={styles.arrowButton} onClick={prev}></button>
            <Image
              src="/images/auth/welcomeLogo.png"
              alt="Добро пожаловать"
              width={70}
              height={70}
              className={styles.image}
            />
          </div>
          <h1 className={styles.headerTitle}>А-Чат</h1>
          <h1 className={styles.title}>Вход/регистрация</h1>
          <PhoneNumberInput onChange={handlePhoneChange} onValidationChange={handleValidationChange} />
          {error && <p className={styles.errorText}>{error}</p>}
          {statusMessage && <p className={styles.statusText}>{statusMessage}</p>}
        </div>
        <ButtonUI
          variant="general"
          appearance={isButtonEnabled ? 'primary' : 'disabled'}
          label={isLoading ? 'Загрузка...' : 'Далее'}
          onClick={handleNextClick}
          disabled={!isButtonEnabled}
        />
      </div>

      {/* Первая модалка: подтверждение номера телефона */}
      {isModalOpen && (
        <Modal
          title={phoneValue}
          content="Номер телефона указан верно?"
          firstButtonText="Верно"
          secondButtonText="Изменить"
          onFirstButtonClick={handleConfirmPhone}
          onSecondButtonClick={handleCloseModal}
          onClose={handleCloseModal}
        />
      )}

      {/* Вторая модалка: номер для звонка */}
      {isCallModalOpen && callNumber && (
        <Modal
          title="Подтвердите номер телефона"
          content={callNumber}
          firstButtonText="Я позвонил(а)"
          secondButtonText="Отмена"
          onFirstButtonClick={handleConfirmCall}
          onSecondButtonClick={handleCloseCallModal}
          onClose={handleCloseCallModal}
        />
      )}
    </>
  );
};
