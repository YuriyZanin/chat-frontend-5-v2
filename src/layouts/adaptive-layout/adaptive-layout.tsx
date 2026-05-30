'use client';

import { MobileLayout } from 'layouts/mobile-layout';
import { ProtectedLayout } from 'layouts/protected-layout';
import { JSX, ReactNode } from 'react';
import { useMediaQuery } from 'shared/hooks';

export type AdaptiveLayoutProps = {
  nav: ReactNode;
  list: ReactNode;
  main: ReactNode;
  info: ReactNode;
};
export const AdaptiveLayout = ({ nav, list, main, info }: AdaptiveLayoutProps): JSX.Element => {
  const isMobile = useMediaQuery('(max-width: 410px)');

  if (isMobile) {
    return <MobileLayout>{main}</MobileLayout>;
  }

  return <ProtectedLayout nav={nav} list={list} main={main} info={info} />;
};
