import React, { JSX } from 'react';
import { ButtonUI } from '../../../../shared/ui/button';
import styles from './support-modal.module.scss';

type SupportModalProps = {
  title: string;
  content?: string;
  firstButtonText?: string;
  secondButtonText?: string;
  onFirstButtonClick?: () => void;
  onSecondButtonClick?: () => void;
  onClose: () => void;
};

export const SupportModal: React.FC<SupportModalProps> = ({
  title,
  content,
  firstButtonText,
  secondButtonText,
  onFirstButtonClick,
  onSecondButtonClick,
  onClose,
}): JSX.Element => {
  const handleBackdropClick = (e: React.MouseEvent): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby={title ? 'modal-title' : undefined}>
        {title && (
          <div id="modal-title" className={styles.title}>
            {title}
          </div>
        )}

        <p className={styles.content}>{content}</p>

        <div className={styles.buttonContainer}>
          {firstButtonText && (
            <ButtonUI
              variant="general"
              appearance="primary"
              label={firstButtonText}
              onClick={() => {
                if (onFirstButtonClick) onFirstButtonClick();
              }}
            />
          )}
          {secondButtonText && (
            <ButtonUI
              variant="general"
              appearance="secondary"
              label={secondButtonText}
              onClick={() => {
                if (onSecondButtonClick) onSecondButtonClick();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
