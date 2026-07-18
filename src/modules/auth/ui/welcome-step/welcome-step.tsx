import Image from 'next/image';
import { JSX } from 'react';
import { ButtonUI } from 'shared/ui/button';
import styles from './welcome-step.module.scss';

type WelcomeStepProps = {
  next: () => void;
};

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ next }: WelcomeStepProps): JSX.Element => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Image
          src="/images/auth/welcomeLogo.png"
          alt="Добро пожаловать"
          width={179}
          height={161}
          className={styles.image}
        />
        <h1 className={styles.title}>А-Чат</h1>
        <p className={styles.text}>
          Привет! <br /> Давай знакомиться
        </p>
      </div>
      <ButtonUI variant="general" appearance="primary" label={'Начать'} onClick={next} />
    </div>
  );
};
