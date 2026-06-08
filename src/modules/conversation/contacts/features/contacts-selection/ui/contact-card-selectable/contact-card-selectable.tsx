'use client';

import { Contact, ContactCard } from 'modules/conversation/contacts/entity';
import { useContactsSelectionStore } from 'modules/conversation/contacts/features/contacts-selection';
import { JSX } from 'react';

export const ContactCardSelectable = ({
  contact,
  variant,
}: {
  contact: Contact;
  variant?: 'personal' | 'globals';
}): JSX.Element => {
  const isSelectionMode = useContactsSelectionStore((s) => s.isSelectionMode);
  const selectedIds = useContactsSelectionStore((s) => s.selectedIds);
  const toggleSelection = useContactsSelectionStore((s) => s.toggleSelection);

  const isSelected = selectedIds.has(contact.uid);

  return (
    <ContactCard
      contact={contact}
      selectionMode={isSelectionMode}
      selected={isSelected}
      onSelectHandler={() => toggleSelection(contact.uid)}
      variant={variant}
    />
  );
};
