import { FilesSummaryEntity } from 'modules/conversation/chats/entity';

export type CardPreviewProps = {
  content: string;
  filesSummary?: FilesSummaryEntity;
  replied: boolean;
  forwarded: boolean;
  isCurrentUser: boolean;
};
