'use client';
import Image from 'next/image';
import { JSX, useState } from 'react';
import { useGetProfile } from 'shared/query/profile.query';
import { SettingsList } from '../settings-list/settings-list';
import { UserCard } from '../user-card/user-card';

import { useRouter } from 'next/navigation';
import { deleteProfile } from 'shared/api/profile.api';
import { Modal } from 'shared/ui';
import styles from './all-settings-block.module.scss';

type AllSettingsBlockProps = {
  editProfile: () => void;
  blackList: () => void;
  support: () => void;
  leave: () => void;
};

export const AllSettingsBlock: React.FC<AllSettingsBlockProps> = ({
  editProfile,
  blackList,
  support,
  leave,
}: AllSettingsBlockProps): JSX.Element => {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState<boolean>(false);
  const [isDeleteProfileModalOpen, setIsDeleteProfileModalOpen] = useState<boolean>(false);

  const { data: profile } = useGetProfile();

  const router = useRouter();
  if (!profile) {
    return <div>Загрузка профиля</div>;
  }

  console.log(profile);

  const handleChangeIsLeaveModalOpen = (): void => {
    if (isLeaveModalOpen) setIsLeaveModalOpen(false);
    else setIsLeaveModalOpen(true);
  };

  const handleChangeIsDeleteProfileModalOpen = (): void => {
    if (isDeleteProfileModalOpen) setIsDeleteProfileModalOpen(false);
    else setIsDeleteProfileModalOpen(true);
  };
  const handleDeleteAccount = async (): Promise<void> => {
    try {
      const response = await deleteProfile();
      console.log('Удаление успешно:', response.messages);
      await fetch('/api/auth/remove-tokens', {
        method: 'POST',
      });
      router.push('/auth');
    } catch (error) {
      console.error('Ошибка при удалении аккаунта:', error);
    }
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Настройки</h1>
          <UserCard
            avatar={profile.avatar_url || profile.avatar}
            name={profile.first_name}
            phone={profile.phone}
            nickName={`@${profile.nickname}`}
          />
          <SettingsList
            editProfile={editProfile}
            blackList={blackList}
            support={support}
            leave={handleChangeIsLeaveModalOpen}
          />
        </div>
        <button type="button" className={styles.removeProfileButton} onClick={handleDeleteAccount}>
          <div className={styles.iconAndLabelContainer}>
            <Image src="/images/settings/trashIcon.svg" alt="" width={21} height={21} className={styles.trashIcon} />
            <span className={styles.labelText}>Удалить профиль</span>
          </div>
        </button>
      </div>
      {isLeaveModalOpen && (
        <Modal
          title={'Выход из аккаунта'}
          content="Вы действительно хотите выйти из аккаунта?"
          firstButtonText="Выйти"
          secondButtonText="Отмена"
          onFirstButtonClick={leave}
          onSecondButtonClick={handleChangeIsLeaveModalOpen}
          onClose={handleChangeIsLeaveModalOpen}
        />
      )}

      {isDeleteProfileModalOpen && (
        <Modal
          title={'Удаление профиля'}
          content="Это действие необратимо. Все данные будут удалены без возможности восстановления."
          firstButtonText="Отмена"
          secondButtonText="Удалить"
          onFirstButtonClick={handleChangeIsDeleteProfileModalOpen}
          onSecondButtonClick={handleDeleteAccount}
          onClose={handleChangeIsDeleteProfileModalOpen}
        />
      )}
    </>
  );
};
