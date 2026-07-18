import { useInfoEditGroupStore } from 'modules/info/model/info.edit-group.store';
import { ChatType } from 'modules/new-group/model/new-group-store';
import GroupTypeSelect from 'modules/new-group/ui/group-type-select/group-type-select';
import { JSX } from 'react';
import styles from './info-group-type-select.module.scss';

type InfoGroupTypeSelectProps = {
  chatType: ChatType;
};

export const InfoGroupTypeSelect = ({ chatType }: InfoGroupTypeSelectProps): JSX.Element => {
  const { setGroupData } = useInfoEditGroupStore();

  // Определяем режим по значению chatType
  const mode = chatType.includes('channel') ? 'channel' : 'group';

  const handleChange = (type: ChatType): void => {
    setGroupData({ chatType: type });
  };

  return (
    <div className={styles.wrapper}>
      <GroupTypeSelect mode={mode} initial={chatType} onChange={handleChange} />
    </div>
  );
};
