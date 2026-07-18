import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { ImageProps as NextImageProps } from 'next/image';
import { ComponentProps } from 'react';

type DivProps = ComponentProps<'div'> & {
  [key: `data-${string}`]: unknown;
};

type ImageOwnProps = {
  classNames?: {
    root?: string;
    image?: string;
  };
  rootProps?: DivProps;
};

export type ImageUIProps = ImageOwnProps &
  Omit<NextImageProps, 'alt'> & {
    src: string | StaticImport;
    alt: string;
  };
