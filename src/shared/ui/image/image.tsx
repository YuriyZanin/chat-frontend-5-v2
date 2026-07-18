import clsx from 'clsx';
import Image from 'next/image';
import { JSX } from 'react';
import styles from './image.module.scss';
import { ImageUIProps } from './image.props';

export const ImageUI = ({ src, alt, classNames, rootProps, ...imageProps }: ImageUIProps): JSX.Element => {
  if (src == null) return <div></div>;

  return (
    <div className={clsx(styles.root, classNames?.root)} {...rootProps}>
      <Image src={src} alt={alt} className={clsx(styles.image, classNames?.image)} {...imageProps} />
    </div>
  );
};
