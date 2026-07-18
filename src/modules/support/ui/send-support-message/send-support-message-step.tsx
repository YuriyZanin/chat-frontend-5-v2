import Image from 'next/image';
import { JSX, useState } from 'react';
import { SupportMessageForm } from '../support-message-form';
import styles from './send-support-message-step.module.scss';

type SendSupportMessageStepProps = {
  next: () => void;
  prev: () => void;
};

export const SendSupportMessageStep: React.FC<SendSupportMessageStepProps> = ({
  next,
  prev,
}: SendSupportMessageStepProps): JSX.Element => {
  const [message, setMessage] = useState<string>('');
  const [login, setLogin] = useState<string>('');
  const handleTextareaChange = (value: string): void => {
    setMessage(value);
  };

  const handleLoginChange = (value: string): void => {
    setLogin(value);
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    next();
    console.log('Сообщение поддержке:', message);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <button className={styles.arrowButton} onClick={prev}></button>
            <Image
              src="/images/auth/welcomeLogo.png"
              alt="Служба поддержки"
              width={70}
              height={70}
              className={styles.image}
            />
          </div>
          <h1 className={styles.title}>Служба поддержки</h1>
        </div>

        <SupportMessageForm
          message={message}
          login={login}
          onMessageChange={handleTextareaChange}
          onLoginChange={handleLoginChange}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
};
