import clsx from 'clsx';
import { CardHeader, CardShell } from 'modules/conversation/shared/ui/card';
import { useUnblockUserMutation } from 'modules/info/api/info.query';
import Image from 'next/image';
import React, { JSX } from 'react';
import { getLastSeenLabel } from 'shared/libs';
import styles from './contact-card.module.scss';
import { ContactCardProps } from './contact-card.props';

export const ContactCard = ({ contact, selected, selectionMode, onSelectHandler }: ContactCardProps): JSX.Element => {
  const { uid, fullName, avatarUrl, wasOnlineAt } = contact;
  const status = getLastSeenLabel(wasOnlineAt);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    if (selectionMode) {
      onSelectHandler?.();
    }
  };

  const { mutate: unblockUser } = useUnblockUserMutation(uid);

  const unblockUserHandler = (): void => {
    unblockUser();
    console.log('разблокирован ' + uid);
  };
  return (
    <CardShell
      href={`/chats/${uid}`}
      imageOptions={{ src: avatarUrl, alt: fullName, classNames: { root: styles.imageWrapper } }}
      selected={selected}
      selectAction={handleClick}
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
        <button className={''} onClick={unblockUserHandler}>
          <Image src={'/images/settings/blackListTrashIcon.svg'} alt="" width={14} height={18} className={''} />
        </button>
      </div>
    </CardShell>
  );
};
