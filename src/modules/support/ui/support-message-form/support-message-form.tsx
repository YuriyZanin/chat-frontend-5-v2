import { TextInput } from 'modules/auth';
import { TextArea } from 'modules/support/ui/text-area';
import { JSX } from 'react';
import { ButtonUI } from 'shared/ui/button';
import styles from './support-message-form.module.scss';

type SupportMessageFormProps = {
  message: string;
  login: string;
  onMessageChange: (value: string) => void;
  onLoginChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isDisabled?: boolean;
  className?: string;
};

export const SupportMessageForm: React.FC<SupportMessageFormProps> = ({
  message,
  login,
  onMessageChange,
  onLoginChange,
  onSubmit,
  isDisabled = false,
  className = '',
}: SupportMessageFormProps): JSX.Element => {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.inputsContainer}>
        <TextInput
          label="Введите никнейм"
          placeholder=""
          value={login}
          onChange={onLoginChange}
          error={''}
          maxLength={30}
          disabled={isDisabled}
          className={className && 'noBorder'}
        />

        <TextArea
          label="Опишите Вашу проблему"
          value={message}
          onChange={onMessageChange}
          maxLength={500}
          placeholder="Напишите подробнее..."
          disabled={isDisabled}
          className={className && 'noBorder'}
        />
      </div>
      <div className={styles.buttonContainer}>
        <p className={styles.agreementText}>
          Ознакомьтесь со
          <a href="" className={styles.link}>
            списком известных проблем
            <br />и их решениями
          </a>
        </p>
        <ButtonUI variant="general" appearance="primary" label="Отправить" type="submit" disabled={isDisabled} />
      </div>
    </form>
  );
};
