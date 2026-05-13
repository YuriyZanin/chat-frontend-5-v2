import { useWebSocketChat } from 'modules/conversation/messages-chat/api/web-socket/use-web-socket-chat';
import { useAlert } from 'modules/conversation/messages-chat/hooks/use-alert';
import { JSX } from 'react';
import { ImageUI } from 'shared/ui';
import styles from './media-tab.module.scss';
import { MediaProps, MediaTabProps } from './media-tab.props';

export const MediaTab = ({ items, currentUid, wsUrl }: MediaTabProps): JSX.Element => {
  const { sendDeleteMessage } = useWebSocketChat(wsUrl, currentUid);
  return (
    <div className={styles.container}>
      {items.map((item, index) => (
        <Media key={index} item={item} sendDeleteMessage={sendDeleteMessage} />
      ))}
    </div>
  );
};

const Media = ({ item, sendDeleteMessage }: MediaProps): JSX.Element => {
  // xyk для открытия модального окна с алертом
  const { confirm } = useAlert();
  // блок вызова модального окна с обработчиком для отправки сообщения и вложенных файлов
  const handleOpenImages = async (): Promise<void> => {
    const ok = await confirm({
      openImages: { isOpenImages: true, message: item, sendDeleteMessage, isIncomingCard: true },
    });
  };
  return (
    <>
      <ImageUI
        src={item.files_list[0].file_url}
        alt={item.files_list[0].download_name}
        width={117}
        height={117}
        className={styles.image}
        onClick={handleOpenImages}
      />
    </>
  );
};
