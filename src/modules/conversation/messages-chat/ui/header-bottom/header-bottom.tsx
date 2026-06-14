'use client';
import clsx from 'clsx';
import { JSX, useEffect, useRef, useState } from 'react';
import { useWebSocketChat } from '../../api/web-socket/use-web-socket-chat';
import { useAlert } from '../../hooks/use-alert';
import {
  useAttachmentFilesStore,
  useAttachmentImagesStore,
  useAudioFilesStore,
  useForwardMessageStore,
  useRepliedMessageStore,
  useSelectedMessagesStore,
  useSelectedUidUserForForwardMessageStore,
  useTextForAttachmentFilesStore,
  useTextForAttachmentImagesStore,
  useUserIdStore,
} from '../../zustand-store/zustand-store';
import { ContextMenuAttachFile } from '../context-menu/context-menu-attach-file/context-menu-attach-file';
import type { Attachment } from '../context-menu/context-menu-attach-file/context-menu-attach-file.props';
import { ChooseMessagesCard } from '../message-card/choose-messages-card/choose-messages-card';
import { ForwardMessageCard } from '../message-card/forward-message-card/forward-message-card';
import { ForwardMessagesCard } from '../message-card/forward-messages-card/forward-messages-card';
import { ReplyToMessageCard } from '../message-card/reply-to-message-card/reply-to-message-card';
import { MessageInput } from '../message-input/message-input';
import { AudioRecorderHeader } from './audio-recorder-header/audio-recorder-header';
import styles from './header-bottom.module.scss';
import type { HeaderBottomProps } from './header-bottom.props';
import ClipIcon from './icon/clip.svg';
import MicIcon from './icon/mic.svg';
import Submit from './icon/submit.svg';

