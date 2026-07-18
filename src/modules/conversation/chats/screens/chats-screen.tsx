'use client';

import { JSX } from 'react';
import { useChatsScreen } from './use-chats-screen';

export const ChatsScreen = (): JSX.Element => {
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
  } = useChatsScreen();

  return <>{/* нужно встроить компонент <ChatsBlock /> */}</>;
};
