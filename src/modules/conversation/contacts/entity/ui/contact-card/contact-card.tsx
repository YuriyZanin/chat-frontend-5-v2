import clsx from 'clsx';
import { CardHeader, CardShell } from 'modules/conversation/shared/ui/card';
import React, { JSX } from 'react';
import { getLastSeenLabel } from 'shared/libs';
import { CardSelection } from './card-selection';
import styles from './contact-card.module.scss';
import { ContactCardProps } from './contact-card.props';

export const ContactCard = ({
  contact,
  selected,
  selectionMode,
  onSelectHandler,
  variant,
}: ContactCardProps): JSX.Element => {
  const { uid, chatId, fullName, nickname, avatarUrl, wasOnlineAt, isOnline } = contact;
  const status = isOnline ? 'в сети' : getLastSeenLabel(wasOnlineAt);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    if (selectionMode) {
      e.preventDefault();
      onSelectHandler?.();
    }
  };

  return (
    <CardShell
      chatId={chatId}
      nickname={nickname}
      href={`/contacts/${uid}`}
      imageOptions={{ src: avatarUrl, alt: fullName, classNames: { root: styles.imageWrapper } }}
      selected={selected}
      selectAction={handleClick}
      variant={variant}
    >
      <div className={styles.card}>
        <div className={styles.info}>
          <CardHeader title={fullName} selected={selected} />
          <div
            className={clsx(
              styles.status,
              status === 'в сети' && styles.statusOnline,
              selected && styles.statusSelected,
            )}
          >
            {status}
          </div>
        </div>
        <CardSelection visible={selectionMode} selected={selected} />
      </div>
    </CardShell>
  );
};
