'use client';

import {
  DeleteSelectedContactsButton,
  DeleteSelectedContactsModal,
} from 'modules/conversation/contacts/features/contacts-selection';
import { ContactsPanel } from 'modules/conversation/contacts/widgets/contacts-panel/';
import { useInfiniteScroll } from 'modules/conversation/messages-chat/hooks/use-infinite-scroll';
import { ConversationEmptyState, ConversationLayout, SearchInput } from 'modules/conversation/shared/ui';
import { JSX } from 'react';
import { useContactsScreen } from './use-contacts-screen';

export const ContactsScreen = (): JSX.Element => {
  const { query, setQuery, clearQuery, contacts, globals, status, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useContactsScreen();
  // хук запускает работу бесконечного скролла
  const { wrapperRef, sentinelRef } = useInfiniteScroll({
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    arrayLenght: contacts?.length ? contacts?.length : 0,
    scrollType: 'down',
  });

  const hasGlobals = globals && globals?.length >= 1;

  const renderWithLayout = (content: JSX.Element): JSX.Element => (
    <>
      <ConversationLayout
        header={<SearchInput query={query} onChange={setQuery} onClear={clearQuery} />}
        footer={<DeleteSelectedContactsButton />}
        wrapperRef={wrapperRef}
      >
        {content}
      </ConversationLayout>
      <DeleteSelectedContactsModal />
    </>
  );

  if (!contacts && query.length === 0) {
    return renderWithLayout(<ConversationEmptyState variant="contacts" />);
  }

  if (query.length >= 1 && contacts?.length === 0 && globals?.length === 0) {
    return renderWithLayout(<ConversationEmptyState variant="noResult" />);
  }

  return renderWithLayout(
    <>
      <ContactsPanel variant="personal" contacts={contacts} sentinelRef={sentinelRef} />
      {hasGlobals && <ContactsPanel variant="globals" contacts={globals} />}
    </>,
  );
};
