import { ReactNode } from 'react';

export type ProtectedLayoutProps = {
  nav: ReactNode;
  list: ReactNode;
  main: ReactNode;
  info: ReactNode;
  wsUrl: string;
  currentUserId: string;
  refreshUrl: string;
};
