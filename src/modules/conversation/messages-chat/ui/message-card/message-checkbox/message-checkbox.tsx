import { JSX } from 'react';
import styles from './message-checkbox.module.scss';
import { MessageCheckBoxProps } from './message-checkbox.props';

export const MessageCheckBox = ({ message, selected, handleCheckBoxClick }: MessageCheckBoxProps): JSX.Element => {
  return (
    <div className={styles.checkBox}>
      <input
        id={message.uid}
        name={message.uid}
        type="checkbox"
        className={styles.check}
        checked={selected ?? false}
        onChange={() => handleCheckBoxClick()}
        aria-describedby="Выбрать сообщение"
      />
    </div>
  );
};
