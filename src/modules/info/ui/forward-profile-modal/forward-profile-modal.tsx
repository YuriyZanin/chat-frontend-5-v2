import { useWebSocketChat } from 'modules/conversation/messages-chat/api/web-socket/use-web-socket-chat';
import { CreateTextMessageAPI } from 'modules/conversation/messages-chat/model/messages-list';
import { useInfoStore } from 'modules/info/model/info.store';
import Link from 'next/link';
import { JSX } from 'react';
import { renderToString } from 'react-dom/server';
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
  const { sendProfile } = useWebSocketChat(wsUrl, currentUid, refreshUrl);

  const handleForward = (toUid: string): void => {
    if (toUid) {
      const requestUid = crypto.randomUUID();
      const baseUrl = window.location.origin;
      const payload: CreateTextMessageAPI = {
        action: 'create_text_message',
        request_uid: requestUid,
        object: {
          to_user_uid: toUid,
          content: renderToString(
            <Link href={`/contacts/${uid}`}>
              {baseUrl}/{nickname}
            </Link>,
          ),
          status: 'publish',
          // forwarded_messages: ['test'],
        },
      };
      sendProfile(payload);
    }
  };

  if (!isForwardModalOpen) return null;

  return <SelectChatModal title="Отправить" onClose={closeForwardModal} onSelect={handleForward} />;
};
