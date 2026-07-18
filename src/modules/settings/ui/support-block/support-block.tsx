'use client';
import { SupportMessageForm } from 'modules/support/ui/support-message-form';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { JSX, useCallback } from 'react';
import styles from './support-block.module.scss';

export const SupportBlock: React.FC = ({}): JSX.Element => {
  const router = useRouter();

  const handleReturnButton = useCallback((): void => {
    router.push('/settings');
  }, [router]);

  return (
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
          <span className={styles.labelText}>Обращение в поддержку</span>
        </div>
      </button>
      <div className={styles.formContainer}>
        <SupportMessageForm
          message={''}
          login={''}
          onMessageChange={() => {}}
          onLoginChange={() => {}}
          onSubmit={() => {}}
          className="noBorder"
        />
      </div>
    </div>
  );
};
