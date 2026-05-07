import { getMessageTimeOrDate } from 'modules/conversation/messages-chat/lib/get-message-time';
import Image from 'next/image';
import { JSX, useState } from 'react';
import styles from './alert-open-images.module.scss';
import { AlertOpenImagesProps } from './alert-open-images.props';
import Close from './icon/close.svg';
import Copy from './icon/copy.svg';
import Delete from './icon/delete.svg';
import LeftArrow from './icon/left-arrow.svg';
import Reply from './icon/reply.svg';
import RightArrow from './icon/right-arrow.svg';

export const AlertOpenImages = ({ onOk, onCancel, message }: AlertOpenImagesProps): JSX.Element => {
  const fileList = message.files_list.length ? message.files_list : message.forwarded_messages[0].files_list;
  const [indexImage, setIndexImage] = useState<number>(0);
  return (
    <div className={styles.wrapper}>
      <div className={styles.headerTop}>
        <div className={styles.headerTopContact}>
          <div className={styles.headerTopContactAvatar}>
            {message.files_list.length ? (
              <Image
                src={message.from_user.avatar_webp_url ?? '/images/messages-chats/default-avatar.svg'}
                alt={message.from_user.username}
                width={60}
                height={60}
              />
            ) : (
              <Image
                src={message.forwarded_messages[0].avatar_webp_url ?? '/images/messages-chats/default-avatar.svg'}
                alt={message.forwarded_messages[0].from_user ?? 'Дефолтный Аватар'}
                width={60}
                height={60}
              />
            )}
          </div>
          <div className={styles.headerTopContactText}>
            <div className={styles.headerTopContactTextName}>
              {message.files_list.length
                ? `${message.from_user.first_name} ${message.from_user.last_name}`
                : `${message.forwarded_messages[0].first_name} ${message.forwarded_messages[0].last_name}`}
            </div>
            <div className={styles.headerTopContactTextTime}>{getMessageTimeOrDate(message.created_at)}</div>
          </div>
        </div>
        <div className={styles.headerTopContactMenu}>
          <div className={styles.icon}>
            <button className={styles.icon}>
              <Copy />
            </button>
          </div>
          <div className={styles.icon}>
            <button className={styles.icon}>
              <Reply />
            </button>
          </div>
          <div className={styles.icon}>
            <button className={styles.icon}>
              <Delete />
            </button>
          </div>
          <div className={styles.icon}>
            <button className={styles.icon} onClick={onCancel}>
              <Close />
            </button>
          </div>
        </div>
      </div>
      <div className={styles.arrowsContainer}>
        <div className={styles.arrowsContainerIcon}>
          <button
            className={indexImage > 0 ? styles.arrowsContainerIcon : styles.arrowsContainerIconDisabled}
            onClick={() => setIndexImage(indexImage - 1)}
            disabled={!(indexImage > 0)}
          >
            <LeftArrow />
          </button>
        </div>
        <div className={styles.arrowsContainerIcon}>
          <button
            className={
              indexImage < fileList.length - 1 ? styles.arrowsContainerIcon : styles.arrowsContainerIconDisabled
            }
            onClick={() => setIndexImage(indexImage + 1)}
            disabled={!(indexImage < fileList.length - 1)}
          >
            <RightArrow />
          </button>
        </div>
      </div>
      <div className={styles.image}>
        <Image src={fileList[indexImage].file_url} alt={fileList[indexImage].download_name} width={626} height={417} />
      </div>
      <div className={styles.headerBottom}>
        <div className={styles.headerBottomText}>
          {message.files_list.length ? message.content : message.forwarded_messages[0].content}
        </div>
      </div>
    </div>
  );
};
