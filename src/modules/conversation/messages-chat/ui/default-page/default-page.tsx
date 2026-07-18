import { JSX } from 'react';
import styles from './default-page.module.scss';

export const DefaultPage = (): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.textWrapper}>Выберите контакт для начала общения</span>
    </div>
  );
};
