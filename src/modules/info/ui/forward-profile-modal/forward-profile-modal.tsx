import { useWebSocketChatStore } from 'modules/conversation/messages-chat/api/web-socket/use-web-socket-chat-store';
import { useInfoStore } from 'modules/info/model/info.store';
import { JSX } from 'react';
import { SelectChatModal } from 'shared/ui/select-chat-modal/select-chat-modal';
type ForwardProfileModalProps = {
  nickname: string;
};

export const FrowardProfileModal = ({ nickname }: ForwardProfileModalProps): JSX.Element | null => {
  const { uid, isForwardModalOpen, closeForwardModal } = useInfoStore();
  const webSocketChatSrore = useWebSocketChatStore((s) => s.webSocketChat);

  const handleForward = (toUid: string): void => {
    if (webSocketChatSrore === null) return;
    const { sendMessage } = webSocketChatSrore;
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
