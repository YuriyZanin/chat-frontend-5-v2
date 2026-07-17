import { useMessagesChatStore } from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import { useNotificationStore } from 'modules/notification/model/notification.store';
import { JSX, useEffect, useRef, useState } from 'react';
import styles from './notification-modal.module.scss';
export const NotificationModal = ({
  chatKey,
  posCopy,
}: {
  chatKey: string;
  posCopy: { top: number; left: number };
}): JSX.Element | null => {
  const { isModalOpen, timer, icon, title, setIcon, setTitle, closePopup, callback, setCallback, setTimer } =
    useNotificationStore();

  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const [remainingTime, setRemainingTime] = useState(timer);
  const clearMessagesForUserStore = useMessagesChatStore((s) => s.clearMessagesForUser);

  useEffect(() => {
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
    }

    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }

    if (!isModalOpen) return;

    timerIdRef.current = setTimeout(() => {
      callback?.();
      // мгновенно очищаем группу/канал от сообщений
      clearMessagesForUserStore(chatKey);
      closePopup();
      setIcon(undefined);
      setTitle('');
      setCallback(undefined);
      setTimer(1000);
    }, timer);

    intervalIdRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = prev - 1000;
        if (newTime <= 0) {
          clearInterval(intervalIdRef.current!);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return (): void => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [
    [
      isModalOpen,
      timer,
      chatKey,
      callback,
      clearMessagesForUserStore,
      closePopup,
      setIcon,
      setTitle,
      setCallback,
      setTimer,
    ],
  ]);

  const cancelTimer = (): void => {
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
      timerIdRef.current = null;
    }
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }

    closePopup();
    setIcon(undefined);
    setTitle('');
    setCallback(undefined);
    setTimer(1000);
    setRemainingTime(1000);
  };

  if (!isModalOpen) return null;

  const displayTime = remainingTime / 1000;

  return (
    <div
      className={styles.modal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{
        position: 'fixed',
        left: `${posCopy.left}px`,
        top: `${posCopy.top}px`,
      }}
    >
      <div className={styles.info}>
        {callback && <div className={styles.counter}>{displayTime}</div>}
        {icon && <div className={styles.icon}>{icon}</div>}
        <div className={styles.title}>{title}</div>
      </div>
      {callback && (
        <button className={styles.cancelButton} onClick={cancelTimer}>
          Отменить
        </button>
      )}
    </div>
  );
};
