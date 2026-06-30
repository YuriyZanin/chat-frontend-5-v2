import { JSX } from 'react';
import styles from './incoming-information-card-for-group.module.scss';
import type { IncomingInformationForGroupCardProps } from './incoming-information-card-for-group.props';
export const IncomingInformationForGroupCard = ({
  message,
  register,
}: IncomingInformationForGroupCardProps): JSX.Element => {
  return (
    <div
      className={styles.box}
      ref={(el) => {
        register(el, message);
      }}
    >
      <div className={styles.wrapper}>
        <span className={styles.text}>
          {`${message.from_user.first_name} ${message.from_user.last_name} ${message.content?.split(' ').slice(1).join(' ')}`}
        </span>
      </div>
    </div>
  );
};
