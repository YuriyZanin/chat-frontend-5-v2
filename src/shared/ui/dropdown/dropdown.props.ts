import { JSX } from 'react';

export type DropdownProps = {
  trigger?: React.ReactNode;
  children?: React.ReactNode;
  items: DropdownItem[];
};

export type DropdownItem = {
  label: string;
  icon?: JSX.Element | string;
  variant?: 'general' | 'alert';
  onClick?: () => void;
};
