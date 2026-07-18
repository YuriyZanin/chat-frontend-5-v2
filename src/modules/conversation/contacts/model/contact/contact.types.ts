import { GlobalContactApi } from './search-contact.api.schema';
import { UserContactApi } from './user-contact.api.schema';

export type ContactApi = UserContactApi | GlobalContactApi;
