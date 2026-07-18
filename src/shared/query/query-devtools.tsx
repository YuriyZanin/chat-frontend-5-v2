'use client';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { JSX } from 'react';

export const QueryDevtools = (): JSX.Element => {
  return <ReactQueryDevtools initialIsOpen={false} />;
};
