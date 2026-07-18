'use client';

import clsx from 'clsx';
import { useContactsSelectionStore } from 'modules/conversation/contacts/features/contacts-selection/model';
import { JSX } from 'react';
import { pluralize } from 'shared/libs';
import styles from './delete-selected-button.module.scss';

export const DeleteSelectedContactsButton = (): JSX.Element => {
  const { selectedIds } = useContactsSelectionStore();
  const openDeleteModal = useContactsSelectionStore((s) => s.openDeleteModal);

  const size = selectedIds.size;

  const label = pluralize(size, 'contacts');

  return (
    <button
      className={clsx(styles.button, {
        [styles.active]: size > 0,
      })}
      onClick={openDeleteModal}
    >{`Удалить ${size} ${label}`}</button>
  );
};
