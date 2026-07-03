// components/dual-input/dual-input.tsx
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';
import { useDualInput } from '../../lib/dual-input/use-dual-input';
import styles from './dual-input.module.scss';

type DualInputProps = {
  maxFirst?: number;
  maxSecond?: number;
  placeholderFirst?: string;
  placeholderSecond?: string;
  valueFirst?: string;
  valueSecond?: string;
  onChangeFirst?: (value: string) => void;
  onChangeSecond?: (value: string) => void;
};

const DualInput: React.FC<DualInputProps> = ({
  maxFirst = 50,
  maxSecond = 100,
  placeholderFirst = 'Название',
  placeholderSecond = 'Описание',
  valueFirst = '',
  valueSecond = '',
  onChangeFirst,
  onChangeSecond,
}) => {
  const {
    firstFocused,
    secondFocused,
    firstLength,
    secondLength,
    setFirstLength,
    setSecondLength,
    handleFirstFocus,
    handleFirstBlur,
    handleSecondFocus,
    handleSecondBlur,
    handleClearFirst,
    handleClearSecond,
  } = useDualInput({
    maxFirst,
    maxSecond,
    initialFirst: valueFirst,
    initialSecond: valueSecond,
  });

  const firstTextareaRef = useRef<HTMLTextAreaElement>(null);
  const secondTextareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustFirstHeight = (): void => {
    const textarea = firstTextareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const adjustSecondHeight = (): void => {
    const textarea = secondTextareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustFirstHeight();
  }, [valueFirst]);

  useEffect(() => {
    adjustSecondHeight();
  }, [valueSecond]);

  const onFirstChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const newValue = e.target.value;
    if (newValue.length <= maxFirst) {
      onChangeFirst?.(newValue);
      setFirstLength(newValue.length);
    }
  };

  const onSecondChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const newValue = e.target.value;
    if (newValue.length <= maxSecond) {
      onChangeSecond?.(newValue);
      setSecondLength(newValue.length);
    }
  };

  const onClearFirst = (): void => {
    handleClearFirst();
    onChangeFirst?.('');
  };

  const onClearSecond = (): void => {
    handleClearSecond();
    onChangeSecond?.('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.fieldContainer}>
        <div className={`${styles.inputWrapper} ${firstFocused ? styles.focused : ''}`}>
          <label className={`${styles.label} ${firstFocused || valueFirst ? styles.labelActive : ''}`}>
            {placeholderFirst}
          </label>
          <textarea
            ref={firstTextareaRef}
            value={valueFirst}
            onChange={onFirstChange}
            onFocus={handleFirstFocus}
            onBlur={handleFirstBlur}
            className={styles.input}
            rows={1}
          />
          {firstFocused && (
            <>
              <span className={firstLength === maxFirst ? styles.counterRed : styles.counter}>
                {firstLength}/{maxFirst}
              </span>
              {valueFirst && (
                <button
                  type="button"
                  className={styles.clearButton}
                  onClick={onClearFirst}
                  onMouseDown={(e) => e.preventDefault()}
                  aria-label="Очистить"
                >
                  <Image src="/images/new-group/clearIcon.svg" alt="" width={16} height={16} />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.fieldContainer}>
        <div className={`${styles.inputWrapper} ${secondFocused ? styles.focused : ''}`}>
          <label className={`${styles.label} ${secondFocused || valueSecond ? styles.labelActive : ''}`}>
            {placeholderSecond}
          </label>
          <textarea
            ref={secondTextareaRef}
            value={valueSecond}
            onChange={onSecondChange}
            onFocus={handleSecondFocus}
            onBlur={handleSecondBlur}
            className={styles.input}
            rows={1}
          />
          {secondFocused && (
            <>
              <span className={secondLength === maxSecond ? styles.counterRed : styles.counter}>
                {secondLength}/{maxSecond}
              </span>
              {valueSecond && (
                <button
                  type="button"
                  className={styles.clearButton}
                  onClick={onClearSecond}
                  onMouseDown={(e) => e.preventDefault()}
                  aria-label="Очистить"
                >
                  <Image src="/images/new-group/clearIcon.svg" alt="" width={16} height={16} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DualInput;
