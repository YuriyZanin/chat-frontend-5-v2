'use client';

import clsx from 'clsx';
import { useAlert } from 'modules/conversation/messages-chat/hooks/use-alert';
import { useContextMenu } from 'modules/conversation/messages-chat/hooks/use-context-menu';
import { getMessageTime } from 'modules/conversation/messages-chat/lib/get-message-time';
import { useSelectedMessagesStore } from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import Image from 'next/image';
import { JSX, useState } from 'react';
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
  //размеры контекстного окна
  const menuWidth = 250;
  const menuHeight = 220;
  //показывать check-box при удалении либо нет
  const showCheckBox = true;
  //надпись на check-box при удалении сообщения
  const labelCheckBox = `Удалить у меня и у ${message.to_user?.first_name !== '' ? message.to_user?.first_name : message.to_user?.nickname}`;
  //хук для обработчиков контекстного меню сообщения
  const {
    handleContextMenu,
    handleCloseMenu,
    handleDeleteClick,
    handleForwardClick,
    handleCheckBoxClick,
    contextMenuPos,
    contextMenuVisible,
    has,
  } = useContextMenu({ menuWidth, menuHeight, sendDeleteMessage, message, showCheckBox, labelCheckBox });
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
        onClick={checkBoxsVisibleStore ? handleCheckBoxClick : (): void => {}}
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
              <PreviewImageCard
                key={image.uid}
                image={image}
                message={message}
                sendDeleteMessage={sendDeleteMessage}
                checkBoxsVisibleStore={checkBoxsVisibleStore}
              />
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

const PreviewImageCard = ({
  image,
  message,
  sendDeleteMessage,
  checkBoxsVisibleStore,
}: PreviewImageCardProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const handleError = (): void => {
    setIsLoading(false);
    setIsError(true);
  };
  // xyk для открытия модального окна с алертом
  const { confirm } = useAlert();
  // блок вызова модального окна с обработчиком для отправки сообщения и вложенных файлов
  const handleOpenImages = async (): Promise<void> => {
    const ok = await confirm({
      openImages: { isOpenImages: true, message, sendDeleteMessage, isIncomingCard: false },
    });
  };
  return (
    <div className={styles.image} onClick={!checkBoxsVisibleStore ? handleOpenImages : (): void => {}}>
      {isError ? (
        <PlugCard message={message} />
      ) : (
        <Image
          src={image.file_webp_url}
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
