import { useEffect, useRef, useState } from 'react';
import { useDateSelector } from './use-date-selector';

type UseDateSelectorLogicArgs = {
  value: Date | null;
  onChange: (date: Date | null) => void;
};

type UseDateSelectorLogicReturn = {
  daySelectRef: React.RefObject<HTMLDivElement | null>;
  monthSelectRef: React.RefObject<HTMLDivElement | null>;
  yearSelectRef: React.RefObject<HTMLDivElement | null>;

  openDropdown: 'day' | 'month' | 'year' | null;
  setOpenDropdown: React.Dispatch<React.SetStateAction<'day' | 'month' | 'year' | null>>;

  dayLabel: string;
  monthLabel: string;
  yearLabel: string;

  days: string[];
  months: { value: string; label: string }[];
  years: string[];

  handleDayChange: (selectedDay: string) => void;
  handleMonthChange: (selectedMonth: string) => void;
  handleYearChange: (selectedYear: string) => void;
  handleButtonClick: (dropdownType: 'day' | 'month' | 'year') => void;
};

export const useDateSelectorLogic = ({ value, onChange }: UseDateSelectorLogicArgs): UseDateSelectorLogicReturn => {
  const [year, setYear] = useState<string>(value ? String(value.getFullYear()) : '');
  const [month, setMonth] = useState<string>(value ? String(value.getMonth() + 1) : '');
  const [day, setDay] = useState<string>(value ? String(value.getDate()) : '');

  const { years, months, days, selectedDate } = useDateSelector(year, month);

  const [openDropdown, setOpenDropdown] = useState<'day' | 'month' | 'year' | null>(null);

  const daySelectRef = useRef<HTMLDivElement | null>(null);
  const monthSelectRef = useRef<HTMLDivElement | null>(null);
  const yearSelectRef = useRef<HTMLDivElement | null>(null);

  const prevOpenDropdownRef = useRef(openDropdown);
  useEffect(() => {
    prevOpenDropdownRef.current = openDropdown;
  }, [openDropdown]);

  const valueRef = useRef(value);

  useEffect(() => {
    if (JSON.stringify(valueRef.current) !== JSON.stringify(value)) {
      valueRef.current = value;

      const timeoutId = setTimeout(() => {
        if (value) {
          setYear(String(value.getFullYear()));
          setMonth(String(value.getMonth() + 1));
          setDay(String(value.getDate()));
        } else {
          setYear('');
          setMonth('');
          setDay('');
        }
      }, 0);

      return (): void => clearTimeout(timeoutId);
    }
  }, [value]);

  useEffect(() => {
    if (selectedDate && year && month && day) {
      const dayNum = parseInt(day);
      const monthNum = parseInt(month) - 1;
      const yearNum = parseInt(year);

      if (!isNaN(dayNum) && !isNaN(monthNum) && !isNaN(yearNum)) {
        const constructedDate = new Date(yearNum, monthNum, dayNum);
        if (
          constructedDate.getDate() === dayNum &&
          constructedDate.getMonth() === monthNum &&
          constructedDate.getFullYear() === yearNum
        ) {
          onChange(constructedDate);
        } else {
          onChange(null);
        }
      } else {
        onChange(null);
      }
    } else {
      onChange(null);
    }
  }, [day, month, year, onChange, selectedDate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as Node;

      const isOutsideDay = !daySelectRef.current?.contains(target);
      const isOutsideMonth = !monthSelectRef.current?.contains(target);
      const isOutsideYear = !yearSelectRef.current?.contains(target);

      if (prevOpenDropdownRef.current && isOutsideDay && isOutsideMonth && isOutsideYear) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDayChange = (selectedDay: string): void => {
    setDay(selectedDay);
    setOpenDropdown(null);
  };

  const handleMonthChange = (selectedMonth: string): void => {
    setMonth(selectedMonth);
    setDay((prevDay) => {
      if (days.length > 0) {
        const maxDay = days.length;
        const currentDay = parseInt(prevDay);
        if (currentDay > maxDay) {
          return String(maxDay);
        }
      }
      return prevDay;
    });
    setOpenDropdown(null);
  };

  const handleYearChange = (selectedYear: string): void => {
    setYear(selectedYear);
    setDay((prevDay) => {
      if (days.length > 0) {
        const maxDay = days.length;
        const currentDay = parseInt(prevDay);
        if (currentDay > maxDay) {
          return String(maxDay);
        }
      }
      return prevDay;
    });
    setOpenDropdown(null);
  };

  const getDayLabel = (): string => day || '1';
  const getMonthLabel = (): string => {
    const monthObj = months.find((m) => m.value === month);
    return monthObj ? monthObj.label : 'январь';
  };
  const getYearLabel = (): string => year || '2000';

  const handleButtonClick = (dropdownType: 'day' | 'month' | 'year'): void => {
    setOpenDropdown((prev) => (prev === dropdownType ? null : dropdownType));
  };

  return {
    daySelectRef,
    monthSelectRef,
    yearSelectRef,
    openDropdown,
    setOpenDropdown,
    dayLabel: getDayLabel(),
    monthLabel: getMonthLabel(),
    yearLabel: getYearLabel(),
    days,
    months,
    years,
    handleDayChange,
    handleMonthChange,
    handleYearChange,
    handleButtonClick,
  };
};
