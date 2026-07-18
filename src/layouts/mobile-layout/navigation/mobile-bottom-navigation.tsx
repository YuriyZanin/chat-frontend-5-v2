// mobile-bottom-navigation.tsx

'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChatsIcon, ContactsIcon, ServicesIcon, SettingsIcon } from './icons';

import { JSX } from 'react';
import styles from './mobile-bottom-navigation.module.scss';

const items = [
  {
    href: '/chats',
    label: 'Чаты',
    icon: ChatsIcon,
  },
  {
    href: '/contacts',
    label: 'Контакты',
    icon: ContactsIcon,
  },
  {
    href: '/services',
    label: 'Сервисы',
    icon: ServicesIcon,
  },
  {
    href: '/settings',
    label: 'Настройки',
    icon: SettingsIcon,
  },
];

export const MobileBottomNavigation = (): JSX.Element => {
  const pathname = usePathname();

  return (
    <nav className={styles.root}>
      {items.map((item) => {
        const isActive = pathname.startsWith(item.href);

        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(styles.link, {
              [styles.active]: isActive,
            })}
          >
            <Icon className={styles.icon} />

            {/* <span>{item.label}</span> */}
          </Link>
        );
      })}
    </nav>
  );
};
