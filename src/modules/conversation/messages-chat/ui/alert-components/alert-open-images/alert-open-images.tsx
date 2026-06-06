'use client';
import { removeDomain } from 'modules/conversation/chats/utils/utils';
import { useDownloadMessageFile } from 'modules/conversation/messages-chat/hooks/use-download-message-file';
import { getMessageTimeOrDate } from 'modules/conversation/messages-chat/lib/get-message-time';
import {
  useForAllDeleteStore,
  useForwardMessageStore,
  useRepliedMessageStore,
  useSelectedMessagesStore,
  useSelectedUidUserForForwardMessageStore,
} from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { JSX, useEffect, useRef, useState } from 'react';
import { AlertDelete } from '../alert-delete/alert-delete';
import { AlertForward } from '../alert-forward/alert-forward';
import styles from './alert-open-images.module.scss';
import { AlertOpenImagesProps } from './alert-open-images.props';
import Close from './icon/close.svg';
import Copy from './icon/copy.svg';
import Delete from './icon/delete.svg';
import LeftArrow from './icon/left-arrow.svg';
import Forward from './icon/reply.svg';
import RightArrow from './icon/right-arrow.svg';

export const AlertOpenImages = ({
  onOk,
  onCancel,
  message,
  sendDeleteMessage,
  isIncomingCard,
}: AlertOpenImagesProps): JSX.Element => {
  const fileList = message.files_list.length ? message.files_list : message.forwarded_messages[0].files_list;
  const [indexImage, setIndexImage] = useState<number>(0);
  const [isForward, setIsForward] = useState<boolean>(false);
  const [isCopy, setIsCopy] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
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

  const setForwardMessageStore = useForwardMessageStore((s) => s.setForwardMessage);
  const clearRepliedMessageStore = useRepliedMessageStore((s) => s.clearRepliedMessage);
  const router = useRouter();

  const handleForwardClick = (): void => {
    setIsDelete(false);
    setIsForward(true);
  };
  const handleDeleteClick = (): void => {
    setIsForward(false);
    setIsDelete(true);
  };
  const onCancelForward = (): void => {
    setIsForward(false);
  };
  const onCancelDelete = (): void => {
    setIsDelete(false);
  };
  const onOkForward = (): void => {
    if (selectedUidUserForForwardMessageRef.current) {
      setForwardMessageStore(message);
      clearRepliedMessageStore();
      clearSelectedMessagesStore();
      router.push(`/chats/${selectedUidUserForForwardMessageRef.current}`);
      onCancel();
    }
  };
  const onOkDelete = (): void => {
    if (forAllDeleteRef.current !== null) {
      sendDeleteMessage(message, forAllDeleteRef.current);
      onCancel();
    }
  };
  // хук для скачивания файла(картинки) с сервера, который находится в сообщении
  const { handleDownloadMessageFileClick } = useDownloadMessageFile(fileList);
  const handleCopyClick = (): void => {
    setIsCopy(true);
    setTimeout(() => setIsCopy(false), 2000);
    handleDownloadMessageFileClick();
  };
  // создаем url для запроса картинки через наш прокси-сервер который в запрос вставляет токен чтобы пройти автоизацию
  const result = `/api/proxy${removeDomain((message.files_list[0].file_protected_url || message.files_list[0].file_webp_url) ?? '')}`;
  return (
    <div className={styles.wrapper}>
      <div className={styles.headerTop}>
        <div className={styles.headerTopContact}>
          <div className={styles.headerTopContactAvatar}>
            {message.files_list.length ? (
              <Image
                src={message.from_user.avatar_webp_url ?? '/images/messages-chats/default-avatar.svg'}
                alt={message.from_user.username}
                unoptimized
                width={60}
                height={60}
              />
            ) : (
              <Image
                src={message.forwarded_messages[0].avatar_webp_url ?? '/images/messages-chats/default-avatar.svg'}
                alt={message.forwarded_messages[0].from_user ?? 'Дефолтный Аватар'}
                unoptimized
                width={60}
                height={60}
              />
            )}
          </div>
          <div className={styles.headerTopContactText}>
            <div className={styles.headerTopContactTextName}>
              {message.files_list.length
                ? `${message.from_user.first_name} ${message.from_user.last_name}`
                : `${message.forwarded_messages[0].first_name} ${message.forwarded_messages[0].last_name}`}
            </div>
            <div className={styles.headerTopContactTextTime}>{getMessageTimeOrDate(message.created_at)}</div>
          </div>
        </div>
        <div className={styles.headerTopContactMenu}>
          <div className={styles.icon}>
            <button className={styles.icon} onClick={handleCopyClick}>
              <Copy />
            </button>
          </div>
          <div className={styles.icon}>
            <button className={styles.icon} onClick={handleForwardClick}>
              <Forward />
            </button>
          </div>
          <div className={styles.icon}>
            <button className={styles.icon} onClick={handleDeleteClick}>
              <Delete />
            </button>
          </div>
          <div className={styles.icon}>
            <button className={styles.icon} onClick={onCancel}>
              <Close />
            </button>
          </div>
        </div>
      </div>
      <div className={styles.arrowsContainer}>
        <div className={styles.arrowsContainerIcon}>
          <button
            className={indexImage > 0 ? styles.arrowsContainerIcon : styles.arrowsContainerIconDisabled}
            onClick={() => setIndexImage(indexImage - 1)}
            disabled={!(indexImage > 0)}
          >
            <LeftArrow />
          </button>
        </div>
        <div className={styles.arrowsContainerIcon}>
          <button
            className={
              indexImage < fileList.length - 1 ? styles.arrowsContainerIcon : styles.arrowsContainerIconDisabled
            }
            onClick={() => setIndexImage(indexImage + 1)}
            disabled={!(indexImage < fileList.length - 1)}
          >
            <RightArrow />
          </button>
        </div>
      </div>
      <div className={styles.image}>
        <Image src={result} alt={fileList[indexImage].download_name} unoptimized width={626} height={417} />
      </div>
      <div className={styles.headerBottom}>
        <div className={styles.headerBottomText}>
          {message.files_list.length ? message.content : message.forwarded_messages[0].content}
        </div>
      </div>
      {isForward && (
        <div className={styles.alert}>
          <AlertForward onOk={onOkForward} onCancel={onCancelForward} />
        </div>
      )}
      {isDelete && (
        <div className={styles.alert}>
          <AlertDelete
            id={message.uid}
            title="Удалить сообщение"
            message="Вы действительно хотите удалить сообщение?"
            showCheckBox={isIncomingCard ? false : true}
            labelCheckBox={
              isIncomingCard
                ? undefined
                : `Удалить у меня и у ${message.to_user?.first_name !== '' ? message.to_user?.first_name : message.to_user?.nickname}`
            }
            onOk={onOkDelete}
            onCancel={onCancelDelete}
          />
        </div>
      )}
      {isCopy && (
        <div className={styles.alert}>
          <NotificationCopyCard />
        </div>
      )}
    </div>
  );
};

const NotificationCopyCard = (): JSX.Element => {
  return (
    <div className={styles.wrapperNotification}>
      <div className={styles.iconNotification}>
        <Copy />
      </div>
      <div className={styles.textNotification}>Скопировано в буфер обмена</div>
    </div>
  );
};
