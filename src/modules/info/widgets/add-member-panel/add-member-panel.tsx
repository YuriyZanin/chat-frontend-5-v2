import { SearchInput } from 'modules/conversation/shared/ui';
import { JSX } from 'react';
import { ParticipantsPanel } from '../participant-panel';
import styles from './add-member-panel.module.scss';
import { useAddMemberPanel } from './use-add-member-panel';

export const AddMemberPanel = ({ chatKey }: { chatKey: string }): JSX.Element => {
  const { query, setQuery, clearQuery, users } = useAddMemberPanel(chatKey);

  const participants = users?.map((u) => ({
    uid: u.uid,
    firstName: u.firstName,
    lastName: u.lastName,
    avatarUrl: u.avatarUrl || u.avatarMasterUrl || u.avatarWebpUrl,
    avatarWebpUrl: u.avatarWebpUrl,
    avatarSmallUrl: u.avatarSmallUrl,
    avatarMasterUrl: u.avatarMasterUrl,
    isOwner: false,
    isBlocked: false,
    isOnline: u.isOnline,
    isDeleted: u.isDeleted,
    isInContacts: true,
    wasOnlineAt: u.wasOnlineAt,
  }));

  return (
    <div className={styles.wrapper}>
      <div className={styles.search}>
        <SearchInput query={query} onChange={setQuery} onClear={clearQuery} />
      </div>
      <div className={styles.label}>Мои контакты</div>
      <ParticipantsPanel participants={participants} />
    </div>
  );
};
