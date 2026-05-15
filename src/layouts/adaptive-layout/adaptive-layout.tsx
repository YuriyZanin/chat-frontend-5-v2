'use client';

import { MobileLayout } from 'layouts/mobile-layout';
import { ProtectedLayout } from 'layouts/protected-layout';
import { useMediaQuery } from 'shared/hooks';
import { ReactNode } from 'react';

export type AdaptiveLayoutProps = {
  nav: ReactNode;
  list: ReactNode;
  main: ReactNode;
  info: ReactNode;
};
export const AdaptiveLayout = ({
  nav,
  list,
  main,
  info,
}: AdaptiveLayoutProps) => {
  const isMobile = useMediaQuery('(max-width: 410px)');

  if (isMobile) {
    return <MobileLayout>{list}</MobileLayout>;
  }

  return (
    <ProtectedLayout
      nav={nav}
      list={list}
      main={main}
      info={info}
    />
  );
};