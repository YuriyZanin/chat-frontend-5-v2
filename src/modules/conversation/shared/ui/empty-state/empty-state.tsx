import clsx from 'clsx';
import Link from 'next/link';
import { JSX } from 'react';
import { ButtonUI } from 'shared/ui/button';
import { ImageUI } from 'shared/ui/image';
import styles from './empty-state.module.scss';
import { ConversationEmptyStateProps, EMPTY_STATE } from './empty-state.props';

export const ConversationEmptyState = ({ variant }: ConversationEmptyStateProps): JSX.Element => {
  const { src, title, subtitle } = EMPTY_STATE[variant];

  const renderText = (): JSX.Element => {
    switch (variant) {
      case 'chats': {
        return (
          <>
            <span className={clsx(styles.text, styles.chatsTitle)}>{title}</span>
            <span className={clsx(styles.text, styles.chatsText)}>{subtitle}</span>
          </>
        );
      }
      case 'noResult': {
        return (
          <>
            <span className={clsx(styles.text, styles.noResultsTitle)}>{title}</span>
            <span className={clsx(styles.text, styles.noResultsText)}>{subtitle}</span>
          </>
        );
      }
      default: {
        return <span className={clsx(styles.text, styles.contactsTitle)}>{title}</span>;
      }
    }
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <ImageUI src={src} alt={title} width={200} height={200} classNames={{ root: styles.imageWrapper }} />

        <div className={styles.textWrapper}>{renderText()}</div>

        {variant === 'chats' && (
          <Link href={'/contacts'} className={styles.link}>
            <ButtonUI label={'Начать чат'} variant={'general'} appearance={'primary'} type={'button'} />
          </Link>
        )}
      </div>
    </div>
  );
};
