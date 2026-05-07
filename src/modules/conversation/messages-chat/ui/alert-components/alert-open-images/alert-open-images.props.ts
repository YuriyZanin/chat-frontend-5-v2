import type { RestMessageApi } from 'modules/conversation/messages-chat/model/messages-list';

export type AlertOpenImagesProps = {
  onOk: () => void;
  onCancel: () => void;
  message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' };
};
