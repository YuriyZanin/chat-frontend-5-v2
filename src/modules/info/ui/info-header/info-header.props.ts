import { JSX } from 'react';
import { DropdownItem } from 'shared/ui/dropdown/dropdown.props';

export type InfoHeaderProps = {
  title?: string;
  menuItems?: DropdownItem[];
  onClose?: () => void;
  onSetting?: () => void;
  backProps?: BackProps;
};

export type BackProps = {
  icon: JSX.Element;
  onClick: () => void;
};
