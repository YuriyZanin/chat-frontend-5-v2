'use client';
import { JSX } from 'react';
import styles from './default-chats-list.module.scss';
import DefaultImage from './img/img_search.svg';

export const DefaultChatsList = (): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.image}>
        <DefaultImage />
      </div>
      <div className={styles.textBlock}>
        <div className={styles.title}>Поиск не дал результатов</div>
        <div className={styles.description}>
          <div className={styles.text}>По вашему запросу ничего не найдено.</div>
          <div className={styles.text}>Измените запрос и попробуйте снова</div>
        </div>
      </div>
    </div>
  );
};
