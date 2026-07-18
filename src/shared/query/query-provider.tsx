'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { JSX, ReactNode, useState } from 'react';
import { queryClient as baseClient } from './query-client';

export const QueryProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [client] = useState(() => baseClient);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
