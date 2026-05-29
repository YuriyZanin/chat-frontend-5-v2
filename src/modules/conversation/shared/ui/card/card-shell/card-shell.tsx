'use client';
import clsx from 'clsx';
import { ContextMenu } from 'modules/conversation/chats/ui/context-menu/context-menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { JSX, MouseEvent, useRef, useState } from 'react';
import { ImageUI } from 'shared/ui/image';
import styles from './card-shell.module.scss';
import { CardShellProps } from './card-shell.props';

const URL_DEFAUIT_Avatar = '/images/messages-chats/default-avatar.svg';
const URL_DEFAUIT_Avatar_Croup = '/images/messages-chats/default-avatar-group.svg';

export const CardShell = ({
  children,
  chatId,
  lastMessageId,
  hasNewMessages,
  nickname,
  isInContacts,
  isFavorite,
  notifications,
  href,
  imageOptions,
  hasContextMenu,
  isModal,
  selected,
  selectAction,
  chatType,
}: CardShellProps): JSX.Element => {
  const pathname = usePathname();
  const isActive = isModal ? selected : pathname === href || selected;
  const { src, alt, classNames } = imageOptions;
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [contextMenuVisible, setContextMenuVisible] = useState<boolean>(false);

  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleContextMenu = (event: MouseEvent<HTMLDivElement>): void => {
    event.preventDefault();
    if (cardRef.current) {
      const { y, x } = cardRef.current.getBoundingClientRect();
      const menuHeight = 238;
      const adjustedX = x + 77;
      const adjustedY = y + 65;
      const constrainedY =
        adjustedY + menuHeight - (window.innerHeight - 245) > 0 ? adjustedY - menuHeight - 58 : adjustedY;
      const constrainedX = adjustedX;
      setContextMenuPos({ x: constrainedX, y: constrainedY });
      setContextMenuVisible(true);
    }
  };

  const handleCloseMenu = (): void => {
    setContextMenuVisible(false);
  };

  return (
    <div ref={cardRef} onContextMenu={handleContextMenu} onMouseLeave={handleCloseMenu}>
      {hasContextMenu && (
        <ContextMenu
          chatId={chatId}
          lastMessageId={lastMessageId}
          nickname={nickname}
          isInContacts={isInContacts}
          isFavorite={isFavorite}
          hasNewMessages={hasNewMessages}
          notifications={notifications}
          position={contextMenuPos}
          visible={contextMenuVisible}
          onClose={handleCloseMenu}
        />
      )}
      <li className={styles.li}>
        <Link
          href={href}
          className={clsx(styles.link, {
            [styles.cardSelect]: isActive,
            [styles.contextMenu]: contextMenuVisible,
          })}
          onClick={selectAction}
        >
          <ImageUI
            src={src ? src : chatType === 'chat' ? URL_DEFAUIT_Avatar : URL_DEFAUIT_Avatar_Croup}
            alt={alt}
            fill
            classNames={{
              root: clsx(styles.imageWrapper, classNames?.root),
              image: clsx(styles.image, classNames?.image),
            }}
          />

          {children}
        </Link>
        <div className={styles.divider}></div>
      </li>
    </div>
  );
};
