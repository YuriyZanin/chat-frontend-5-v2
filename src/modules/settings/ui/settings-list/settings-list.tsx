import { JSX } from 'react';
import { SettingsItem } from './settings-item';
import styles from './settings-list.module.scss';
type SettingsListProps = {
  editProfile: () => void;
  blackList: () => void;
  support: () => void;
  leave: () => void;
};

export const SettingsList: React.FC<SettingsListProps> = ({
  editProfile,
  blackList,
  support,
  leave,
}: SettingsListProps): JSX.Element => {
  return (
    <div className={styles.container}>
      <SettingsItem iconSrc="/images/settings/settingIcon1.svg" label="Редактирование профиля" onClick={editProfile} />
      <SettingsItem iconSrc="/images/settings/settingIcon2.svg" label="Чёрный список" onClick={blackList} />
      <SettingsItem iconSrc="/images/settings/settingIcon3.svg" label="Поддержка" onClick={support} />
      <SettingsItem
        iconSrc="/images/settings/settingIcon4.svg"
        label="Выйти из аккаунта"
        onClick={leave}
        needArrow={false}
      />
    </div>
  );
};
