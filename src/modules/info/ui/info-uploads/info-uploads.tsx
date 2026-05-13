import clsx from 'clsx';
import type { RestMessageFileApi } from 'modules/conversation/messages-chat/model/messages-list/user-messages.api.schema';
import type { Msg } from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import { LINKS } from 'modules/info/shared/utils/mock';
import { JSX, ReactElement, useState } from 'react';
import { FilesTab } from './files-tab';
import styles from './info-uploads.module.scss';
import { InfoUploadsProps } from './info-uploads.props';
import { LinksTab } from './links-tab';
import { MediaTab } from './media-tab';
import { ParticipantsTab } from './participants-tab';
import { VoicesTab } from './voices-tab';

export const InfoUploads = ({ messagesByUser, chatKey, currentUid, wsUrl }: InfoUploadsProps): JSX.Element => {
  const [activeTab, setActiveTab] = useState(0);

  const PHOTOS: Msg[] = [];
  const FILES: RestMessageFileApi[] = [];
  const VOICES: RestMessageFileApi[] = [];
  const tabs = ['Медиа', 'Файлы', 'Голосовые', 'Ссылки'];
  if (messagesByUser && messagesByUser.length) {
    messagesByUser.forEach((message) => {
      if (message?.files_list?.length || message?.forwarded_messages[0]?.files_list?.length) {
        const filesList = message?.files_list?.length ? message.files_list : message.forwarded_messages[0].files_list;
        filesList.forEach((file) => {
          if (file.media_kind === 'image' && file.file_type === 'image/jpeg') {
            PHOTOS.push({ ...message, files_list: [file] });
          }
          if (file.media_kind === 'file' && file.file_type?.includes('application/')) {
            FILES.push(file);
          }
          if (file.media_kind === 'file' && file.file_type === 'video/webm') {
            VOICES.push(file);
          }
        });
      }
    });
  }
  const renderTab = (): ReactElement | null => {
    const tab = tabs[activeTab];

    switch (tab) {
      case 'Медиа':
        return <MediaTab items={PHOTOS} currentUid={currentUid} wsUrl={wsUrl} />;
      case 'Файлы':
        return <FilesTab items={FILES} />;
      case 'Голосовые':
        return <VoicesTab items={VOICES} />;
      case 'Ссылки':
        return <LinksTab items={LINKS} />;
      case 'members':
        return <ParticipantsTab currentUid={currentUid} chatKey={chatKey || ''} />;
      case 'subscribers':
        return <ParticipantsTab currentUid={currentUid} chatKey={chatKey || ''} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={clsx(styles.tab, activeTab === index && styles.active)}
            onClick={() => setActiveTab(index)}
          >
            <div className={styles.tabButtons}>
              <span className={styles.label}>{tab}</span>
              <div className={clsx(styles.border, activeTab === index && styles.active)}></div>
            </div>
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>{renderTab()}</div>
    </div>
  );
};
