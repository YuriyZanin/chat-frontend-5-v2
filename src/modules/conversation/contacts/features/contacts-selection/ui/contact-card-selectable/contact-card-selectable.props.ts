import type { Contact } from 'modules/conversation/contacts/entity';

export type ContactCardSelectableProps = {
  contact: Contact;
  variant?: 'personal' | 'globals';
};
