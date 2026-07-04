'use client';

import { ChatCard } from 'modules/conversation/chats/entity/ui';
import { DeleteSelectedContactsButton } from 'modules/conversation/contacts/features/contacts-selection';
import { useInfiniteScroll } from 'modules/conversation/messages-chat/hooks/use-infinite-scroll';
import { ConversationLayout, SearchInput } from 'modules/conversation/shared/ui';
import { useRouter } from 'next/navigation';
import { JSX, useEffect } from 'react';
import { Dropdown } from 'shared/ui/dropdown';
import { DropdownItem } from 'shared/ui/dropdown/dropdown.props';
import { useChatsStore } from '../../model/search';
import { useChatsScreen } from '../../screens/use-chats-screen';
import { useChatsListStore } from '../../zustand-store-chats-list/zustand-store-chats-list';
import { AddContactModal } from '../add-contact-modal';
import { DefaultChatsList } from '../default-chats-list/default-chats-list';
import { DeleteChatModal } from '../delete-chat-modal';
import classes from './chat-block.module.scss';
import CreateChannelIcon from './icons/CreateChannelIcon.svg';
import CreateGroupIcon from './icons/CreateGroupIcon.svg';
import CreateGropOrChannelIcon from './icons/CreateGroupOrChannelIcon.svg';

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
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChatsScreen();

  const selected = useChatsStore((s) => s.selected);
  const chat = chats.find((c) => c.chat.id === selected);
  const { firstName = '', lastName = '' } = chat?.peer ?? {};

  const chatsListStore = useChatsListStore((s) => s.chatsList);
  const setChatsListStore = useChatsListStore((s) => s.setChatsList);
  const addChatsListStore = useChatsListStore((s) => s.addChatsList);

  // при изменении массива chats незамедлительнол изменения вносим в store

  useEffect(() => {
    if (!chats) return;
    if (search === '') {
      setChatsListStore(chats);
    } else {
      addChatsListStore(chats);
    }
  }, [chats]);

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

  // хук запускает работу бесконечного скролла
  const { wrapperRef, sentinelRef } = useInfiniteScroll({
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    arrayLenght: chatsListStore?.length ? chatsListStore?.length : 0,
    scrollType: 'down',
  });
  // подгружаем новую страницу, когда пользователь приблизится к предпоследнему элементу от низа
  const triggerIndex = chatsListStore?.length ? chatsListStore?.length - 1 : 0;
  return (
    <>
      <ConversationLayout
        header={
          <div className={classes.searchInputContainer}>
            <SearchInput query={search} onChange={setSearch} onClear={clearSearch} />
            <Dropdown trigger={<CreateGropOrChannelIcon />} items={contactMenuItems} />
          </div>
        }
        footer={<DeleteSelectedContactsButton />}
        wrapperRef={wrapperRef}
      >
        {status === 'success' && chatsListStore && chatsListStore.length > 0 ? (
          <ul>
            {chatsListStore?.map((chat, index) => {
              const isSentinel = index === triggerIndex;
              return (
                <div
                  key={chat.peer.uid}
                  ref={(el) => {
                    if (isSentinel) sentinelRef.current = el;
                  }}
                >
                  <ChatCard peer={chat.peer} chat={chat.chat} messages={chat.messages} />
                </div>
              );
            })}
          </ul>
        ) : (
          status === 'success' && <DefaultChatsList />
        )}
        {/*<ConversationEmptyState variant={'chats'} />*/}
      </ConversationLayout>
      <DeleteChatModal />
      <AddContactModal fullName={`${firstName} ${lastName}`} />
    </>
  );
};
