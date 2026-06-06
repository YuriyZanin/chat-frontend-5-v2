import { JSX } from 'react';
import { ImageUI } from 'shared/ui/index';
import styles from './info-avatar.module.scss';
import { InfoAvatarProps } from './info-avatar.props';

export const InfoAvatar = ({ avatarHref, label, status }: InfoAvatarProps): JSX.Element => {
  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <ImageUI src={avatarHref} alt={label} unoptimized width={360} height={360} />
      </div>
      <div className={styles.imageLabel}>
        <div className={styles.name}>{label}</div>
        <div className={styles.status}>{status}</div>
      </div>
    </div>
  );
};
