'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { JSX } from 'react';
import { NAV_ITEMS } from './navigation.config';
import styles from './navigation.module.scss';

export const Navigation = (): JSX.Element => {
  const pathname = usePathname();

  return (
    <nav className={styles.navigation} aria-label="Основная навигация">
      {NAV_ITEMS.map(({ id, icon: Icon, label, href }) => {
        const isActive = pathname.startsWith(href);

        return (
          <Link
            key={id}
            href={href}
            className={clsx(styles.button, isActive && styles.active)}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            title={label}
          >
            <Icon className={styles.icon} />
          </Link>
        );
      })}
    </nav>
  );
};
