import { useContactsSelectionStore } from 'modules/conversation/contacts/features/contacts-selection';
import { SectionHeader } from 'modules/conversation/contacts/ui/section-header';
import { JSX } from 'react';
import { BackIcon, ClearIcon, DeleteIcon } from './icons';
import styles from './section-header-selection.module.scss';
import { HeaderVariant, SECTION_HEADER_CONFIG } from './section-header.config';

export const SectionHeaderSelection = ({ variant }: { variant: HeaderVariant }): JSX.Element => {
  const isSelectionMode = useContactsSelectionStore((s) => s.isSelectionMode);
  const enterSelectionMode = useContactsSelectionStore((s) => s.enterSelectionMode);
  const exitSelectionMode = useContactsSelectionStore((s) => s.exitSelectionMode);
  const clearSelection = useContactsSelectionStore((s) => s.clearSelection);

  const config = SECTION_HEADER_CONFIG[variant];

  const leftAction = isSelectionMode && (
    <button onClick={exitSelectionMode}>
      <BackIcon />
    </button>
  );
  const rightAction = !isSelectionMode ? (
    <button onClick={enterSelectionMode} className={styles.button}>
      <DeleteIcon className={styles.icon} />
    </button>
  ) : (
    <button onClick={clearSelection} className={styles.button}>
      <ClearIcon className={styles.icon} />
    </button>
  );

  return (
    <SectionHeader
      label={isSelectionMode ? 'Удалить контакты' : config.label}
      isHighlighted={isSelectionMode}
      leftAction={leftAction}
      {...(config.showDelete && { rightAction })}
    />
  );
};
