import { useWebSocketChat } from 'modules/conversation/messages-chat/api/web-socket/use-web-socket-chat';
import { useInfoStore } from 'modules/info/model/info.store';
import { JSX } from 'react';
import { SelectChatModal } from 'shared/ui/select-chat-modal/select-chat-modal';
type ForwardProfileModalProps = {
  wsUrl: string;
  currentUid: string;
  nickname: string;
  refreshUrl: string;
};

export const FrowardProfileModal = ({
  wsUrl,
  currentUid,
  nickname,
  refreshUrl,
}: ForwardProfileModalProps): JSX.Element | null => {
  const { uid, isForwardModalOpen, closeForwardModal } = useInfoStore();
  const { sendMessage } = useWebSocketChat(wsUrl, currentUid, refreshUrl);
  const handleForward = (toUid: string): void => {
    const baseUrl = window.location.origin;
    if (toUid.includes('group') || toUid.includes('channel')) {
      sendMessage({
        content: ` ${baseUrl}/${nickname}`,
        chatKey: toUid,
      });
    } else {
      sendMessage({
        content: ` ${baseUrl}/${nickname}`,
        toUserUid: toUid,
      });
    }
  };

  if (!isForwardModalOpen) return null;

  return <SelectChatModal title="Отправить" onClose={closeForwardModal} onSelect={handleForward} />;
};
