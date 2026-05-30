'use client';

import { JSX } from 'react';
import { Dropdown } from 'shared/ui/dropdown';

import CloseIcon from '../../shared/icons/close.svg';
import DropdownIcon from '../../shared/icons/dropdown.svg';
import SettingIcon from '../../shared/icons/settings.svg';

import { useMediaQuery } from 'shared/hooks';
import styles from './info-header.module.scss';
import { InfoHeaderProps } from './info-header.props';

export const InfoHeader = ({
  menuItems,
  title,
  onClose,
  onSetting,
  backProps: backProps,
}: InfoHeaderProps): JSX.Element => {
  const isMobile = useMediaQuery('(max-width: 410px)');

  return (
    <div className={styles.header}>
      <div className={styles.info}>
        {onClose && !isMobile && (
          <button onClick={onClose}>
            <CloseIcon />
          </button>
        )}

        {isMobile && (
          <button onClick={onClose}>
            <CloseIcon />
          </button>
        )}
        {backProps && <button onClick={backProps.onClick}>{backProps.icon}</button>}
        {!isMobile && <span className={styles.label}>{title ?? 'Информация'}</span>}
      </div>
      <div className={styles.menu}>
        {onSetting && (
          <button onClick={onSetting}>
            <SettingIcon />
          </button>
        )}
        {menuItems && <Dropdown trigger={<DropdownIcon />} items={menuItems} />}
      </div>
    </div>
  );
};
