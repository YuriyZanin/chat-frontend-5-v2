import { JSX } from 'react';
import { useCodeInputLogic } from '../../lib/code-input/use-code-input-logic';
import styles from './code-input.module.scss';

type CodeInputProps = {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  disabled?: boolean;
};

export const CodeInput: React.FC<CodeInputProps> = ({
  label,
  value,
  onChange,
  error,
  disabled = false,
}: CodeInputProps): JSX.Element => {
  const { focusedIndex, handleChange, handleFocus, handleBlur, handleKeyDown, isValid, isComplete } = useCodeInputLogic(
    { value, onChange, disabled },
  );

  let errorMessage = error;
  if (!errorMessage && value.some((digit) => digit && !/^\d$/.test(digit))) {
    errorMessage = 'Используйте только цифры';
  }
  if (!errorMessage && isValid === false && isComplete) {
    errorMessage = 'Некорректный код';
  }

  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      {errorMessage && <span className={styles.errorMessage}>{errorMessage}</span>}
      <div className={styles.inputsWrapper}>
        {value.map((digit, index) => (
          <input
            key={index}
            id={`code-input-${index}`}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={digit}
            onChange={handleChange(index)}
            onFocus={handleFocus(index)}
            onBlur={handleBlur()}
            onKeyDown={handleKeyDown(index)}
            className={`${styles.codeInput} ${
              focusedIndex === index ? styles.focused : ''
            } ${errorMessage ? styles.error : ''} ${disabled ? styles.disabled : ''}`}
            placeholder="0"
            autoComplete="off"
            disabled={disabled}
            aria-label={`Цифра ${index + 1} кода`}
          />
        ))}
      </div>
    </div>
  );
};
