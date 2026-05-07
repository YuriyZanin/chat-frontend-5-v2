'use client';

import clsx from 'clsx';
import { useAlert } from 'modules/conversation/messages-chat/hooks/use-alert';
import { getMessageTime } from 'modules/conversation/messages-chat/lib/get-message-time';
import {
  useForAllDeleteStore,
  useForwardMessageStore,
  useRepliedMessageStore,
  useSelectedMessagesStore,
  useSelectedUidUserForForwardMessageStore,
} from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { JSX, MouseEvent, useEffect, useRef, useState } from 'react';
import { ContextMenu } from '../../../context-menu/context-menu';
import { HighlightedMessage } from '../../../search-messages/highlighted-message/highlighted-message';
import DeleteFileIcon from '../../file-card/icons/delete-file-icon.svg';
import { ForvardCard } from '../../forward-card/forward-card';
import CheckOneIcon from '../../icons/check-one.svg';
import CheckTwoIcon from '../../icons/check-two.svg';
import WatchIcon from '../../icons/watch.svg';
import { MessageCheckBox } from '../../message-checkbox/message-checkbox';
import { ReplyCard } from '../../reply-card/reply-card';
import PlugBig from '../icons/plug-big.svg';
import PlugLittle from '../icons/plug-little.svg';
import styles from './outgoing-images-card.module.scss';
import type { OutgoingImagesCardProps, PlugCardProps, PreviewImageCardProps } from './outgoing-images-card.props';
export const OutgoingImagesCard = ({
  message,
  sendDeleteMessage,
  search,
  isHighlighted,
  currentUserId,
}: OutgoingImagesCardProps): JSX.Element => {
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [contextMenuVisible, setContextMenuVisible] = useState<boolean>(false);
  const handleContextMenu = (event: MouseEvent<HTMLDivElement>): void => {
    event.preventDefault();
    const menuWidth = 250;
    const menuHeight = 220;
    const x = event.pageX;
    const y = event.pageY;
    const adjustedX = x + 5;
    const adjustedY = y - menuHeight - 5;
    const constrainedX =
      adjustedX + menuWidth > window.innerWidth - window.innerWidth / 3.77 ? x - menuWidth - 5 : adjustedX;
    const constrainedY = adjustedY < 150 ? y + 5 : adjustedY;
    setContextMenuPos({ x: constrainedX, y: constrainedY });
    setContextMenuVisible(true);
  };

  const handleCloseMenu = (): void => {
    setContextMenuVisible(false);
  };

  const { confirm } = useAlert();
  const forAllDeleteStore = useForAllDeleteStore((s) => s.forAllDelete);
  const forAllDeleteRef = useRef<boolean>(forAllDeleteStore);
  const selectedUidUserForForwardMessageStore = useSelectedUidUserForForwardMessageStore(
    (s) => s.selectedUidUserForForwardMessage,
  );
  const selectedUidUserForForwardMessageRef = useRef<string>(selectedUidUserForForwardMessageStore);
  const clearSelectedMessagesStore = useSelectedMessagesStore((s) => s.clearSelectedMessages);
  useEffect(() => {
    forAllDeleteRef.current = forAllDeleteStore;
    selectedUidUserForForwardMessageRef.current = selectedUidUserForForwardMessageStore;
  }, [forAllDeleteRef, forAllDeleteStore, selectedUidUserForForwardMessageStore, selectedUidUserForForwardMessageRef]);

  const handleDeleteClick = async (): Promise<void> => {
    const ok = await confirm({
      title: 'Удалить сообщение',
      message: 'Вы действительно хотите удалить сообщение?',
      showCheckBox: true,
      labelCheckBox: `Удалить у меня и у ${message.to_user?.first_name !== '' ? message.to_user?.first_name : message.to_user?.nickname}`,
    });
    if (ok && forAllDeleteRef.current !== null) {
      sendDeleteMessage(message, forAllDeleteRef.current);
    }
  };
  const setForwardMessageStore = useForwardMessageStore((s) => s.setForwardMessage);
  const clearRepliedMessageStore = useRepliedMessageStore((s) => s.clearRepliedMessage);
  const router = useRouter();

  const handleForwardClick = async (): Promise<void> => {
    const ok = await confirm({
      isMessageForwarding: true,
    });
    if (ok && selectedUidUserForForwardMessageRef.current) {
      setForwardMessageStore(message);
      clearRepliedMessageStore();
      clearSelectedMessagesStore();
      router.push(`/chats/${selectedUidUserForForwardMessageRef.current}`);
    }
  };
  // выясняем имеется ли "message" в массиве выбранных сообщений ("selectedMessagesStore")
  const selectedMessagesStore = useSelectedMessagesStore((s) => s.selectedMessages);
  const addSelectedMessagesStore = useSelectedMessagesStore((s) => s.addSelectedMessages);
  const deleteSelectedMessagesStore = useSelectedMessagesStore((s) => s.deleteSelectedMessages);

  const [selected, setSelected] = useState<boolean>(true);
  const has = selectedMessagesStore?.some((selectedMessage) => selectedMessage.uid === message.uid);

  const handleCheckBoxClick = (): void => {
    setSelected(!selected);
    if (selected) {
      addSelectedMessagesStore(message);
    } else {
      deleteSelectedMessagesStore(message);
    }
  };
  // показывать компоненты <MessageCheckBox/> в DOM либо нет
  const checkBoxsVisibleStore = useSelectedMessagesStore((s) => s.checkBoxsVisible);
  const fileList = message.files_list.length ? message.files_list : message.forwarded_messages[0].files_list;

  return (
    <div className={(checkBoxsVisibleStore && has) || isHighlighted ? styles.blockSelected : styles.block}>
      {checkBoxsVisibleStore && (
        <MessageCheckBox message={message} selected={has} handleCheckBoxClick={handleCheckBoxClick} />
      )}
      <div
        className={styles.wrapperBlock}
        onContextMenu={!checkBoxsVisibleStore ? handleContextMenu : (): void => {}}
        onMouseLeave={handleCloseMenu}
      >
        <ContextMenu
          position={contextMenuPos}
          visible={contextMenuVisible}
          onClose={handleCloseMenu}
          handleDeleteClick={handleDeleteClick}
          handleForwardClick={handleForwardClick}
          message={message}
        />
        <div className={styles.wrapper}>
          <div className={styles.replyAndForward}>
            {message.replied_messages.length > 0 && <ReplyCard message={message} isIncomingMessage={false} />}
            {message.forwarded_messages.length > 0 && <ForvardCard message={message} currentUserId={currentUserId} />}
          </div>

          <div className={clsx(styles.previewImages, styles[`previewImages--${fileList.length}`])}>
            {fileList.map((image) => (
              <PreviewImageCard key={image.uid} image={image} message={message} />
            ))}
          </div>
          {message.content && message.content !== ' ' ? (
            <div className={styles.item}>
              <div className={styles.message}>
                <div className={styles.messageText}>
                  <HighlightedMessage text={message.content ?? ''} search={search} />
                </div>
                <div className={styles.messageSentTime}>
                  <div className={styles.messageTime}>{getMessageTime(message.created_at)}</div>
                  <div className={styles.messageChatIcons}>
                    {message.status === 'sent' && message.new === true && <CheckOneIcon />}
                    {(message.status === 'pending' || message.status === 'failed') && <WatchIcon />}
                    {message.new === false && <CheckTwoIcon />}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.messageSentTimeImg}>
              <div className={styles.messageTimeImg}>{getMessageTime(message.created_at)}</div>
              <div className={styles.messageChatIcons}>
                {message.status === 'sent' && message.new === true && <CheckOneIcon />}
                {(message.status === 'pending' || message.status === 'failed') && <WatchIcon />}
                {message.new === false && <CheckTwoIcon />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PreviewImageCard = ({ image, message }: PreviewImageCardProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const handleError = (): void => {
    setIsLoading(false);
    setIsError(true);
  };
  return (
    <div className={styles.image}>
      {isError ? (
        <PlugCard message={message} />
      ) : (
        <Image
          src={image.file_url}
          alt={image.download_name}
          width={500}
          height={376}
          onLoad={() => setIsLoading(false)}
          onError={handleError}
        />
      )}
      <div className={styles.deleteButton}>
        {(isLoading || message.status === 'pending' || message.status === 'failed') && (
          <button className={styles.deleteFileIcon}>
            <DeleteFileIcon />
          </button>
        )}
      </div>
    </div>
  );
};

const PlugCard = ({ message }: PlugCardProps): JSX.Element => {
  const quantityPictures = message.files_list.length
    ? message.files_list.length
    : message.forwarded_messages[0].files_list.length;
  return <div className={styles.plug}>{quantityPictures === 1 ? <PlugBig /> : <PlugLittle />}</div>;
};
