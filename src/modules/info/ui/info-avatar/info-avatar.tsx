'use client';
import { JSX } from 'react';
import { useMediaQuery } from 'shared/hooks';
import { ImageUI } from 'shared/ui/index';
import CallIcon from './images/callIcon.svg';
import MessageIcon from './images/messageIcon.svg';
import SearchIcon from './images/searchWebMobileIcon.svg';
import VideoCallIcon from './images/videoCallWebMobileIcon.svg';
import styles from './info-avatar.module.scss';
import { InfoAvatarProps } from './info-avatar.props';
export const InfoAvatar = ({ avatarHref, label, status }: InfoAvatarProps): JSX.Element => {
  const isMobile = useMediaQuery('(max-width: 410px)');

  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <ImageUI src={avatarHref} alt={label} unoptimized width={360} height={360} />
      </div>
      <div className={styles.imageLabel}>
        <div className={styles.name}>{label}</div>
        <div className={styles.status}>{status}</div>
      </div>
      {isMobile && (
        <div className={styles.buttonsContainer}>
          <button type="button" className={styles.callButton} onClick={() => {}}>
            <CallIcon />
            чат
          </button>
          <button type="button" className={styles.messageButton} onClick={() => {}}>
            <MessageIcon />
            чат
          </button>
          <button type="button" className={styles.searchButton} onClick={() => {}}>
            <SearchIcon />
            чат
          </button>
          <button type="button" className={styles.videoCallButton} onClick={() => {}}>
            <VideoCallIcon />
            чат
          </button>
        </div>
      )}
    </div>
  );
};
