'use client';

import { usePathname } from 'next/navigation';
import { JSX, ReactNode } from 'react';
import { MobileBottomNavigation } from './navigation';

type Props = {
  children: ReactNode;
};

export const MobileLayout = ({ children }: Props): JSX.Element => {
  const pathname = usePathname();

  const isRootPage = pathname === '/chats' || pathname === '/contacts' || pathname === '/settings';

  return (
    <div>
      <main>{children}</main>

      {isRootPage && <MobileBottomNavigation />}
    </div>
  );
};
