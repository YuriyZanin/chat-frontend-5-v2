import { useNotificationStore } from 'modules/notification/model/notification.store';
import { JSX } from 'react';
import CopiedIcon from '../../../notification/ui/notification-modal/icons/copied.svg';
import CopyIcon from '../../shared/icons/copy.svg';
import styles from './info-group-invite-link.module.scss';
import { InfoGroupInviteLinkProps } from './info-group-invite-link.props';

export const InfoGroupInviteLink = ({ inviteLink, chatKey }: InfoGroupInviteLinkProps): JSX.Element => {
  const { openPopup, setIcon, setTitle } = useNotificationStore();

  const chatKeys = chatKey?.split('-') ?? '';

  const handleCopyInvitedLink = (): void => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      setIcon(<CopiedIcon />);
      setTitle('Ссылка-приглашение скопирована');
      openPopup();
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>Пригласительная ссылка</div>
      <div className={styles.content}>
        <div className={styles.link}>
          <a href={inviteLink}>
            {window.location.origin}/{chatKeys[chatKeys.length - 1]}
          </a>
        </div>
        <button onClick={handleCopyInvitedLink}>
          <CopyIcon />
        </button>
      </div>
    </div>
  );
};
