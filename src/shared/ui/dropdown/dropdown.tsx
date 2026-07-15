import clsx from 'clsx';
import { FC } from 'react';
import styles from './dropdown.module.scss';
import { DropdownItem, DropdownProps } from './dropdown.props';
import { useDropdown } from './hooks/useDropdown';
import { MenuItem } from './menu-item';

export const Dropdown: FC<DropdownProps> = ({ trigger, children, items }) => {
  const { isOpen, toggleMenu, closeMenu, dropdownRef, menuRef } = useDropdown();

  const handleClickMenuItem = (item: DropdownItem): void => {
    if (isOpen) {
      closeMenu();
    }
    if (item.onClick) item.onClick();
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef} onMouseLeave={closeMenu}>
      {trigger && (
        <div className={styles.trigger} onClick={toggleMenu}>
          {trigger}
        </div>
      )}

      {children && (
        <div className={styles.content} onContextMenu={toggleMenu}>
          {children}
        </div>
      )}

      <div className={clsx(styles.menu, isOpen ? styles.open : styles.hidden)} ref={menuRef}>
        {items.map((item, index) => (
          <MenuItem
            key={index}
            text={item.label}
            icon={item.icon}
            variant={item.variant}
            onClick={() => handleClickMenuItem(item)}
          />
        ))}
      </div>
    </div>
  );
};
