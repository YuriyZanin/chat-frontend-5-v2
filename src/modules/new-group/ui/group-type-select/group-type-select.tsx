import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { ChatType, useGroupTypeSelect } from '../../lib/group-type-select/use-groupe-type-select';
import styles from './group-type-select.module.scss';

type GroupTypeSelectProps = {
  mode: 'group' | 'channel';
  initial: ChatType;
  onChange: (type: ChatType) => void;
};

// Конфигурация для разных режимов
const config = {
  group: {
    label: 'Тип группы',
    options: [
      {
        value: 'public-group',
        title: 'Открытая',
        description: 'Открытую группу можно найти через поиск. Присоединиться к ней может любой пользователь',
      },
      {
        value: 'private-group',
        title: 'Закрытая',
        description: 'В закрытую группу можно попасть только по приглашению или пригласительной ссылке',
      },
    ],
  },
  channel: {
    label: 'Тип канала',
    options: [
      {
        value: 'public-channel',
        title: 'Публичный',
        description: 'Публичный канал можно найти через поиск. Подписаться на него может любой пользователь',
      },
      {
        value: 'private-channel',
        title: 'Частный',
        description: 'В частный канал можно попасть только по приглашению или пригласительной ссылке',
      },
    ],
  },
};

const GroupTypeSelect: React.FC<GroupTypeSelectProps> = ({ mode = 'group', initial, onChange }) => {
  const { selected, selectClosed, selectOpen, setSelected } = useGroupTypeSelect({ mode, initial });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  onChange(selected);

  const toggleOpen = (): void => setIsOpen((prev) => !prev);
  const handleChange = (type: ChatType): void => {
    if (type === 'private-group' || type === 'private-channel') {
      selectClosed();
    } else {
      selectOpen();
    }
    setSelected(type);
    setIsOpen(false);
  };

  const currentConfig = config[mode];
  const selectedOption = currentConfig.options.find((opt) => opt.value === selected);
  const selectedLabel = selectedOption?.title || (mode === 'group' ? 'Открытая' : 'Публичный');

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <label className={styles.label}>{currentConfig.label}</label>
      <div className={styles.field} onClick={toggleOpen}>
        <span className={styles.value}>{selectedLabel}</span>
        <span className={styles.arrow}>
          <Image
            src={isOpen ? '/images/new-group/upArrowIcon.svg' : '/images/new-group/downArrowIcon.svg'}
            alt=""
            width={12}
            height={8}
          />
        </span>
      </div>
      {isOpen && (
        <div className={styles.dropdown}>
          {currentConfig.options.map((option) => (
            <label
              key={option.value}
              className={`${styles.option} ${selected === option.value ? styles.selected : ''}`}
            >
              <input
                type="radio"
                name={mode === 'group' ? 'groupType' : 'channelType'}
                value={option.value}
                checked={selected === option.value}
                onChange={() => handleChange(option.value as ChatType)}
                className={styles.radio}
              />
              <span className={styles.radioCustom}></span>
              <div className={styles.optionContent}>
                <span className={styles.optionTitle}>{option.title}</span>
                <span className={styles.optionDescription}>{option.description}</span>
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupTypeSelect;
