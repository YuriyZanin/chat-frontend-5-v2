import Image from 'next/image';
import { JSX } from 'react';
import { ButtonUI } from 'shared/ui/button';
import styles from './support-message-sent-step.module.scss';

type SupportMessageSentStepProps = {
  next: () => void;
  prev: () => void;
};

export const SupportMessageSentStep: React.FC<SupportMessageSentStepProps> = ({
  next,
  prev,
}: SupportMessageSentStepProps): JSX.Element => {
  return (
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
        <Image src="/images/support/check.svg" alt="Служба поддержки" width={70} height={70} className={styles.image} />
        <p className={styles.title2}>Обращение отправлено!</p>
        <p className={styles.text}>В ближайшее время вы получите ответ на электронную почту, указанную в обращении</p>
      </div>

      <ButtonUI variant="general" appearance="primary" label="На главную" type="submit" onClick={next} />
    </div>
  );
};
