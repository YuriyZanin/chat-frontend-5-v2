'use client';

import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { JSX, useEffect } from 'react';

const AUTH_CHANNEL = 'auth';

export const AuthSync = (): JSX.Element | null => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  useEffect(() => {
    const ch = new BroadcastChannel(AUTH_CHANNEL);

    ch.onmessage = (ev): void => {
      if (ev.data?.type !== 'AUTH_CHANGED') return;

      // чистим состояние этой вкладки
      queryClient.clear();
      localStorage.clear();
      sessionStorage.clear();

      // уводим на /auth и обновляем серверные компоненты
      if (pathname !== '/auth') router.replace('/auth');
      router.refresh();
    };

    return (): void => ch.close();
  }, [queryClient, router]);

  return null;
};
