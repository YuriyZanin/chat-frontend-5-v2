import { ChatCardModal } from 'modules/conversation/chats/entity/ui/chat-card-modal';
import { useChatsStore } from 'modules/conversation/chats/model/search';
import { useChatsScreen } from 'modules/conversation/chats/screens/use-chats-screen';
import { SearchInput } from 'modules/conversation/shared/ui';
import { useNotificationStore } from 'modules/notification/model/notification.store';
import { JSX } from 'react';
import ForwardedIcon from '../../../modules/notification/ui/notification-modal/icons/forwarded.svg';
import ModalCloseIcon from './icons/modal-close.svg';
import styles from './select-chat-modal.module.scss';

type SelectChatModalProps = {
  title: string;
  onClose: () => void;
  onSelect: (toUid: string) => void;
};

export const SelectChatModal: React.FC<SelectChatModalProps> = ({
  title,
  onClose,
  onSelect,
}: SelectChatModalProps): JSX.Element => {
  const { modalChats, modalSearch, setModalSearch } = useChatsScreen();
  const { setIcon, setTitle, openPopup } = useNotificationStore();
  const { clearSelected } = useChatsStore();
  const handleBackdropClick = (e: React.MouseEvent): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSelectClick = (toUid: string, fullName: string): void => {
    onSelect(toUid);
    clearSelected();
    onClose();
    setIcon(<ForwardedIcon />);
    setTitle(`Отправлено ${fullName}`);
    openPopup();
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          <button className={styles.closeButton} onClick={onClose}>
            <ModalCloseIcon />
          </button>
        </div>
        <div className={styles.search}>
          <SearchInput query={modalSearch} onChange={setModalSearch} />
        </div>
        <div className={styles.cards}>
          <>
            <ul>
              {modalChats.map((c) => (
                <ChatCardModal
                  key={c.peer.uid}
                  chat={c}
                  onSelectHandler={() =>
                    handleSelectClick(
                      c.chat.chatType === 'chat' ? c.peer.uid : c.chat.chatKey,
                      c.chat.chatType === 'chat' ? `${c.peer.firstName} ${c.peer.lastName}` : c.chat.name,
                    )
                  }
                />
              ))}
            </ul>
          </>
        </div>
      </div>
    </div>
  );
};
