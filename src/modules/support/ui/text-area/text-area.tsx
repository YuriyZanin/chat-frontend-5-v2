import { useTextArea } from '../../lib/text-area/use-text-area';
import styles from './text-area.module.scss';

type TextAreaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  value,
  onChange,
  maxLength = 500,
  placeholder = '',
  disabled = false,
  className = '',
}: TextAreaProps) => {
  const { handleChange, handleFocus, handleBlur, isFocused } = useTextArea({
    value,
    onChange,
    maxLength,
    disabled,
  });

  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <textarea
        className={`${styles.textarea} ${className} ${isFocused ? styles.focused : ''} ${disabled ? styles.disabled : ''}`}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        rows={6}
        aria-label={label}
      />
    </div>
  );
};
