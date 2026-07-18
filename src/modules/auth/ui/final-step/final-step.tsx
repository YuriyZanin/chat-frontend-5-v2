import Image from 'next/image';
import { JSX } from 'react';
import { ButtonUI } from 'shared/ui/button';
import styles from './final-step.module.scss';

type FinalStepProps = {
  next: () => void;
};

export const FinalStep: React.FC<FinalStepProps> = ({ next }: FinalStepProps): JSX.Element => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Image src="/images/auth/welcomeLogo.png" alt="Поздравляем" width={179} height={161} className={styles.image} />
        <h1 className={styles.title}>Поздравляем!</h1>
        <p className={styles.text}>Регистрация прошла успешно!</p>
      </div>
      <ButtonUI variant="general" appearance="primary" label={'Начать'} onClick={next} />
    </div>
  );
};
