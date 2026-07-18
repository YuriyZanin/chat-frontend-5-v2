'use client';

import Image from 'next/image';
import { forwardRef } from 'react';
import styles from './settings-item.module.scss';

type SettingsItemProps = {
  iconSrc: string;
  label: string;
  onClick?: () => void;
  needArrow?: boolean;
};

export const SettingsItem = forwardRef<HTMLButtonElement, SettingsItemProps>(
  ({ iconSrc, label, onClick, needArrow = true }, ref) => {
    return (
      <button ref={ref} type="button" onClick={onClick} className={styles.settingsItemButton} aria-label={label}>
        <div className={styles.iconAndLabelContainer}>
          <Image src={iconSrc} alt="" width={21} height={21} className={styles.iconWrapper} />
          <span className={styles.labelText}>{label}</span>
        </div>
        {needArrow && (
          <Image src="/images/settings/arrowIcon.svg" alt="" width={21} height={21} className={styles.arrowIcon} />
        )}
      </button>
    );
  },
);

SettingsItem.displayName = 'SettingsItem';
