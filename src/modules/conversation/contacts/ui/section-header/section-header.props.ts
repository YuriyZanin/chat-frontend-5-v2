import { ReactNode } from 'react';

export type SectionHeaderProps = {
  label: string;
  isHighlighted: boolean;

  leftAction: ReactNode;
  rightAction?: ReactNode;
};
