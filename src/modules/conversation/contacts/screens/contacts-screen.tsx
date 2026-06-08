'use client';

import {
  DeleteSelectedContactsButton,
  DeleteSelectedContactsModal,
} from 'modules/conversation/contacts/features/contacts-selection';
import { ContactsPanel } from 'modules/conversation/contacts/widgets/contacts-panel/';
import { ConversationEmptyState, ConversationLayout, SearchInput } from 'modules/conversation/shared/ui';
import { JSX } from 'react';
import { useContactsScreen } from './use-contacts-screen';

export const ContactsScreen = (): JSX.Element => {
  const { query, setQuery, clearQuery, contacts, globals } = useContactsScreen();
  const renderWithLayout = (content: JSX.Element): JSX.Element => (
    <>
      <ConversationLayout
        header={<SearchInput query={query} onChange={setQuery} onClear={clearQuery} />}
        footer={<DeleteSelectedContactsButton />}
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
      <ContactsPanel variant="personal" contacts={contacts} />
      {globals && <ContactsPanel variant="globals" contacts={globals} />}
    </>,
  );
};
