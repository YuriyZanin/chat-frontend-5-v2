'use client';

import { useDateSelectorLogic } from 'modules/settings/lib/data-selector/use-date-selector-logic';
import Image from 'next/image';
import { JSX } from 'react';
import styles from './date-selector.module.scss';

type DateSelectorProps = {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label: string;
};

export const DateSelector: React.FC<DateSelectorProps> = ({
  value,
  onChange,
  label,
}: DateSelectorProps): JSX.Element => {
  const downArrowIconPath = '/images/settings/downArrowIcon.svg';
  const upArrowIconPath = '/images/settings/upArrowIcon.svg';

  const {
    daySelectRef,
    monthSelectRef,
    yearSelectRef,
    openDropdown,
    dayLabel,
    monthLabel,
    yearLabel,
    days,
    months,
    years,
    handleDayChange,
    handleMonthChange,
    handleYearChange,
    handleButtonClick,
  } = useDateSelectorLogic({
    value,
    onChange,
  });

  const getArrowIcon = (dropdownType: 'day' | 'month' | 'year'): JSX.Element => {
    const isOpen = openDropdown === dropdownType;
    return (
      <Image
        src={isOpen ? upArrowIconPath : downArrowIconPath}
        alt={isOpen ? 'Закрыть список' : 'Открыть список'}
        width={16}
        height={16}
        className={styles.arrowImage}
      />
    );
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <div className={styles.selectsContainer}>
        <div className={`${styles.select} ${styles.width25}`} ref={daySelectRef}>
          <button type="button" className={styles.selectButton} onClick={() => handleButtonClick('day')}>
            {dayLabel}
            {getArrowIcon('day')}
          </button>
          {openDropdown === 'day' && (
            <ul className={styles.dropdown}>
              {days.map((d) => (
                <li key={d} onClick={() => handleDayChange(d)} className={styles.option}>
                  {d}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={`${styles.select} ${styles.width42}`} ref={monthSelectRef}>
          <button type="button" className={styles.selectButton} onClick={() => handleButtonClick('month')}>
            {monthLabel}
            {getArrowIcon('month')}
          </button>
          {openDropdown === 'month' && (
            <ul className={styles.dropdown}>
              {months.map((m) => (
                <li key={m.value} onClick={() => handleMonthChange(m.value)} className={styles.option}>
                  {m.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={`${styles.select} ${styles.width33}`} ref={yearSelectRef}>
          <button type="button" className={styles.selectButton} onClick={() => handleButtonClick('year')}>
            {yearLabel}
            {getArrowIcon('year')}
          </button>
          {openDropdown === 'year' && (
            <ul className={styles.dropdown}>
              {years.map((y) => (
                <li key={y} onClick={() => handleYearChange(y)} className={styles.option}>
                  {y}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
