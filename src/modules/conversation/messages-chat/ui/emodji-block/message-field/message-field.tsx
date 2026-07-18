import {
  achievementSmilingArray,
  animalsSmilingArray,
  calculatorSmilingArray,
  faceSmilingArray,
  foodSmilingArray,
  natureSmilingArray,
  peopleSmilingArray,
  signalSmilingArray,
} from 'modules/conversation/messages-chat/utils/emojis-array';
import { JSX, useState } from 'react';
import Icon1 from './icons/icon1.svg';
import Icon2 from './icons/icon2.svg';
import Icon3 from './icons/icon3.svg';
import Icon4 from './icons/icon4.svg';
import Icon5 from './icons/icon5.svg';
import Icon6 from './icons/icon6.svg';
import Icon7 from './icons/icon7.svg';
import Icon8 from './icons/icon8.svg';
import Icon9 from './icons/icon9.svg';
import styles from './message-field.module.scss';
import type { MessageFieldProps } from './message-field.props';

export const MessageField = ({ recentEmojisStore, setSelectedSmileys }: MessageFieldProps): JSX.Element => {
  // Состояние для активной кнопки (индекс)
  const [activeButtonIndex, setActiveButtonIndex] = useState<number>(
    recentEmojisStore.length ? 0 : 1, // По умолчанию первая кнопка
  );
  const handlerOnClick = (smileysArray: string[], index: number, e: React.MouseEvent): void => {
    e.stopPropagation();
    e.preventDefault();
    setActiveButtonIndex(index); // Устанавливаем активную кнопку
    setSelectedSmileys(smileysArray);
  };

  const emojisArraysField = [
    {
      iconButton: <Icon1 />,
      smilingArray: faceSmilingArray,
    },
    {
      iconButton: <Icon2 />,
      smilingArray: faceSmilingArray,
    },
    {
      iconButton: <Icon3 />,
      smilingArray: peopleSmilingArray,
    },
    {
      iconButton: <Icon4 />,
      smilingArray: animalsSmilingArray,
    },
    {
      iconButton: <Icon5 />,
      smilingArray: foodSmilingArray,
    },
    {
      iconButton: <Icon6 />,
      smilingArray: natureSmilingArray,
    },
    {
      iconButton: <Icon7 />,
      smilingArray: achievementSmilingArray,
    },
    {
      iconButton: <Icon8 />,
      smilingArray: calculatorSmilingArray,
    },
    {
      iconButton: <Icon9 />,
      smilingArray: signalSmilingArray,
    },
  ];
  return (
    <>
      <div className={styles.wrapper}>
        {emojisArraysField.map((emojisArray, index) => {
          if (recentEmojisStore.length === 0 && index === 0) return;
          return (
            <button key={index} onClick={(e) => handlerOnClick(emojisArray.smilingArray, index, e)}>
              <div className={activeButtonIndex === index ? styles.iconContainerActive : styles.iconContainer}>
                {emojisArray.iconButton}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
};
