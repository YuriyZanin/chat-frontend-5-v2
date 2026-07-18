'use client';
import clsx from 'clsx';
import { useForAllDeleteStore } from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import { JSX, useEffect, useState } from 'react';
import styles from './alert-delete.module.scss';
import type { AlertDeleteProps, CheckBoxProps } from './alert-delete.props';
export const AlertDelete = ({
  id,
  title,
  message,
  okText = 'Удалить',
  cancelText = 'Отмена',
  showCheckBox = false,
  labelCheckBox,
  onOk,
  onCancel,
}: AlertDeleteProps): JSX.Element => {
  return (
    <div
      id={`${id}`}
      role="dialog"
      className={styles.wrapperIncoming}
      aria-modal="true"
      aria-labelledby={`alert_title_${id}`}
    >
      <div className={styles.contentIncoming}>
        <div className={styles.titleIncoming}>{title}</div>
        <div className={styles.textIncoming}>{message}</div>
      </div>
      {showCheckBox && <CheckBox labelCheckBox={labelCheckBox} />}
      <div className={styles.buttonsBlock}>
        <button className={styles.buttonCancel} onClick={onCancel}>
          <div className={clsx(styles.textButton, styles.textButton)}>{cancelText}</div>
        </button>
        <button className={styles.buttonDelete} onClick={onOk}>
          <div className={clsx(styles.textButton, styles.textButton)}>{okText}</div>
        </button>
      </div>
    </div>
  );
};

const CheckBox = ({ labelCheckBox }: CheckBoxProps): JSX.Element => {
  const [selected, setSelected] = useState<boolean>(true);
  const setForAllDeleteStore = useForAllDeleteStore((s) => s.setForAllDelete);
  useEffect(() => setForAllDeleteStore(selected), [selected, setForAllDeleteStore]);

  const handleChange = (): void => {
    setSelected(!selected);
  };
  return (
    <div className={styles.checkBox}>
      <input
        id="delete"
        name="delete"
        type="checkbox"
        className={styles.check}
        checked={selected}
        onChange={() => handleChange()}
        aria-describedby="Удалить у всех"
      />
      <label htmlFor="delete" className={styles.labelCheck}>
        {labelCheckBox}
      </label>
    </div>
  );
};
