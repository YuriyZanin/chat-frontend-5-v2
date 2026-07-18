'use client';
import clsx from 'clsx';
import { ContextMenu } from 'modules/conversation/chats/ui/context-menu/context-menu';
import { removeDomain } from 'modules/conversation/chats/utils/utils';
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
  variant,
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
  let result: string;
  if (variant === 'personal' || variant === undefined)
    if (src?.includes('blob:')) {
      // создаем url для запроса картинки через наш прокси-сервер
      result = src;
    } else {
      result = `/api/proxy${removeDomain(src)}`;
    }
  else {
    result = src;
  }
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
          chatType={chatType}
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
            src={
              result && result !== '/api/proxy'
                ? result
                : chatType === 'chat' || variant
                  ? URL_DEFAUIT_Avatar
                  : URL_DEFAUIT_Avatar_Croup
            }
            alt={alt}
            fill
            unoptimized
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
