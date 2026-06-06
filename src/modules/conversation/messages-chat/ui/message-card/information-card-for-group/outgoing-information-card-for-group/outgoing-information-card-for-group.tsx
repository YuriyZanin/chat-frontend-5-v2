import { JSX } from 'react';
import styles from './outgoing-information-card-for-group.module.scss';
import type { OutgoingInformationForGroupCardProps } from './outgoing-information-card-for-group.props';
export const OutgoingInformationForGroupCard = ({ message }: OutgoingInformationForGroupCardProps): JSX.Element => {
  return (
    <div className={styles.box}>
      <div className={styles.wrapper}>
        <span className={styles.text}> {message.content?.split(' ').slice(1).join(' ')} </span>
      </div>
    </div>
  );
};
