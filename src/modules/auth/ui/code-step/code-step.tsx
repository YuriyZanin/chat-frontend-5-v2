'use client';

import { SupportModal } from 'modules/support/ui/support-modal';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { JSX } from 'react';
import { useCodeStep } from '../../lib/steps/use-code-step';
import { CodeInput } from '../code-input';
import styles from './code-step.module.scss';

type CodeStepProps = {
  prev: () => void;
  phone: string;
};

export const CodeStep: React.FC<CodeStepProps> = ({ prev, phone }: CodeStepProps): JSX.Element => {
  const router = useRouter();

  const {
    code,
    error,
    timeLeft,
    isTimerActive,
    blockTimeLeft,
    isBlockTimerActive,
    justStartedBlock,
    isCodeComplete,
    isSubmitting,
    isCodeNotArriving,
    handleCodeChange,
    handleResendCode,
    handleCodeDontArrive,
    handleSupportModalClose,
  } = useCodeStep({
    phone,
  });

  const displayError = isBlockTimerActive ? 'Слишком много неверных попыток' : error;

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
          <h1 className={styles.title}>Подтвердите вход</h1>

          <p className={styles.phoneText}>
            Код подтверждения отправлен <br /> на следующий номер: <br /> <strong>{phone}</strong>
          </p>

          <form onSubmit={(e) => e.preventDefault()} className={styles.codeForm}>
            <CodeInput
              label="Введите код"
              value={code}
              onChange={handleCodeChange}
              error={displayError}
              disabled={isBlockTimerActive}
            />

            {isTimerActive ? (
              <p className={styles.timerText}>
                Отправить новый код через {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </p>
            ) : (
              <button type="button" className={styles.resendButton} onClick={handleResendCode}>
                Отправить новый код
              </button>
            )}

            <button
              type="button"
              className={`${styles.supportButton} ${isCodeComplete ? styles.active : ''}`}
              onClick={handleCodeDontArrive}
            >
              Не приходит код?
            </button>
          </form>
        </div>
      </div>

      {justStartedBlock && (
        <SupportModal
          title={'Лимит исчерпан'}
          content={'Попробуйте позднее'}
          firstButtonText="Обратиться в поддержку"
          secondButtonText="Назад"
          onFirstButtonClick={() => {
            router.push('/support');
          }}
          onSecondButtonClick={handleSupportModalClose}
          onClose={handleSupportModalClose}
        />
      )}

      {isCodeNotArriving && (
        <SupportModal
          title={'Код не пришел?'}
          content={''}
          firstButtonText="Обратиться в поддержку"
          secondButtonText="Назад"
          onFirstButtonClick={() => {
            router.push('/support');
          }}
          onSecondButtonClick={handleSupportModalClose}
          onClose={handleSupportModalClose}
        />
      )}
    </>
  );
};
