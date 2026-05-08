'use client';
import clsx from 'clsx';
import { JSX } from 'react';
import { useDownloadMessageFile } from '../../hooks/use-download-message-file';
import type { RestMessageApi } from '../../model/messages-list';
import { copyMessageToClipboard } from '../../utils/copy-message-to-clipboard';
import {
  useForwardMessageStore,
  useRepliedMessageStore,
  useSelectedMessagesStore,
  useToastVisibleStore,
} from '../../zustand-store/zustand-store';
import styles from './context-menu.module.scss';
import type { ContextMenuProps } from './context-menu.props';
import Answer from './icons/answer.svg';
import Selected from './icons/check.svg';
import Copy from './icons/copy.svg';
import Delete from './icons/delete.svg';
import Forward from './icons/forward.svg';

export const ContextMenu = ({
  position,
  visible,
  onClose,
  handleDeleteClick,
  handleForwardClick,
  message,
}: ContextMenuProps): JSX.Element | null => {
  const setRepliedMessageStore = useRepliedMessageStore((s) => s.setRepliedMessage);
  const clearRepliedMessageStore = useRepliedMessageStore((s) => s.clearRepliedMessage);
  const clearForwardMessageStore = useForwardMessageStore((s) => s.clearForwardMessage);
  const addSelectedMessagesStore = useSelectedMessagesStore((s) => s.addSelectedMessages);
  const clearSelectedMessagesStore = useSelectedMessagesStore((s) => s.clearSelectedMessages);

  const handleAnswerClick = (): void => {
    setRepliedMessageStore(message);
    clearForwardMessageStore();
    clearSelectedMessagesStore();
    onClose();
  };
  // хук для скачивания файла(картинки) с сервера, который находится в сообщении
  const { handleDownloadMessageFileClick } = useDownloadMessageFile(message);
  //управлят состояние показать карточку, что сообщение скопировано, либо нет
  const setToastVisibleStore = useToastVisibleStore((s) => s.setToastVisible);
  //обработчика для контекстного меню 'Cкопировать'
  const handleCopyClick = (message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' }): void => {
    if (message?.files_list?.length || message?.forwarded_messages[0]?.files_list?.length) {
      handleDownloadMessageFileClick();
      onClose();
    } else {
      copyMessageToClipboard(message.content ?? '', setToastVisibleStore);
      onClose();
    }
  };
  // показывать компоненты <MessageCheckBox/> в DOM либо нет
  const setCheckBoxsVisibleStore = useSelectedMessagesStore((s) => s.setCheckBoxsVisible);

  const handleSelectedClick = (): void => {
    setCheckBoxsVisibleStore(true);
    clearSelectedMessagesStore();
    clearForwardMessageStore();
    clearRepliedMessageStore();
    addSelectedMessagesStore(message);
    onClose();
  };

  if (!visible) return null;
  return (
    <div className={styles.wrapper} onMouseLeave={onClose} style={{ top: position.y, left: position.x }}>
      <button className={clsx(styles.cell, styles.cellTop)} onClick={handleAnswerClick}>
        <div className={styles.text}>Ответить</div>
        <div className={styles.icon}>
          <Answer />
        </div>
      </button>
      <button className={styles.cell} onClick={handleForwardClick}>
        <div className={styles.text}>Переслать</div>
        <div className={styles.icon}>
          <Forward />
        </div>
      </button>
      <button className={styles.cell} onClick={() => handleCopyClick(message)}>
        <div className={styles.text}>Скопировать</div>
        <div className={styles.icon}>
          <Copy />
        </div>
      </button>
      <button className={styles.cell} onClick={handleSelectedClick}>
        <div className={styles.text}>Выбрать</div>
        <div className={styles.icon}>
          <Selected />
        </div>
      </button>
      <button className={clsx(styles.cell, styles.cellBottom)} onClick={handleDeleteClick}>
        <div className={clsx(styles.text, styles.textRed)}>Удалить</div>
        <div className={styles.icon}>
          <Delete />
        </div>
      </button>
    </div>
  );
};
