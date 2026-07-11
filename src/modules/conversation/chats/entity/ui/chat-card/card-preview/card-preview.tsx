import { JSX } from 'react';
import { kindFromMime } from 'shared/libs';
import { ImageUI } from 'shared/ui';
import { ForwardReplyIcon } from '../icons';
import styles from './card-preview.module.scss';
import { CardPreviewProps } from './card-preview.props';

export const CardPreview = ({
  content,
  filesSummary,
  replied,
  forwarded,
  isCurrentUser,
}: CardPreviewProps): JSX.Element => {
  const { count = 0, types = [] } = filesSummary || {};

  const getPreviewText = (): string => {
    if (content) return content.split(' ')[0] === '@@@' ? content.split(' ').slice(1).join(' ') : content;
    if (!count) return '';

    if (types.length > 1) return `${count} медиа`;

    return `${count} ${kindFromMime(types[0])}`;
  };

  const hasText = content !== '';
  const hasContext = replied || forwarded;

  const previewLimit = !hasText || !hasContext ? 3 : 2;
  const previewCount = Math.min(count, previewLimit);

  return (
    <div className={styles.preview}>
      {(replied || forwarded) && <ForwardReplyIcon className={styles.forwardReplyIcon} />}

      {count > 0 && (
        <div className={styles.previewMedia}>
          {Array.from({ length: previewCount }).map((_, i) => (
            <ImageUI
              key={i}
              src="/images/chats/preview.png"
              alt="Превью"
              width={16}
              height={16}
              classNames={{ root: styles.previewImage }}
            />
          ))}
        </div>
      )}

      <span className={styles.previewText}>
        {isCurrentUser && <div>Вы</div>}
        {getPreviewText()}
      </span>
    </div>
  );
};
