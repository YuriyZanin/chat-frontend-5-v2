import clsx from 'clsx';
import { useNotificationStore } from 'modules/notification/model/notification.store';
import { JSX } from 'react';
import CopiedIcon from '../../../notification/ui/notification-modal/icons/copied.svg';
import CopyIcon from '../../shared/icons/copy.svg';
import styles from './info-summary.module.scss';
import { InfoSummaryProps } from './info-summary.props';

export const InfoSummary = ({
  nickname,
  phoneNumber,
  birthDay,
  about,
  description,
  inviteLink,
  inviteLinkChannel,
  chatKey,
}: InfoSummaryProps): JSX.Element => {
  const { openPopup, setIcon, setTitle } = useNotificationStore();

  const chatKeys = chatKey?.split('-') ?? '';

  const handleCopyNickname = (): void => {
    if (nickname) {
      navigator.clipboard.writeText(nickname);
      setIcon(<CopiedIcon />);
      setTitle('Никнейм скопирован');
      openPopup();
    }
  };

  const handleCopyPhone = (): void => {
    if (phoneNumber) {
      navigator.clipboard.writeText(phoneNumber);
      setIcon(<CopiedIcon />);
      setTitle('Телефон скопирован');
      openPopup();
    }
  };

  const handleCopyInvitedLink = (): void => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      setIcon(<CopiedIcon />);
      setTitle('Ссылка-приглашение скопирована');
      openPopup();
    }
  };

  return (
    <div className={styles.container}>
      {nickname && (
        <div className={styles.item}>
          <div className={styles.content}>
            <div className={styles.label}>Никнейм</div>
            <div className={styles.link}>{nickname}</div>
          </div>
          <button onClick={handleCopyNickname}>
            <CopyIcon />
          </button>
        </div>
      )}
      {phoneNumber && (
        <div className={clsx(styles.item, styles.itemBorder)}>
          <div className={styles.content}>
            <div className={styles.label}>Номер телефона</div>
            <div className={styles.link}>{phoneNumber}</div>
          </div>
          <button onClick={handleCopyPhone}>
            <CopyIcon />
          </button>
        </div>
      )}
      {birthDay && (
        <div className={clsx(styles.item, styles.itemBorder)}>
          <div className={styles.content}>
            <div className={styles.label}>День рождения</div>
            <div className={styles.text}>{birthDay}</div>
          </div>
        </div>
      )}
      {about && (
        <div className={clsx(styles.item, styles.itemBorder)}>
          <div className={styles.content}>
            <div className={styles.label}>О себе</div>
            <div className={styles.text}>{about}</div>
          </div>
        </div>
      )}
      {description && (
        <div className={clsx(styles.item)}>
          <div className={styles.content}>
            <div className={styles.label}>Описание</div>
            <div className={styles.text}>{description}</div>
          </div>
        </div>
      )}
      {inviteLink && (
        <div className={clsx(styles.item)}>
          <div className={styles.content}>
            <div className={styles.label}>Ссылка на приглашение в группу</div>
            <div className={styles.link}>
              <a href={inviteLink}>
                {window.location.origin}/{chatKeys[chatKeys.length - 1]}
              </a>
            </div>
          </div>
          <button onClick={handleCopyInvitedLink}>
            <CopyIcon />
          </button>
        </div>
      )}
      {inviteLinkChannel && (
        <div className={clsx(styles.item)}>
          <div className={styles.content}>
            <div className={styles.label}>Ссылка на приглашение в канал</div>
            <div className={styles.link}>
              <a href={inviteLink}>
                {window.location.origin}/{chatKeys[chatKeys.length - 1]}
              </a>
            </div>
          </div>
          <button onClick={handleCopyInvitedLink}>
            <CopyIcon />
          </button>
        </div>
      )}
    </div>
  );
};
