import { JSX } from 'react';
import { usePhoneInput } from '../../lib/phone-input/use-phone-input';
import styles from './phone-number-input.module.scss';

type PhoneNumberInputProps = {
  onChange?: (value: string) => void;
  onValidationChange?: (isValid: boolean, isFilled: boolean) => void;
};

export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  onChange,
  onValidationChange,
}: PhoneNumberInputProps): JSX.Element => {
  const { value, error, isFocused, handleChange, handleFocus, handleBlur } = usePhoneInput({
    onChange,
    onValidationChange,
  });

  let labelText = 'Введите номер телефона';
  if (!isFocused) {
    if (value.trim() === '') {
      labelText = 'Введите номер телефона';
    } else if (error) {
      labelText = error;
    } else if (!error) {
      labelText = 'Измените номер';
    }
  }

  const placeholderText = '+7 900 000 00 00';

  return (
    <div className={styles.inputWrapper}>
      <label className={styles.label}>{labelText}</label>
      <input
        type="tel"
        placeholder={value ? '' : placeholderText}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`${styles.phoneInput} ${error ? styles.error : ''}`}
      />
    </div>
  );
};
