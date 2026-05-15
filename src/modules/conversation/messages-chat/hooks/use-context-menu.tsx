'use client';
import { useRouter } from 'next/navigation';
import type { MouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { RestMessageApi } from '../model/messages-list';
import {
  useForwardMessageStore,
  useRepliedMessageStore,
  useSelectedMessagesStore,
  useSelectedUidUserForForwardMessageStore,
} from '../zustand-store/zustand-store';
import { useAlert } from './use-alert';

type UseContextMenuProps = {
  menuWidth: number;
  menuHeight: number;
  sendDeleteMessage: (
    message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' },
    selected?: boolean,
  ) => void;
  message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' };
  labelCheckBox?: string;
  showCheckBox: boolean;
};

type UseContextMenuReturn = {
  handleContextMenu: (event: MouseEvent<HTMLDivElement>) => void;
  handleCloseMenu: () => void;
  handleDeleteClick: () => Promise<void>;
  handleForwardClick: () => Promise<void>;
  handleCheckBoxClick: () => void;
  contextMenuPos: { x: number; y: number };
  contextMenuVisible: boolean;
  has: boolean | undefined;
};

export const useContextMenu = ({
  menuWidth,
  menuHeight,
  sendDeleteMessage,
  message,
  showCheckBox = false,
  labelCheckBox,
}: UseContextMenuProps): UseContextMenuReturn => {
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [contextMenuVisible, setContextMenuVisible] = useState<boolean>(false);
  const handleContextMenu = (event: MouseEvent<HTMLDivElement>): void => {
    event.preventDefault();
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
  const selectedUidUserForForwardMessageStore = useSelectedUidUserForForwardMessageStore(
    (s) => s.selectedUidUserForForwardMessage,
  );
  const selectedUidUserForForwardMessageRef = useRef<string>(selectedUidUserForForwardMessageStore);
  const clearSelectedMessagesStore = useSelectedMessagesStore((s) => s.clearSelectedMessages);
  useEffect(() => {
    selectedUidUserForForwardMessageRef.current = selectedUidUserForForwardMessageStore;
  }, [selectedUidUserForForwardMessageStore, selectedUidUserForForwardMessageRef]);

  const handleDeleteClick = async (): Promise<void> => {
    const ok = await confirm({
      title: 'Удалить сообщение',
      message: 'Вы действительно хотите удалить сообщение?',
      showCheckBox,
      labelCheckBox,
    });

    if (ok) {
      // вызываем переданный обработчик удаления
      sendDeleteMessage(message);
    } else {
      // отмена — ничего не делаем
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
  return {
    handleContextMenu,
    handleCloseMenu,
    handleDeleteClick,
    handleForwardClick,
    handleCheckBoxClick,
    contextMenuPos,
    contextMenuVisible,
    has,
  };
};
