import { JSX } from 'react';
import { CheckboxProps } from './checkbox.props';
import CheckboxIcon from './icons/checkbox.svg';
import CheckboxCheckedIcon from './icons/checkedbox.svg';

export const Checkbox = ({ selected }: CheckboxProps): JSX.Element | null => {
  return <>{selected ? <CheckboxCheckedIcon /> : <CheckboxIcon />}</>;
};
