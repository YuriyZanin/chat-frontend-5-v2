'use client';

import { ChatCard } from 'modules/conversation/chats/entity/ui';
import { DeleteSelectedContactsButton } from 'modules/conversation/contacts/features/contacts-selection';
import { ConversationLayout, SearchInput } from 'modules/conversation/shared/ui';
import { useRouter } from 'next/navigation';
import { JSX, useEffect } from 'react';
import { Dropdown } from 'shared/ui/dropdown';
import { DropdownItem } from 'shared/ui/dropdown/dropdown.props';
import { useChatsScreen } from '../../screens/use-chats-screen';
import { useChatsListStore } from '../../zustand-store-chats-list/zustand-store-chats-list';
import { AddContactModal } from '../add-contact-modal';
import { DeleteChatModal } from '../delete-chat-modal';
import classes from './chat-block.module.scss';
import CreateChannelIcon from './icons/CreateChannelIcon.svg';
import CreateGroupIcon from './icons/CreateGroupIcon.svg';
import CreateGropOrChannelIcon from './icons/CreateGroupOrChannelIcon.svg';
// const chats = mockChatListApiResponse.results.map((r) => mapChatFromApi(r));

export const ChatsBlock = (): JSX.Element => {
  const {
    ordering,
    setOrdering,
    clearOrdering,
    search,
    setSearch,
    clearSearch,
    is_active,
    setIsActive,
    is_blocked,
    setIsBlocked,
    is_favorite,
    setIsFavorite,
    chats,
    status,
  } = useChatsScreen();

  const chatsListStore = useChatsListStore((s) => s.chatsList);
  const setChatsListStore = useChatsListStore((s) => s.setChatsList);
  // при изменении массива chats незамедлительнол изменения вносим в store

  useEffect(() => {
    setChatsListStore(chats);
  }, [chats, setChatsListStore]);
  console.log('chatsListStore:', chatsListStore);

  const router = useRouter();
  const contactMenuItems: DropdownItem[] = [
    {
      label: 'Создать группу',
      icon: <CreateGroupIcon />,
      onClick: (): void => {
        router.push('/new-group');
      },
    },
    {
      label: 'Создать канал',
      icon: <CreateChannelIcon />,
      onClick: (): void => {
        router.push('/new-channel');
      },
    },
  ];
  return (
    <>
      <ConversationLayout
        header={
          <div className={classes.searchInputContainer}>
            <SearchInput query={search} onChange={setSearch} />
            <Dropdown trigger={<CreateGropOrChannelIcon />} items={contactMenuItems} />
          </div>
        }
        footer={<DeleteSelectedContactsButton />}
      >
        {status === 'success' && chatsListStore && chatsListStore.length > 0 && (
          <>
            <ul>
              {chatsListStore?.map((c) => (
                <ChatCard key={c.peer.uid} peer={c.peer} chat={c.chat} messages={c.messages} />
              ))}
            </ul>
          </>
        )}

        {/*<ConversationEmptyState variant={'chats'} />*/}
      </ConversationLayout>
      <DeleteChatModal />
      <AddContactModal />
    </>
  );
};
