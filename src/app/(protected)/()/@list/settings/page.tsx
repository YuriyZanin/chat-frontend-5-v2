'use client';

import { useQueryClient } from '@tanstack/react-query';
import { AllSettingsBlock } from 'modules/settings';
import { useRouter } from 'next/navigation';
import { JSX } from 'react';

const AUTH_CHANNEL = 'auth';

export default function SettingsPage(): JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();
  let isLoggingOut = false;

  const handleProfileEdit = (): void => {
    router.push('/settings/edit-profile');
  };

  const handleSupport = (): void => {
    router.push('/settings/support');
  };

  const handleBlacklist = (): void => {
    router.push('/settings/blacklist');
  };

  const handleLeave = async (): Promise<void> => {
    if (isLoggingOut) return;
    isLoggingOut = true;

    try {
      const res = await fetch('/api/auth/remove-tokens', {
        method: 'POST',
      });
      if (!res.ok) throw new Error('remove-tokens failed');

      broadcastAuthChanged();

      queryClient.clear();
      localStorage.clear();
      sessionStorage.clear();

      router.replace('/auth');
      console.log('Cookies cleared via API route');
    } catch (error) {
      console.error('Failed to clear cookies:', error);
    }
  };

  const broadcastAuthChanged = (): void => {
    const ch = new BroadcastChannel(AUTH_CHANNEL);
    ch.postMessage({ type: 'AUTH_CHANGED', at: Date.now() });
    ch.close();
  };

  return (
    <AllSettingsBlock
      editProfile={handleProfileEdit}
      blackList={handleBlacklist}
      support={handleSupport}
      leave={handleLeave}
    />
  );
}
