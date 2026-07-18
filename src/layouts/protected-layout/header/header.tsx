import Image from 'next/image';
import Link from 'next/link';
import { JSX } from 'react';
import styles from './header.module.scss';

export const Header = (): JSX.Element => {
  return (
    <header className={styles.header}>
      <Link href="/chats">
        <Image src="/images/header/logo.svg" alt="А-чат — перейти к чатам" width={49} height={44} priority />
      </Link>

      <div className={styles.storeButtons}>
        <a
          href="https://play.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Скачать А-чат в Google Play"
        >
          <Image src="/images/header/googleplay.svg" alt="" width={150} height={44} loading={'eager'} />
        </a>

        <a
          href="https://apps.apple.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Скачать А-чат в App Store"
        >
          <Image src="/images/header/appstore.svg" alt="" width={150} height={44} loading={'eager'} />
        </a>
      </div>
    </header>
  );
};
