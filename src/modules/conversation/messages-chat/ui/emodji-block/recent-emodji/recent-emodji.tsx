import { JSX } from 'react';
import styles from './recent-emodji.module.scss';
import type { RecentEmojiProps } from './recent-emodji.props';

export const RecentEmodji = ({ recentEmojisStore, handleEmojiSelect }: RecentEmojiProps): JSX.Element => {
  return (
    <>
      <div className={styles.title}>
        <div className={styles.text}>Недавние</div>
      </div>
      <div className={styles.recentEmodji}>
        {recentEmojisStore.length &&
          recentEmojisStore.map((emoji, index) => (
            <div key={index} className={styles.emodji}>
              <button onClick={() => handleEmojiSelect(emoji)}>{emoji}</button>
            </div>
          ))}
      </div>
    </>
  );
};