export const HeaderBottom = ({ wsUrl, currentUserId, refreshUrl }: HeaderBottomProps): JSX.Element => {
  const [textInput, setTextInput] = useState<string>('');
  const repliedMessageStore = useRepliedMessageStore((s) => s.repliedMessage);
  const clearRepliedMessageStore = useRepliedMessageStore((s) => s.clearRepliedMessage);
  const forwardMessageStore = useForwardMessageStore((s) => s.forwardMessage);
  const clearForwardMessageStore = useForwardMessageStore((s) => s.clearForwardMessage);
  const clearSelectedUidUserForForwardMessageStore = useSelectedUidUserForForwardMessageStore(
    (s) => s.clearSelectedUidUserForForwardMessage,
  );
  const selectedMessagesStore = useSelectedMessagesStore((s) => s.selectedMessages);
  const clearSelectedMessagesStore = useSelectedMessagesStore((s) => s.clearSelectedMessages);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const { sendMessage, sendDeleteMessage } = useWebSocketChat(wsUrl, currentUserId, refreshUrl);
  const userIdStore = useUserIdStore((s) => s.userId);
  const attachmentFilesStore = useAttachmentFilesStore((s) => s.attachmentFiles);
  const attachmentImagesStore = useAttachmentImagesStore((s) => s.attachmentImages);
  const textForAttachmentFilesStore = useTextForAttachmentFilesStore((s) => s.textForAttachmentFiles);
  const textForAttachmentImagesStore = useTextForAttachmentImagesStore((s) => s.textForAttachmentImages);
  const clearAttachmentFilesStore = useAttachmentFilesStore((s) => s.clearAttachmentFiles);
  const clearAttachmentImagesStore = useAttachmentImagesStore((s) => s.clearAttachmentImages);
  const clearTextForAttachmentFilesStore = useTextForAttachmentFilesStore((s) => s.clearTextForAttachmentFiles);
  const clearTextForAttachmentImagesStore = useTextForAttachmentImagesStore((s) => s.clearTextForAttachmentImages);
  const textForAttachmentFilesRef = useRef<string>(textForAttachmentFilesStore);
  const textForAttachmentImagesRef = useRef<string>(textForAttachmentImagesStore);
  const attachmentFilesRef = useRef<Attachment[]>(attachmentFilesStore);
  const attachmentImagesRef = useRef<Attachment[]>(attachmentImagesStore);
  const audioFilesStore = useAudioFilesStore((s) => s.audioFiles);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const checkBoxsVisibleStore = useSelectedMessagesStore((s) => s.checkBoxsVisible);
  const setCheckBoxsVisibleStore = useSelectedMessagesStore((s) => s.setCheckBoxsVisible);
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [contextMenuVisible, setContextMenuVisible] = useState<boolean>(false);
  const clipIconButtonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    textForAttachmentFilesRef.current = textForAttachmentFilesStore;
    textForAttachmentImagesRef.current = textForAttachmentImagesStore;
    attachmentFilesRef.current = attachmentFilesStore.slice(-10); // берем только поледних 10 файлов из массива
    attachmentImagesRef.current = attachmentImagesStore.slice(-4); // берем только последних 4 файла из массива
  }, [textForAttachmentFilesStore, attachmentFilesStore, textForAttachmentImagesStore, attachmentImagesStore]);

  useEffect(() => {
    if (repliedMessageStore || forwardMessageStore || selectedMessagesStore?.length || userIdStore) {
      inputRef.current?.focus();
    }
  }, [
    repliedMessageStore,
    forwardMessageStore,
    selectedMessagesStore,
    userIdStore,
    audioFilesStore,
    checkBoxsVisibleStore,
  ]);

  //эффект в случае перехода в другой чат закрываем <ChooseMessagesCard /> и убираем checkbox cj dct[ cjj,otybq]
  useEffect(() => {
    setCheckBoxsVisibleStore(false);
  }, [userIdStore]);

  const handleSubmitForm = (form: React.FormEvent<HTMLFormElement>): void => {
    form.preventDefault();
    sendMessage({ content: textInput, repliedMessage: repliedMessageStore });
    if (forwardMessageStore) {
      sendMessage({ content: forwardMessageStore?.content ?? '', forwardMessage: forwardMessageStore });
    }
    if (selectedMessagesStore && selectedMessagesStore.length) {
      selectedMessagesStore.forEach((msg) => {
        sendMessage({ content: msg.content ?? '', forwardMessage: msg });
      });
    }
    clearSelectedUidUserForForwardMessageStore();
    if (document.activeElement === inputRef.current || document.activeElement === submitButtonRef.current) {
      clearRepliedMessageStore();
      clearForwardMessageStore();
      clearSelectedMessagesStore();
    }
    setTextInput('');
    clearAttachmentFilesStore();
    clearAttachmentImagesStore();
    clearTextForAttachmentFilesStore();
    clearTextForAttachmentImagesStore();
  };

  const handleContextMenu = (): void => {
    if (clipIconButtonRef.current) {
      const { y, x } = clipIconButtonRef.current.getBoundingClientRect();
      const menuHeight = 108;
      const adjustedX = x - 10;
      const adjustedY = y - menuHeight - 10;
      setContextMenuPos({ x: adjustedX, y: adjustedY });
      setContextMenuVisible(true);
      setTextInput('');
    }
  };
  const handleCloseMenu = (): void => {
    setContextMenuVisible(false);
  };
  // xyk для открытия модального окна с алертом
  const { confirm } = useAlert();
  // блок вызова модального окна с обработчиком для отправки сообщения и вложенных файлов
  const handleAttachmentFilesClick = async (): Promise<void> => {
    const ok = await confirm({
      isAttachmentFiles: true,
    });
    if (ok) {
      sendMessage({
        content: textForAttachmentFilesRef.current,
      });
      if (attachmentFilesRef.current && attachmentFilesRef.current.length) {
        attachmentFilesRef.current.forEach((attachmentFile) => {
          sendMessage({
            content: attachmentFile.fileData.filename,
            repliedMessage: repliedMessageStore,
            file: attachmentFile,
          });
        });
      }
      if (forwardMessageStore) {
        sendMessage({ content: forwardMessageStore?.content ?? '', forwardMessage: forwardMessageStore });
      }
      if (selectedMessagesStore) {
        selectedMessagesStore.forEach((msg) => {
          sendMessage({ content: msg.content ?? '', forwardMessage: msg });
        });
      }
      clearForwardMessageStore();
      clearSelectedUidUserForForwardMessageStore();
      clearRepliedMessageStore();
      setTextInput('');
      clearAttachmentFilesStore();
      clearAttachmentImagesStore();
      clearSelectedMessagesStore();
      clearTextForAttachmentFilesStore();
      clearTextForAttachmentImagesStore();
      inputRef.current?.focus();
    } else {
      // отмена — ничего не делаем
    }
  };

  // блок вызова модального окна с обработчиком для отправки сообщения и вложенных картинок/изображений
  const handleAttachmentImagesClick = async (): Promise<void> => {
    const ok = await confirm({
      isAttachmentImages: true,
    });
    if (ok) {
      if (!!textForAttachmentImagesRef.current || !!attachmentImagesRef.current)
        sendMessage({
          content: textForAttachmentImagesRef.current,
          repliedMessage: repliedMessageStore,
          images: attachmentImagesRef.current,
        });
      if (forwardMessageStore) {
        sendMessage({ content: forwardMessageStore?.content ?? '', forwardMessage: forwardMessageStore });
      }
      if (selectedMessagesStore) {
        selectedMessagesStore.forEach((msg) => {
          sendMessage({ content: msg.content ?? '', forwardMessage: msg });
        });
      }
      clearForwardMessageStore();
      clearSelectedUidUserForForwardMessageStore();
      clearRepliedMessageStore();
      setTextInput('');
      clearAttachmentFilesStore();
      clearAttachmentImagesStore();
      clearSelectedMessagesStore();
      clearTextForAttachmentFilesStore();
      clearTextForAttachmentImagesStore();
      inputRef.current?.focus();
    } else {
      // отмена — ничего не делаем
    }
  };

  //состояние для записи аудиосообщения
  const [isRecordingMessage, setIsRecordingMessage] = useState<boolean>(false);
  return (
    <div className={styles.block}>
      {checkBoxsVisibleStore ? (
        <ChooseMessagesCard
          setCheckBoxsVisibleStore={setCheckBoxsVisibleStore}
          selectedMessagesStore={selectedMessagesStore}
          clearSelectedMessagesStore={clearSelectedMessagesStore}
          sendDeleteMessage={sendDeleteMessage}
        />
      ) : (
        <>
          {repliedMessageStore && (
            <ReplyToMessageCard
              repliedMessageStore={repliedMessageStore}
              clearRepliedMessageStore={clearRepliedMessageStore}
            />
          )}
          {forwardMessageStore && (
            <ForwardMessageCard
              forwardMessageStore={forwardMessageStore}
              clearForwardMessageStore={clearForwardMessageStore}
            />
          )}
          {!!selectedMessagesStore?.length && (
            <ForwardMessagesCard
              selectedMessagesStore={selectedMessagesStore}
              clearSelectedMessagesStore={clearSelectedMessagesStore}
              currentUserId={currentUserId}
            />
          )}
          {isRecordingMessage ? (
            <AudioRecorderHeader setIsRecordingMessage={setIsRecordingMessage} sendMessage={sendMessage} />
          ) : (
            <form className={styles.wrapper} onSubmit={handleSubmitForm}>
              <div
                className={contextMenuVisible ? clsx(styles.clipIcon, styles.clipIconActive) : styles.clipIcon}
                ref={clipIconButtonRef}
                onClick={handleContextMenu}
              >
                {contextMenuVisible && (
                  <ContextMenuAttachFile
                    contextMenuPos={contextMenuPos}
                    handleCloseMenu={handleCloseMenu}
                    handleAttachmentFilesClick={handleAttachmentFilesClick}
                    handleAttachmentImagesClick={handleAttachmentImagesClick}
                  />
                )}
                <ClipIcon />
              </div>
              <MessageInput textInput={textInput} setTextInput={setTextInput} inputRef={inputRef} />
              <span className={styles.micIcon}>
                {textInput ? (
                  <button ref={submitButtonRef} type="submit" style={{ width: '5rem', height: '5rem' }}>
                    <Submit />
                  </button>
                ) : (
                  <button onClick={() => setIsRecordingMessage(true)}>
                    <MicIcon />
                  </button>
                )}
              </span>
            </form>
          )}
        </>
      )}
    </div>
  );
};
