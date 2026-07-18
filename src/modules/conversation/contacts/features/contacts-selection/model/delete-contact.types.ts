import { InfiniteData } from '@tanstack/react-query';
import { UserContactApiResponse } from 'modules/conversation/contacts/model/contact';

export type ContactsInfiniteData = InfiniteData<UserContactApiResponse>;

export type DeleteContactsContext = {
  previousContacts: ContactsInfiniteData | undefined;
};
