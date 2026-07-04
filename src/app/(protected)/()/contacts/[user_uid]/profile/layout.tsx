import { JSX, ReactNode } from 'react';

import styles from './layout.module.scss';

export default function ProfileLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <main className={styles.wrapper}>
      <div className={styles.content}>{children}</div>
    </main>
  );
}
