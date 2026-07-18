import { useMemo } from 'react';

type MonthOption = {
  value: string;
  label: string;
};

type UseDateSelectorReturn = {
  years: string[];
  months: MonthOption[];
  days: string[];
  selectedDate: Date | null;
};

const generateYears = (start: number, end: number): number[] => {
  const years: number[] = [];
  for (let i = start; i >= end; i--) {
    years.push(i);
  }
  return years;
};

const months: MonthOption[] = [
  { value: '1', label: 'Январь' },
  { value: '2', label: 'Февраль' },
  { value: '3', label: 'Март' },
  { value: '4', label: 'Апрель' },
  { value: '5', label: 'Май' },
  { value: '6', label: 'Июнь' },
  { value: '7', label: 'Июль' },
  { value: '8', label: 'Август' },
  { value: '9', label: 'Сентябрь' },
  { value: '10', label: 'Октябрь' },
  { value: '11', label: 'Ноябрь' },
  { value: '12', label: 'Декабрь' },
];

export const useDateSelector = (yearStr: string, monthStr: string): UseDateSelectorReturn => {
  const year: number = parseInt(yearStr);
  const month: number = parseInt(monthStr);

  const years = useMemo((): number[] => generateYears(new Date().getFullYear(), 1900), []);

  const days = useMemo((): string[] => {
    if (!yearStr || !monthStr || isNaN(year) || isNaN(month)) {
      return Array.from({ length: 31 }, (_, i) => i + 1).map(String);
    }

    const date: Date = new Date(year, month, 0);
    const numDays: number = date.getDate();
    return Array.from({ length: numDays }, (_, i) => i + 1).map(String);
  }, [yearStr, monthStr, year, month]);

  const selectedDate = useMemo((): Date | null => {
    if (yearStr && monthStr && !isNaN(year) && !isNaN(month)) {
      const dayInt: number = parseInt(days[days.length - 1] || '1');
      return new Date(year, month - 1, dayInt);
    }
    return null;
  }, [yearStr, monthStr, days, year, month]);

  return {
    years: years.map(String),
    months,
    days,
    selectedDate,
  };
};
