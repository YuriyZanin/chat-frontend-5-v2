'use client';
import { JSX, useState } from 'react';
import { faceSmilingArray } from '../../utils/emojis-array';
import styles from './emodji-block.module.scss';
import type { EmodjiBlockProps } from './emodji-block.props';
import { MessageField } from './message-field/message-field';
import { RecentEmodji } from './recent-emodji/recent-emodji';
import { Smileys } from './smileys/smileys';

export const EmodjiBlock = ({ handleEmojiSelect, recentEmojisStore, position }: EmodjiBlockProps): JSX.Element => {
  const [selectedSmileys, setSelectedSmileys] = useState<string[]>(faceSmilingArray);
  const stopPropagation = (e: React.MouseEvent): void => {
    e.stopPropagation();
  };
  return (
    <div
      className={styles.wrapper}
      style={{ top: position.y, left: position.x }}
      onClick={stopPropagation}
      onMouseDown={stopPropagation}
    >
      <div className={styles.containerScroll}>
        {!!recentEmojisStore.length && (
          <RecentEmodji recentEmojisStore={recentEmojisStore} handleEmojiSelect={handleEmojiSelect} />
        )}
        <Smileys handleEmojiSelect={handleEmojiSelect} selectedSmileys={selectedSmileys} />
      </div>
      <MessageField recentEmojisStore={recentEmojisStore} setSelectedSmileys={setSelectedSmileys} />
    </div>
  );
};
