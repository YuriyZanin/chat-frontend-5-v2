import Image from 'next/image';
import { JSX } from 'react';
import { ButtonUI } from 'shared/ui/button';
import { useNameStep } from '../../lib/steps/use-name-step';
import { TextInput } from '../text-input';
import styles from './name-step.module.scss';

type NameStepProps = {
  next: () => void;
  prev: () => void;
};

export const NameStep: React.FC<NameStepProps> = ({ next, prev }: NameStepProps): JSX.Element => {
  const {
    firstName,
    login,
    firstNameError,
    loginError,
    isFormValid,
    isSubmitting,
    isNameTouched,
    isLoginTouched,
    handleIsNameTouched,
    handleIsLoginTouched,
    handleFirstNameChange,
    handleLoginChange,
    handleSubmit,
  } = useNameStep({ next });

  {
    console.log('BUTTON STATE:', { isFormValid, isSubmitting });
  }

  return (
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
        <h1 className={styles.title}>Личная информация</h1>
      </div>
      <p className={styles.text}>Пожалуйста, заполните данные</p>

      <form onSubmit={handleSubmit} className={styles.profileForm}>
        <div className={styles.inputsContainer}>
          <TextInput
            label="Введите имя"
            placeholder=""
            value={firstName}
            onChange={handleFirstNameChange}
            error={firstNameError}
            maxLength={30}
            onBlur={handleIsNameTouched}
          />
          <TextInput
            label="Введите никнейм"
            placeholder=""
            value={login}
            onChange={handleLoginChange}
            error={loginError}
            maxLength={30}
            onBlur={handleIsLoginTouched}
          />
        </div>
        <div className={styles.buttonContainer}>
          <p className={styles.agreementText}>
            Нажимая на «Зарегистрироваться», вы соглашаетесь
            <br /> с{' '}
            <a href="" className={styles.link}>
              Пользовательским соглашением
            </a>
          </p>
          <ButtonUI
            variant="general"
            appearance={!isFormValid || isSubmitting ? 'disabled' : 'primary'}
            label={isSubmitting ? 'Проверка...' : 'Зарегистрироваться'}
            type="submit"
            disabled={!isFormValid || isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};
