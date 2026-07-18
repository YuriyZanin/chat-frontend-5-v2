'use client';

import { JSX } from 'react';

import { useMediaQuery } from 'shared/hooks/use-media-query';

import { ChatsBlock } from 'modules/conversation/chats';
import { DefaultPage } from 'modules/conversation/messages-chat';

export default function ChatsPage(): JSX.Element {
  const isMobile = useMediaQuery('(max-width: 410px)');

  if (isMobile) {
    return <ChatsBlock />;
  }

  return <DefaultPage />;
}
