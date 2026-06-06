import { useDownloadMessageFile } from 'modules/conversation/messages-chat/hooks/use-download-message-file';
import { getMessageTimeOrDate } from 'modules/conversation/messages-chat/lib/get-message-time';
import { HighlightedFileName } from 'modules/conversation/messages-chat/ui/message-card/file-card/highlighted-file-name/highlighted-file-name';
import { formatBytes } from 'modules/info/utils/format-bytes-file';
import { JSX } from 'react';
import styles from './files-tab.module.scss';
import type { CardFileProps } from './files-tab.props';
import { FilesTabProps } from './files-tab.props';
import DeleteFileIcon from './icons/delete-file-icon.svg';
import FileIcon from './icons/file.svg';
export const FilesTab = ({ items }: FilesTabProps): JSX.Element => {
  return (
    <div className={styles.container}>
      <ul className={styles.fileList}>
        {items.map((item, index) => (
          <li key={index} className={styles.listItem}>
            <CardFile item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
};
const CardFile = ({ item }: CardFileProps): JSX.Element => {
  //хук для загрузки файла находящегося в сообщении
  const { handleDownloadMessageFileClick, handleStopDownloadMessageFileClick, isDownloading } = useDownloadMessageFile([
    {
      id: item.id,
      uid: item.uid,
      download_name: item.download_name,
      media_kind: item.media_kind,
      file_protected_url: item.file_protected_url || item.file_webp_url || '',
      file_webp_url: item.file_protected_url || item.file_webp_url || '',
      file_small_url: item.file_small_url || '',
      file_type: item.file_type || '',
      created_at: item.created_at,
      updated_at: item.updated_at,
    },
  ]);
  return (
    <div className={styles.fileItem} onClick={handleDownloadMessageFileClick}>
      {isDownloading ? (
        <div className={styles.deleteFileIcon}>
          <DeleteFileIcon onClick={handleStopDownloadMessageFileClick} />
        </div>
      ) : (
        <FileIcon />
      )}
      <div className={styles.fileInfo}>
        <div className={styles.fileName}>
          <HighlightedFileName fileName={item.download_name} search={''} />
        </div>
        <div className={styles.fileDescription}>
          <div className={styles.fileSize}>{formatBytes(item.size)}</div>
          <div className={styles.dot}>•</div>
          <div className={styles.fileDate}>{getMessageTimeOrDate(item.created_at)}</div>
        </div>
      </div>
    </div>
  );
};
