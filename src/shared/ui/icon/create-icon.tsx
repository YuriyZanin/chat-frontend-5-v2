import { ComponentType, JSX, SVGProps } from 'react';

export const createIcon = (Svg: ComponentType<SVGProps<SVGSVGElement>>): ComponentType<SVGProps<SVGSVGElement>> => {
  const Icon = (props: SVGProps<SVGSVGElement>): JSX.Element => <Svg aria-hidden focusable={false} {...props} />;

  Icon.displayName = `Icon(${Svg.displayName || Svg.name || 'Svg'})`;

  return Icon;
};
