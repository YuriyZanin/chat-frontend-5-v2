'use client';

import { Contact } from 'modules/conversation/contacts/entity';
import { ContactCardSelectable } from 'modules/conversation/contacts/features/contacts-selection';
import { JSX } from 'react';

export const InviteMembersPanel = ({ contacts }: { contacts?: Contact[] }): JSX.Element => {
  console.log(contacts, 'vot');
  return (
    <div>
      <ul>
        {contacts?.map((contact) => (
          <ContactCardSelectable key={contact.uid} contact={contact} />
        ))}
      </ul>
    </div>
  );
};
