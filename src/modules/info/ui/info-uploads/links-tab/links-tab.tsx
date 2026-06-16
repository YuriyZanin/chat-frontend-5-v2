import { getMessageTimeOrDate } from 'modules/conversation/messages-chat/lib/get-message-time';
import { JSX } from 'react';
import { CircularProgressLabel } from '../circular-progress-label';
import styles from './links-tab.module.scss';
import { LinksTabProps } from './links-tab.props';

export const LinksTab = ({ items }: LinksTabProps): JSX.Element => {
  console.log('linksList: ', items);
  return (
    <div className={styles.container}>
      <ul className={styles.linkList}>
        {items?.map((item) => (
          <li key={item.message_id} className={styles.listItem}>
            <a href={item.url} target="blank">
              <div className={styles.link}>
                <CircularProgressLabel borderRadius={4}>
                  <div className={styles.label}>{item.title[0]}</div>
                </CircularProgressLabel>
                <div className={styles.linkInfo}>
                  <div className={styles.linkTitle}>{item.title}</div>
                  <div className={styles.linkUrl}>{item.url}</div>
                  <div className={styles.linkDescription}>
                    <div className={styles.user}>{`${item.from_user.first_name} ${item.from_user.last_name}`}</div>
                    <div className={styles.dot}>•</div>
                    <div className={styles.date}>{getMessageTimeOrDate(item.created_at)}</div>
                  </div>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
