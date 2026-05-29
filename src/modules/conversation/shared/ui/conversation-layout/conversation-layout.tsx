import { JSX, ReactNode, RefObject } from 'react';
import styles from './conversation-layout.module.scss';

export const ConversationLayout = ({
  header,
  children,
  footer,
  wrapperRef,
}: {
  header: ReactNode;
  children: ReactNode;
  footer: ReactNode;
  wrapperRef?: RefObject<HTMLDivElement | null>;
}): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>{header}</div>
      <div className={styles.body} ref={wrapperRef}>
        {children}
      </div>
      {footer}
    </div>
  );
};
