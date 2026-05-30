'use client';

import { JSX } from 'react';

import { useMediaQuery } from 'shared/hooks/use-media-query';

import { ContactsScreen } from 'modules/conversation/contacts';
import { DefaultPage } from 'modules/conversation/messages-chat';

export default function ChatsPage(): JSX.Element {
  const isMobile = useMediaQuery('(max-width: 410px)');

  if (isMobile) {
    return <ContactsScreen />;
  }

  return <DefaultPage />;
}
