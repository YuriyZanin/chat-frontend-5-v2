import { JSX } from 'react';
import styles from './outgoing-information-card-for-group.module.scss';
import type { OutgoingInformationForGroupCardProps } from './outgoing-information-card-for-group.props';
export const OutgoingInformationForGroupCard = ({
  message,
}: OutgoingInformationForGroupCardProps): JSX.Element | null => {
  if (message.content === `@@@`) return null;
  return (
    <div className={styles.box}>
      <div className={styles.wrapper}>
        <span className={styles.text}>
          {message.content === `@@@ Канал создан`
            ? message.content?.split(' ').slice(1).join(' ')
            : `${message.from_user.first_name} ${message.from_user.last_name} ${message.content?.split(' ').slice(1).join(' ')}`}
        </span>
      </div>
    </div>
  );
};
