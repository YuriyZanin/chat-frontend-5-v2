import clsx from 'clsx';
import type { ChatFilesListApi } from 'modules/info/model/info.api.schema';
import { LINKS } from 'modules/info/shared/utils/mock';
import { JSX, ReactElement, useState } from 'react';
import { FilesTab } from './files-tab';
import styles from './info-uploads.module.scss';
import { InfoUploadsProps } from './info-uploads.props';
import { LinksTab } from './links-tab';
import { MediaTab } from './media-tab';
import { ParticipantsTab } from './participants-tab';
import { VoicesTab } from './voices-tab';

export const InfoUploads = ({ tabs, chatKey, currentUid, wsUrl, filesList }: InfoUploadsProps): JSX.Element => {
  const [activeTab, setActiveTab] = useState(0);
  const imagesArray: ChatFilesListApi[] = [];
  const filesArray: ChatFilesListApi[] = [];
  const voicesArray: ChatFilesListApi[] = [];

  if (filesList && filesList.length) {
    filesList.forEach((file) => {
      if (file.media_kind === 'image') {
        imagesArray.push(file);
      }
      if (file.media_kind === 'file') {
        filesArray.push(file);
      }
      if (file.media_kind === 'voice') {
        voicesArray.push(file);
      }
    });
  }
  const renderTab = (): ReactElement | null => {
    const tab = tabs[activeTab];
    switch (tab) {
      case 'Медиа':
        return <MediaTab items={imagesArray} currentUid={currentUid} wsUrl={wsUrl} />;
      case 'Файлы':
        return <FilesTab items={filesArray} />;
      case 'Голосовые':
        return <VoicesTab items={voicesArray} />;
      case 'Ссылки':
        return <LinksTab items={LINKS} />;
      case 'Участники':
        return <ParticipantsTab currentUid={currentUid} chatKey={chatKey || ''} />;
      case 'Подписчики':
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
