import { JSX } from 'react';

export type MenuItemProps = {
  text: string;
  icon?: JSX.Element | string;
  variant?: 'general' | 'alert';
  onClick?: () => void;
};
