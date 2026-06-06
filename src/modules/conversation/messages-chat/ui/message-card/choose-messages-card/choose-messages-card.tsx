'use client';
import { useAlert } from 'modules/conversation/messages-chat/hooks/use-alert';
import { copyMessageToClipboard } from 'modules/conversation/messages-chat/utils/copy-message-to-clipboard';
import { formatMessages } from 'modules/conversation/messages-chat/utils/format-messages';
import {
  useSelectedUidUserForForwardMessageStore,
  useToastVisibleStore,
} from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import { useRouter } from 'next/navigation';
import { JSX, useEffect, useRef } from 'react';
import Close from '../icons/close-choose.svg';
import Copy from '../icons/copy-choose.svg';
import Delete from '../icons/delete.svg';
import Forward from '../icons/forward.svg';
import styles from './choose-messages-card.module.scss';
import type { ChooseMessagesCardProps } from './choose-messages-card.props';

export const ChooseMessagesCard = ({
  setCheckBoxsVisibleStore,
  selectedMessagesStore,
  clearSelectedMessagesStore,
  sendDeleteMessage,
}: ChooseMessagesCardProps): JSX.Element => {
  const handleClose = (): void => {
    setCheckBoxsVisibleStore(false);
    clearSelectedMessagesStore();
  };

  const { confirm } = useAlert();
  const router = useRouter();
  const selectedUidUserForForwardMessageStore = useSelectedUidUserForForwardMessageStore(
    (s) => s.selectedUidUserForForwardMessage,
  );
  const selectedUidUserForForwardMessageRef = useRef<string>(selectedUidUserForForwardMessageStore);
  useEffect(() => {
    selectedUidUserForForwardMessageRef.current = selectedUidUserForForwardMessageStore;
  }, [selectedUidUserForForwardMessageStore, selectedUidUserForForwardMessageRef]);
  //обработчик для меню 'пересласть'
  const handleForwardClick = async (): Promise<void> => {
    if (!selectedMessagesStore?.length) return;
    const ok = await confirm({
      isMessageForwarding: true,
    });
    if (ok && selectedUidUserForForwardMessageRef.current) {
      setCheckBoxsVisibleStore(false);
      router.push(`/chats/${selectedUidUserForForwardMessageRef.current}`);
    }
  };
  //управлят состояние показать карточку, что сообщение скопировано, либо нет
  const setToastVisibleStore = useToastVisibleStore((s) => s.setToastVisible);
  //обработчик для меню 'копировать'
  const handleCopyClick = (): void => {
    if (!selectedMessagesStore?.length) return;
    let acc = '';
    selectedMessagesStore.forEach((message) => {
      if (message?.files_list?.length || message?.forwarded_messages[0]?.files_list?.length) {
        try {
          // Получаем объект файла
          const files = message.files_list.length ? message.files_list : message.forwarded_messages[0]?.files_list;
          if (!files.length) throw new Error('Файл не найден');
          files.forEach(async (file) => {
            // Очищаем URL от лишнего слеша
            const cleanUrl = file.file_protected_url.replace(/\.(jpe?g|png|gif|webp)\/$/i, '.$1');
            const urlObj = new URL(cleanUrl);
            const pathAfterFirstSlash = urlObj.pathname.slice(1);
            const proxyUrl = `/api/proxy/${pathAfterFirstSlash}/`;
            const response = await fetch(proxyUrl, {
              method: 'GET',
            });
            const blob = await response.blob();
            // Сохранение файла
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.download_name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          });
        } catch (error) {
          console.error('Ошибка скачивания:', error);
        }
      } else {
        acc = acc + `${message.content} `;
      }
    });
    copyMessageToClipboard(acc ?? '', setToastVisibleStore);
    // показываем карточку в DOM, что файл уже сохранен и через 2 сек. закрываем
    setToastVisibleStore(true);
    setTimeout(() => setToastVisibleStore(false), 2000);
    setCheckBoxsVisibleStore(false);
    clearSelectedMessagesStore();
  };

  //обработчик для меню 'удалить'
  const handleDeleteClick = async (): Promise<void> => {
    if (!selectedMessagesStore?.length) return;
    const ok = await confirm({
      title: 'Удалить сообщения',
      message: 'Вы действительно хотите удалить сообщения?',
    });
    if (ok) {
      selectedMessagesStore?.forEach((m) => sendDeleteMessage(m, true));
      setCheckBoxsVisibleStore(false);
      clearSelectedMessagesStore();
    }
  };
  //выясняем имеются ли в выбранных сообщениях телефонные звонки
  const hasPhoneCall = selectedMessagesStore?.some((message) => message.message_rtc !== null);

  return (
    <div className={styles.wrapper}>
      <div className={styles.info}>
        <div className={styles.icon}>
          <div className={styles.icon} onClick={handleClose}>
            <Close />
          </div>
        </div>
        <div className={styles.text}>{`Выбрано ${formatMessages(selectedMessagesStore?.length ?? 0)}`}</div>
      </div>
      <div className={styles.icon}>
        <button
          className={(selectedMessagesStore?.length ?? 0) && !hasPhoneCall ? styles.icon : styles.iconBlock}
          onClick={handleForwardClick}
          disabled={!selectedMessagesStore?.length || hasPhoneCall}
        >
          <Forward />
        </button>
      </div>
      <div className={styles.icon}>
        <button
          className={(selectedMessagesStore?.length ?? 0) && !hasPhoneCall ? styles.icon : styles.iconBlock}
          onClick={handleCopyClick}
          disabled={!selectedMessagesStore?.length || hasPhoneCall}
        >
          <Copy />
        </button>
      </div>
      <div className={styles.icon}>
        <button
          className={(selectedMessagesStore?.length ?? 0) ? styles.iconRed : styles.iconBlock}
          onClick={handleDeleteClick}
          disabled={!selectedMessagesStore?.length}
        >
          <Delete />
        </button>
      </div>
    </div>
  );
};
