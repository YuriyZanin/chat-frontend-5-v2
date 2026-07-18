import { useNewGroupStore } from 'modules/new-group/model/new-group-store';
import { useEffect, useState } from 'react';
// Общий тип для групп и каналов
export type GroupType = 'private-group' | 'public-group';
export type ChannelType = 'private-channel' | 'public-channel';
export type ChatType = GroupType | ChannelType;

type UseGroupTypeSelectProps = {
  mode?: 'group' | 'channel';
  initial?: ChatType;
};

type UseGroupTypeSelectReturn = {
  selected: ChatType;
  selectClosed: () => void;
  selectOpen: () => void;
  setSelected: (value: ChatType) => void;
};

export const useGroupTypeSelect = ({
  mode = 'group',
  initial,
}: UseGroupTypeSelectProps = {}): UseGroupTypeSelectReturn => {
  const addSelectedStore = useNewGroupStore((s) => s.addSelected);
  // Значения по умолчанию в зависимости от режима
  const getDefaultInitial = (): ChatType => {
    if (initial) return initial;
    return mode === 'group' ? 'public-group' : 'public-channel';
  };

  const [selected, setSelected] = useState<ChatType>(getDefaultInitial);
  useEffect(() => {
    addSelectedStore(setSelected);
  }, [setSelected]);

  const selectClosed = (): void => {
    setSelected(mode === 'group' ? 'private-group' : 'private-channel');
  };

  const selectOpen = (): void => {
    setSelected(mode === 'group' ? 'public-group' : 'public-channel');
  };

  return {
    selected,
    selectClosed,
    selectOpen,
    setSelected,
  };
};
