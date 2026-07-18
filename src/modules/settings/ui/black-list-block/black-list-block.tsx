'use client';

import { Contact } from 'modules/conversation/contacts/entity';
import { DeleteSelectedContactsButton } from 'modules/conversation/contacts/features/contacts-selection';
import { ConversationLayout, SearchInput } from 'modules/conversation/shared/ui';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { JSX, useCallback } from 'react';
import { BlacklistedUser } from 'shared/api/blacklist.api';
import { useGetBlacklist } from 'shared/query/blacklist.query';
import { ContactCard } from '../contact-card';
import styles from './black-list-block.module.scss';

export const BlackListBlock: React.FC = (): JSX.Element => {
  const router = useRouter();
  const { data: blacklistUsers, isLoading, error } = useGetBlacklist();

  console.log('BlackListBlock рендерится', blacklistUsers);

  const handleReturnButton = useCallback((): void => {
    router.push('/settings');
  }, [router]);

  const mapApiProfileToContact = (apiProfile: BlacklistedUser): Contact => {
    return {
      uid: apiProfile.uid,
      firstName: apiProfile.first_name,
      lastName: apiProfile.last_name,
      nickname: apiProfile.nickname,
      isOnline: apiProfile.is_online,
      chatId: undefined,
      fullName: `${apiProfile.first_name} ${apiProfile.last_name}`.trim(),
      avatarUrl: apiProfile.avatar_url || apiProfile.avatar || '',
      wasOnlineAt: apiProfile.was_online_at,
    };
  };

  return (
    <div className={styles.container}>
      <button type="button" className={styles.returnButton} onClick={handleReturnButton}>
        <div className={styles.iconAndLabelContainer}>
          <Image
            src="/images/settings/returnArrowIcon.svg"
            alt=""
            width={21}
            height={21}
            className={styles.returnIcon}
          />
          <span className={styles.labelText}>Черный список</span>
        </div>
      </button>
      <ConversationLayout
        header={<SearchInput query={''} onChange={() => {}} />}
        footer={<DeleteSelectedContactsButton />}
      >
        {!isLoading && !error && blacklistUsers && blacklistUsers.length > 0 && (
          <ul>
            {blacklistUsers.map((apiProfile) => {
              const contact = mapApiProfileToContact(apiProfile);
              return (
                <ContactCard
                  key={contact.uid}
                  contact={contact}
                  selectionMode={false}
                  selected={false}
                  onSelectHandler={() => {}}
                />
              );
            })}
          </ul>
        )}
      </ConversationLayout>
      {!isLoading && !error && (!blacklistUsers || blacklistUsers.length === 0) && <p>Чёрный список пуст.</p>}
    </div>
  );
};
