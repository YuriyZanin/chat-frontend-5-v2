import { ButtonHTMLAttributes } from 'react';

type AppearanceMap = {
  general: ['primary', 'secondary', 'disabled', 'pending'];
  modal: ['primary', 'primaryLarge', 'secondary', 'warn', 'error'];
};

export type ButtonVariant = keyof AppearanceMap;

type ButtonAppearance<V extends ButtonVariant> = AppearanceMap[V][number];

export type ButtonProps<V extends ButtonVariant> = ButtonHTMLAttributes<HTMLButtonElement> & {
  spinner?: boolean;
  label: string;
  variant: V;
  appearance: ButtonAppearance<V>;
};
