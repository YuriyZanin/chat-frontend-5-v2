import { removeDomain } from 'modules/conversation/chats/utils/utils';
import { useWebSocketChat } from 'modules/conversation/messages-chat/api/web-socket/use-web-socket-chat';
import { useAlert } from 'modules/conversation/messages-chat/hooks/use-alert';
import { JSX } from 'react';
import { ImageUI } from 'shared/ui';
import styles from './media-tab.module.scss';
import { MediaProps, MediaTabProps } from './media-tab.props';
export const MediaTab = ({ items, currentUid, wsUrl, refreshUrl }: MediaTabProps): JSX.Element => {
  const { sendDeleteMessage } = useWebSocketChat(wsUrl, currentUid, refreshUrl);
  return (
    <div className={styles.container}>
      {items?.map((item, index) => (
        <MediaCard key={index} item={item} sendDeleteMessage={sendDeleteMessage} />
      ))}
    </div>
  );
};

const MediaCard = ({ item, sendDeleteMessage }: MediaProps): JSX.Element => {
  // создаем url для запроса картинки через наш прокси-сервер который в запрос вставляет токен чтобы пройти автоизацию
  const result = `/api/proxy${removeDomain((item.file_protected_url || item.file_webp_url) ?? '')}`;
  // xyk для открытия модального окна с алертом
  const { confirm } = useAlert();
  // блок вызова модального окна с обработчиком для отправки сообщения и вложенных файлов
  const handleOpenImages = async (): Promise<void> => {
    const ok = await confirm({
      openImages: {
        isOpenImages: true,
        sendDeleteMessage,
        isIncomingCard: true,
        message: {
          id: item.id,
          uid: item.uid,
          from_user: {
            uid: item.from_user?.uid || '',
            username: item.from_user?.uid || '',
            nickname: '',
            first_name: item.from_user?.first_name,
            last_name: item.from_user?.last_name,
            avatar_url: item.from_user?.avatar_webp_url || item.from_user?.avatar_small_url || '',
            avatar_webp_url: item.from_user?.avatar_webp_url || item.from_user?.avatar_small_url || '',
          },
          to_user: {
            uid: '',
            username: '',
            nickname: '',
            avatar_url: '',
            avatar_webp_url: '',
          },
          content: item.message?.content,
          replied_messages: [],
          forwarded_messages: [],
          files_list: [
            {
              id: item.id,
              uid: item.uid,
              download_name: item.download_name,
              media_kind: item.media_kind,
              file_protected_url: item.file_protected_url || item.file_webp_url || '',
              file_webp_url: item.file_protected_url || item.file_webp_url || '',
              file_small_url: item.file_protected_url || item.file_webp_url || '',
              file_type: item.file_type || '',
              created_at: item.created_at,
              updated_at: item.updated_at,
            },
          ],
          new: false,
          created_at: item.created_at,
          updated_at: item.updated_at,
          chat_id: item.id,
          chat_key: item.uid,
          chat_type: 'chat',
        },
      },
    });
  };
  return (
    <>
      <ImageUI
        src={result}
        alt={item.download_name}
        unoptimized
        width={117}
        height={117}
        className={styles.image}
        onClick={handleOpenImages}
      />
    </>
  );
};
