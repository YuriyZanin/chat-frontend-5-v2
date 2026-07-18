import { JSX, ReactNode } from 'react';
import styles from '../../auth/auth.module.scss';

export default function RegisterLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div className={styles.registerPage}>
      <div className={styles.formContainer}>{children}</div>
    </div>
  );
}
