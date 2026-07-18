import { JSX } from 'react';
import { ButtonUI } from 'shared/ui';
import styles from './add-members-button.module.scss';

export const AddMembersButton = ({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
}): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <ButtonUI
        label={label}
        variant={'general'}
        appearance={disabled ? 'disabled' : 'primary'}
        disabled={disabled}
        onClick={onClick}
      />
    </div>
  );
};
