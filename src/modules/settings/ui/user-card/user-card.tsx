import Image from 'next/image';
import { useState } from 'react';
import styles from './user-card.module.scss';

type UserCardProps = {
  avatar: string;
  name: string;
  phone: string;
  nickName: string;
};

export const UserCard: React.FC<UserCardProps> = ({ avatar, name, phone, nickName }: UserCardProps) => {
  const [imageError, setImageError] = useState(false);

  const handleError = (): void => {
    setImageError(true);
  };

  const isValidUrl =
    typeof avatar === 'string' &&
    avatar.trim() !== '' &&
    (avatar.startsWith('/') || avatar.startsWith('http://') || avatar.startsWith('https://'));

  const src = imageError || !isValidUrl ? '/images/settings/noAvatarIcon.svg' : avatar;

  const truncateText = (text: string, maxLength: number): string => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };
  return (
    <div className={styles.container}>
      <Image
        src={src}
        alt="avatar"
        width={82}
        height={82}
        className={styles.avatar}
        onError={handleError}
        unoptimized={true}
      />
      <div className={styles.content}>
        <p className={styles.name}>{truncateText(name, 20)}</p>
        <p className={styles.secondaryText}>{phone}</p>
        <p className={styles.secondaryText}>{truncateText(nickName, 20)}</p>
      </div>
    </div>
  );
};
