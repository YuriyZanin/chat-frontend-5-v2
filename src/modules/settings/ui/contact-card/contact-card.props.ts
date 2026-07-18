import { Contact } from 'modules/conversation/contacts/entity';

export type ContactCardProps = {
  contact: Contact;
  selectionMode: boolean;
  selected: boolean;
  onSelectHandler: () => void;
};
