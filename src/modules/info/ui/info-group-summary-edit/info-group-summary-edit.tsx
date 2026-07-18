import { useInfoEditGroupStore } from 'modules/info/model/info.edit-group.store';
import DualInput from 'modules/new-group/ui/dual-input/dual-input';
import { JSX } from 'react';
import styles from './info-group-summary-edit.module.scss';

export const InfoGroupSummaryEdit = (): JSX.Element => {
  const { setGroupData, name, description } = useInfoEditGroupStore();

  const handleNameChange = (val: string): void => {
    setGroupData({ name: val });
  };

  const handleDescChange = (val: string): void => {
    setGroupData({ description: val });
  };

  return (
    <div className={styles.wrapper}>
      <DualInput
        maxFirst={100}
        maxSecond={250}
        placeholderFirst="Название*"
        placeholderSecond="Описание"
        valueFirst={name}
        valueSecond={description}
        onChangeFirst={handleNameChange}
        onChangeSecond={handleDescChange}
      />
    </div>
  );
};
