import { useInfoStore } from 'modules/info/model/info.store';
import { useParticipantsScreen } from 'modules/info/screens/use-participant-screen';
import { ParticipantsPanel } from 'modules/info/widgets/participant-panel';
import { JSX } from 'react';
import AddIcon from '../../../shared/icons/add.svg';
import { ActionButton } from '../../action-button';
import { ParticipantCardSelectable } from './participant-card-selectable';
import styles from './participants-tab.module.scss';
import { ParticipantsTabProps } from './participants-tab.props';
import { SearchPanel } from './search-panel';

export const ParticipantsTab = ({ currentUid, chatKey }: ParticipantsTabProps): JSX.Element => {
  const { query, setQuery, clearQuery, participants, filtered } = useParticipantsScreen(chatKey);
  const { enterSelectionMode, clearSelection } = useInfoStore();
  const owner = filtered?.find((p) => p.isOwner);
  const members = filtered?.filter((p) => !p.isOwner) ?? [];
  const current = participants?.find((p) => p.uid === currentUid);
  const isGroup = chatKey.startsWith('group');
  const isOwnerGroupOrChannel = owner?.uid === currentUid;
  const handleAddToGroup = (): void => {
    clearSelection();
    clearQuery();
    enterSelectionMode();
  };

  return (
    <div className={styles.wrapper}>
      {current && (
        <ActionButton
          icon={<AddIcon />}
          label={isGroup ? 'Пригласить в группу' : 'Пригласить подписчиков'}
          onClick={handleAddToGroup}
        />
      )}
      <SearchPanel query={query} onChange={setQuery} onClear={clearQuery} />
      {query ? (
        <>
          <ParticipantsPanel participants={filtered} isOwnerGroupOrChannel={isOwnerGroupOrChannel} />
        </>
      ) : (
        <>
          {owner && (
            <>
              <div className={styles.label}>Владелец</div>
              <ParticipantCardSelectable isOwnerGroupOrChannel={isOwnerGroupOrChannel} participant={owner} />
            </>
          )}

          {members.length > 0 && (
            <>
              <div className={styles.label}>{isGroup ? 'Участники' : 'Подписчики'}</div>
              <ParticipantsPanel participants={members} isOwnerGroupOrChannel={isOwnerGroupOrChannel} />
            </>
          )}
        </>
      )}
    </div>
  );
};
