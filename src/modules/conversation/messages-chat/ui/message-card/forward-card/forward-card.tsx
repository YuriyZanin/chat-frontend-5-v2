'use client';
import Image from 'next/image';
import Link from 'next/link';
import { JSX } from 'react';
import styles from './forward-card.module.scss';
import type { CardProps, ForwardCardProps } from './forward-card.props';
export const ForvardCard = ({ message, currentUserId }: ForwardCardProps): JSX.Element => {
  return (
    <>
      {message?.forwarded_messages[0].from_user !== currentUserId ? (
        <Link href={`/chats/${message?.forwarded_messages[0].from_user}`}>
          <Card message={message} />
        </Link>
      ) : (
        <Card message={message} />
      )}
    </>
  );
};

const Card = ({ message }: CardProps): JSX.Element => {
  return (
    <div className={styles.userBlock}>
      <div className={styles.text1}>Переслано от</div>
      <div className={styles.forwardFrom}>
        <div className={styles.avatar}>
          {message?.forwarded_messages[0].avatar_webp_url ? (
            <Image src={message?.forwarded_messages[0].avatar_webp_url} alt="Аватар" width={18} height={18} />
          ) : (
            <Image src="/images/messages-chats/default-avatar.svg" alt="Дефолтный Аватар" width={18} height={18} />
          )}
        </div>
        <div className={styles.text2}>
          {` ${message?.forwarded_messages[0].first_name} ${message?.forwarded_messages[0].last_name}`}
        </div>
      </div>
    </div>
  );
};
