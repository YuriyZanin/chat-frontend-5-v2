import clsx from 'clsx';
import { JSX } from 'react';
import styles from './button.module.scss';
import type { ButtonProps, ButtonVariant } from './button.props';

/**
 * Универсальный компонент кнопки с полной типизацией вариантов и стилей.
 *
 * @typeParam V — Тип варианта кнопки: 'general' или 'modal'.
 *
 * @param props
 * @param props.label Текст, отображаемый на кнопке.
 * @param props.variant Категория кнопки:
 * - 'general' - стандартные кнопки интерфейса
 * - 'modal' - кнопки для модальных окон
 * @param props.appearance Стиль кнопки внутри выбранного варианта:
 *   - Для general: 'primary' | 'secondary' | 'disabled' | 'pending'
 *   - Для modal: 'primary' | 'primaryLarge' | 'secondary' | 'error'
 *
 * @example
 * <ButtonUI variant="general" appearance="primary" label="Сохранить" />
 * <ButtonUI variant="modal" appearance="error" label="Удалить" disabled />
 *
 * @remarks
 * Поддерживает все стандартные HTML-атрибуты кнопки
 *
 * @return {JSX.Element}
 */
export const ButtonUI = <V extends ButtonVariant>({
  spinner,
  label,
  variant,
  appearance,
  ...props
}: ButtonProps<V>): JSX.Element => {
  const mode = variant === 'general' ? 'btnGeneral' : 'btnModal';

  return (
    <button className={clsx(styles[mode], styles[appearance])} {...props}>
      {spinner ? (
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
        </div>
      ) : (
        <>{label}</>
      )}
    </button>
  );
};
