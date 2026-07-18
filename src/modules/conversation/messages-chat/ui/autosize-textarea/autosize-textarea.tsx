import React, { JSX, useCallback, useEffect } from 'react';
import styles from './autosize-textarea.module.scss';
import type { AutosizeTextareaProps } from './autosize-textarea.props';

export const AutosizeTextarea = ({
  maxHeight = 472,
  style,
  onInput,
  inputRef,
  isScroll,
  ...props
}: AutosizeTextareaProps): JSX.Element => {
  //const ref = useRef<HTMLTextAreaElement | null>(null);
  const resize = useCallback(
    (isScroll: boolean) => {
      const el = inputRef.current;
      if (!el) return;
      // сброс высоты чтобы правильно вычислить scrollHeight
      el.style.height = 'auto';
      const scrollHeight = el.scrollHeight;
      const newHeight = Math.min(scrollHeight, maxHeight);
      el.style.height = `${newHeight}px`;
      // при достижении maxHeight включаем вертикальную прокрутку, иначе скрываем полосу
      if (isScroll) {
        el.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
      }
    },
    [maxHeight, inputRef],
  );

  useEffect(() => {
    resize(isScroll); // подгонка при монтировании/значениях по умолчанию
    // также подгоняем при ресайзе окна (опционально)
    window.addEventListener('resize', () => resize(isScroll));
    return (): void => window.removeEventListener('resize', () => resize(isScroll));
  }, [resize]);

  // вызываем resize при вводе — сохраняем возможность внешнего onInput
  const handleInput: React.FormEventHandler<HTMLTextAreaElement> = (e) => {
    resize(isScroll);
    if (onInput) onInput(e);
  };
  useEffect(() => {
    resize(isScroll);
  }, [props.value, resize]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key !== 'Enter') return;
    // Shift+Enter => обычный перенос строки в textarea
    if (e.shiftKey) return;
    // Обычный Enter => submit
    e.preventDefault();
    // вызвать submit через ближайшую форму
    const form = e.currentTarget.form;
    form?.requestSubmit?.(); // modern
    if (!form?.requestSubmit) form?.submit(); // fallback
  };
  return (
    <textarea
      className={styles.textarea}
      ref={inputRef}
      rows={1}
      style={{ resize: 'none', ...style }}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
};
