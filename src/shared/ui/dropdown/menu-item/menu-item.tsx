import clsx from 'clsx';
import { FC } from 'react';
import styles from './menu-item.module.scss';
import { MenuItemProps } from './menu-item.props';

export const MenuItem: FC<MenuItemProps> = ({ icon, text, variant = 'general', onClick }: MenuItemProps) => {
  return (
    <>
      <div className={styles.menuItem} onClick={onClick}>
        <span className={clsx(styles.menuItemText, styles[variant])}>{text}</span>
        {!!icon && <span className={styles.menuItemIcon}>{icon}</span>}
      </div>
    </>
  );
};
