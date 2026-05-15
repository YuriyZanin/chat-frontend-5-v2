'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { MobileBottomNavigation } from './navigation';
 
type Props = {
  children: ReactNode;
};

export const MobileLayout = ({ children }: Props) => {
  const pathname = usePathname();

  const isRootPage =
    pathname === '/chats' ||
    pathname === '/contacts' ||
    pathname === '/settings';

  return (
    <div>
      <main>{children}</main>

      {isRootPage && <MobileBottomNavigation />}
    </div>
  );
};