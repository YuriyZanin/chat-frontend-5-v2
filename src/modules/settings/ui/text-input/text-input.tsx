import { JSX } from 'react';
import { useTextInputLogic } from '../../lib/text-input/use-text-input-logic';
import styles from './text-input.module.scss';

type TextInputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  maxLength?: number;
};

export const TextInput = ({
  label,
  placeholder = '',
  value,
  onChange,
  error,
  disabled = false,
  maxLength = 30,
}: TextInputProps): JSX.Element => {
  const { isFocused, handleChange, handleFocus, handleBlur } = useTextInputLogic({
    value,
    onChange,
    disabled,
    maxLength,
  });

  const errorMessage = error;

  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`${styles.textInput} ${
          isFocused ? styles.focused : ''
        } ${errorMessage ? styles.error : ''} ${disabled ? styles.disabled : ''}`}
        maxLength={maxLength}
        disabled={disabled}
        aria-label={label || placeholder}
      />
      {errorMessage && <span className={styles.errorMessage}>{errorMessage}</span>}
    </div>
  );
};
