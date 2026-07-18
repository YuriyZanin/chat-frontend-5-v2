import type { RestMessageApi } from 'modules/conversation/messages-chat/model/messages-list';
export type MessageCheckBoxProps = {
  message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' };
  selected: boolean | undefined;
  handleCheckBoxClick: () => void;
};
