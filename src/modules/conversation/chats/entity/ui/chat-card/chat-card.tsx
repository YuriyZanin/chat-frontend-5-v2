'use client';

import clsx from 'clsx';
import { Chat } from 'modules/conversation/chats/entity';
import { CardHeader, CardShell } from 'modules/conversation/shared/ui/card';
import { useInfoStore } from 'modules/info/model/info.store';
import { usePathname } from 'next/navigation';
import { JSX } from 'react';
import { CardHeaderMeta } from './card-header-meta';
import { CardNewMessageMeta } from './card-new-message-meta';
import { CardPreview } from './card-preview';
import { CHAT_TYPE_PREFIXES } from './chat-card.constant';
import styles from './chat-card.module.scss';
import { MutedIcon } from './icons';

export const ChatCard = ({ peer, chat, messages }: Chat): JSX.Element => {
  const { setChatId } = useInfoStore();
  const { id, notifications, is_favorite, newMessageCount, chatType } = chat;
  const { firstName, lastName, uid, nickname } = peer;
  const {
    lastSeenMessage,
    lastMessage: {
      id: lastMessageId,
      uid: lastMessageUid,
      updatedAt = undefined,
      content = '',
      hasForwardedMessage = false,
      hasRepliedMessage = false,
      filesSummary = undefined,
    } = {},
  } = messages || {};

  const pathname = usePathname();
  const prefix = CHAT_TYPE_PREFIXES[chat.chatType];
  const isSelected = pathname === `/chats/${chat.chatType === 'chat' ? peer.uid : `${prefix}_${peer.uid}`}`;
  const hasNewMessages = lastMessageUid !== uid && lastSeenMessage?.id !== lastMessageId;

  const handleClick = (): void => {
    setChatId(id);
  };

  return (
    <CardShell
      chatId={chat.id}
      lastMessageId={lastMessageId}
      hasNewMessages={hasNewMessages}
      nickname={nickname}
      notifications={notifications}
      isInContacts={peer.isInContacts}
      isFavorite={chat.is_favorite}
      href={`/chats/${chat.chatType === 'chat' ? peer.uid : `${prefix}_${peer.uid}`}`}
      hasContextMenu={true}
      imageOptions={{
        src: peer.avatarUrl,
        alt: chat.name,
        classNames: { root: styles.imageWrapper },
      }}
      selectAction={handleClick}
      chatType={chatType}
    >
      <div className={styles.card}>
        <div className={styles.header}>
          <CardHeader title={firstName ? `${firstName} ${lastName}` : `${nickname}`} selected={isSelected}>
            {!notifications && <MutedIcon className={styles.mutedIcon} />}
          </CardHeader>

          <CardHeaderMeta
            className={clsx(styles.headerMeta, isSelected ? styles.headerMetaSelected : undefined)}
            updatedAt={updatedAt}
          />
        </div>

        <div className={clsx(styles.preview, { [styles.previewSelected]: isSelected })}>
          <CardPreview
            content={content}
            filesSummary={filesSummary}
            replied={hasRepliedMessage}
            forwarded={hasForwardedMessage}
          />

          <CardNewMessageMeta newMessageCount={newMessageCount} isFavorite={is_favorite} />
        </div>
      </div>
    </CardShell>
  );
};
