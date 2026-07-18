import { JSX } from 'react';
import styles from './smileys.module.scss';
import type { SmileysProps } from './smileys.props';

export const Smileys = ({ handleEmojiSelect, selectedSmileys }: SmileysProps): JSX.Element => {
  return (
    <>
      <div className={styles.title}>
        <div className={styles.text}>Эмоции</div>
      </div>
      <div className={styles.smileysContainer}>
        {selectedSmileys.map((emoji, index) => (
          <div key={index} className={styles.emodji}>
            <button onClick={() => handleEmojiSelect(emoji)}>{emoji}</button>
          </div>
        ))}
      </div>
    </>
  );
};
