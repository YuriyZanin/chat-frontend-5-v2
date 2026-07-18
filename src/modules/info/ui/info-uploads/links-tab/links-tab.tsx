'use client';
import { useSearchUsersQuery } from 'modules/conversation/contacts/api';
import { getMessageTimeOrDate } from 'modules/conversation/messages-chat/lib/get-message-time';
import type { MessageLinkApi } from 'modules/info/model/info.api.schema';
import { useInfoStore } from 'modules/info/model/info.store';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import { JSX } from 'react';
import { CircularProgressLabel } from '../circular-progress-label';
import styles from './links-tab.module.scss';
import { LinksTabProps } from './links-tab.props';

export const LinksTab = ({ items }: LinksTabProps): JSX.Element => {
  // текущий домен
  const baseUrl = window.location.origin;
  const router = useRouter();
  return (
    <div className={styles.container}>
      <ul className={styles.linkList}>
        {items?.map((item) => (
          <li key={item.message_id} className={styles.listItem}>
            {item.url.includes(baseUrl) && item.url.startsWith('http') ? (
              <LinksCars item={item} router={router} />
            ) : (
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
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
const LinksCars = ({ item, router }: { item: MessageLinkApi; router: AppRouterInstance }): JSX.Element => {
  const nickname = item.url && item.url.split('/').pop();
  const { data: userProfile } = useSearchUsersQuery(nickname ?? '');
  const { setIsInfoOpen } = useInfoStore();
  const handleContactProfile = (): void => {
    router.push(`/contacts/${userProfile?.length ? userProfile[0].uid : ''}`);
    setIsInfoOpen(true);
  };
  return (
    <>
      <div className={styles.link} onClick={handleContactProfile}>
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
    </>
  );
};
