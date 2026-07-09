import { JSX } from 'react';
import styles from './incoming-information-card-for-group.module.scss';
import type { IncomingInformationForGroupCardProps } from './incoming-information-card-for-group.props';
export const IncomingInformationForGroupCard = ({
  message,
  register,
}: IncomingInformationForGroupCardProps): JSX.Element | null => {
  if (message.content === `@@@`) return null;
  return (
    <div
      className={styles.box}
      ref={(el) => {
        register(el, message);
      }}
    >
      <div className={styles.wrapper}>
        <span className={styles.text}>{message.content?.split(' ').slice(1).join(' ')}</span>
      </div>
    </div>
  );
};
