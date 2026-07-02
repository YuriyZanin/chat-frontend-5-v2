'use client';

import { useContactsSelectionStore } from 'modules/conversation/contacts/features/contacts-selection';
import { useContactsScreen } from 'modules/conversation/contacts/screens/use-contacts-screen';
import { useWebSocketChatStore } from 'modules/conversation/messages-chat/api/web-socket/use-web-socket-chat-store';
import { ConversationLayout, SearchInput } from 'modules/conversation/shared/ui';
import { useNewGroupStore } from 'modules/new-group/model/new-group-store';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { JSX, useEffect } from 'react';
import { ButtonUI } from 'shared/ui';
import { InviteMembersPanel } from '../invite-members-panel';
import styles from './invite-members-block.module.scss';

export const InviteMembersBlock = (): JSX.Element => {
  const pathname = usePathname();
  const router = useRouter();

  // Определяем режим по пути
  const mode = pathname.includes('/new-channel') ? 'channel' : 'group';

  const { query, setQuery, clearQuery, contacts } = useContactsScreen();

  const enterSelectionMode = useContactsSelectionStore((s) => s.enterSelectionMode);
  const selectedUids = useContactsSelectionStore((s) => s.selectedIds);
  const nameStore = useNewGroupStore((s) => s.name);
  const setNameStore = useNewGroupStore((s) => s.setName);
  const setModeStore = useNewGroupStore((s) => s.setMode);
  const modeStore = useNewGroupStore((s) => s.mode);
  const descriptionStore = useNewGroupStore((s) => s.description);
  const setDescriptionStore = useNewGroupStore((s) => s.setDescription);
  const chatTypeStore = useNewGroupStore((s) => s.chatType);
  const setChatTypeStore = useNewGroupStore((s) => s.setChatType);
  const avatarUidStore = useNewGroupStore((s) => s.avatarUid);
  const setAvatarUidStore = useNewGroupStore((s) => s.setAvatarUid);
  const avatarPreviewStore = useNewGroupStore((s) => s.avatarPreview);
  const setAvatarPreviewStore = useNewGroupStore((s) => s.setAvatarPreview);
  const avatarFileStore = useNewGroupStore((s) => s.avatarFile);
  const setAvatarFileStore = useNewGroupStore((s) => s.setAvatarFile);
  const setSelectedStore = useNewGroupStore((s) => s.setSelected);

  const webSocketChatSrore = useWebSocketChatStore((s) => s.webSocketChat);

  const exitSelectionMode = useContactsSelectionStore((s) => s.exitSelectionMode);

  // Устанавливаем режим
  useEffect(() => {
    setModeStore(mode);
  }, [mode, setModeStore]);

  useEffect(() => {
    enterSelectionMode();
  }, [enterSelectionMode]);
  // сразу очищаем поисковую строку
  useEffect(() => {
    clearQuery();
  }, []);

  const title = 'Пригласить участников';
  const backPath = mode === 'group' ? '/new-group' : '/new-channel';
  const successPath = mode === 'group' ? '/new-group' : '/new-channel';
  const buttonLabel = 'Создать';

  const handleCreate = async (): Promise<void> => {
    if (webSocketChatSrore === null) return;
    const { createGroupOrChannel } = webSocketChatSrore;
    if (!nameStore.trim()) {
      alert(`Введите название ${modeStore === 'group' ? 'группы' : 'канала'}`);
      router.push(backPath);
      return;
    }

    const usersArray = Array.isArray(selectedUids) ? selectedUids : Array.from(selectedUids);

    if (modeStore === 'group' && usersArray.length === 0) {
      alert('Выберите хотя бы одного участника');
      return;
    }

    try {
      createGroupOrChannel({
        name: nameStore,
        chatType: chatTypeStore,
        uidUsersList: usersArray,
        description: descriptionStore || undefined,
        avatarPreview: avatarPreviewStore || undefined,
        file: avatarFileStore,
      });
      exitSelectionMode();
      setNameStore('');
      setDescriptionStore('');
      setChatTypeStore(null);
      setSelectedStore(mode === 'group' ? 'public-group' : 'public-channel');
      setAvatarPreviewStore(null);
      setAvatarUidStore(null);
      setAvatarFileStore(null);

      //router.push('successPath');
    } catch (error) {
      console.error(`Ошибка создания ${mode === 'group' ? 'группы' : 'канала'}:`, error);
      alert(`Не удалось создать ${mode === 'group' ? 'группу' : 'канал'}. Попробуйте позже.`);
    }
  };

  const hasSelected =
    modeStore === 'group' ? (Array.isArray(selectedUids) ? selectedUids.length > 0 : selectedUids.size > 0) : true; // Для канала выбор участников опционален

  return (
    <div className={styles.container}>
      <button type="button" className={styles.returnButton} onClick={() => router.push(backPath)}>
        <div className={styles.iconAndLabelContainer}>
          <Image
            src="/images/settings/returnArrowIcon.svg"
            alt=""
            width={21}
            height={21}
            className={styles.returnIcon}
          />
          <span className={styles.labelText}>{title}</span>
        </div>
      </button>

      <ConversationLayout
        header={<SearchInput query={query} onChange={setQuery} onClear={clearQuery} />}
        footer={
          <div className={styles.createButtonContainer}>
            <ButtonUI
              variant="general"
              appearance="primary"
              label={buttonLabel}
              type="button"
              disabled={!hasSelected}
              onClick={handleCreate}
              style={!hasSelected ? { background: '#e4e4e4', color: '#C5C5C5' } : {}}
            />
          </div>
        }
      >
        <>
          <span className={styles.myContactsSpan}>Мои контакты</span>
          <InviteMembersPanel contacts={contacts} />
        </>
      </ConversationLayout>
    </div>
  );
};
