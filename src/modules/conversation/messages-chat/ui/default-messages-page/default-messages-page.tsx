import clsx from 'clsx';
import { JSX } from 'react';
import { ImageUI } from 'shared/ui/image';
import styles from './default-messages-page.module.scss';
import type { DefaultMessagesPageProps } from './default-messages-page.props';

export const DefaultMessagesPage = ({ url, topText, bottomText }: DefaultMessagesPageProps): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <ImageUI src={url} alt="Дефолтный рисунок" loading="eager" width={200} height={200} className={styles.image} />
      <div className={styles.textWrapper}>
        <span className={clsx(styles.text, styles.title)}> {topText}</span>
        <span className={clsx(styles.text, styles.message)}> {bottomText}</span>
      </div>
    </div>
  );
};
