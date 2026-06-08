import { Contact } from 'modules/conversation/contacts/entity';
import {
  ContactCardSelectable,
  SectionHeaderSelection,
} from 'modules/conversation/contacts/features/contacts-selection';
import { JSX } from 'react';

export const ContactsPanel = ({
  contacts,
  variant,
}: {
  contacts?: Contact[];
  variant: 'personal' | 'globals';
}): JSX.Element => {
  return (
    <div>
      <SectionHeaderSelection variant={variant} />
      <ul>
        {contacts?.map((contact) => (
          <ContactCardSelectable key={contact.uid} contact={contact} variant={variant} />
        ))}
      </ul>
    </div>
  );
};
