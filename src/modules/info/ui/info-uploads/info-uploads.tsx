import clsx from 'clsx';
import { LINKS } from 'modules/info/shared/utils/mock';
import { JSX, ReactElement, useState } from 'react';
import { FilesTab } from './files-tab';
import styles from './info-uploads.module.scss';
import { InfoUploadsProps } from './info-uploads.props';
import { LinksTab } from './links-tab';
import { MediaTab } from './media-tab';
import { ParticipantsTab } from './participants-tab';
import { VoicesTab } from './voices-tab';

export const InfoUploads = ({
  tabs,
  chatKey,
  currentUid,
  wsUrl,
  filesList,
  refreshUrl,
}: InfoUploadsProps): JSX.Element => {
  const [activeTab, setActiveTab] = useState(0);

  const renderTab = (): ReactElement | null => {
    const tab = tabs[activeTab];
    switch (tab) {
      case 'Медиа':
        return (
          <MediaTab items={filesList.imageFileList} currentUid={currentUid} wsUrl={wsUrl} refreshUrl={refreshUrl} />
        );
      case 'Файлы':
        return <FilesTab items={filesList.fileFileList} />;
      case 'Голосовые':
        return <VoicesTab items={filesList.voiceFileList} />;
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
