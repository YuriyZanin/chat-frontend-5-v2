'use client';

import { useQueryClient } from '@tanstack/react-query';
import { AllSettingsBlock } from 'modules/settings';
import { useRouter } from 'next/navigation';
import { JSX } from 'react';

export default function SettingsPage(): JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();

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
    try {
      queryClient.clear();
      localStorage.clear();
      sessionStorage.clear();
      await fetch('/api/auth/remove-tokens', {
        method: 'POST',
      });
      router.push('/auth');
      console.log('Cookies cleared via API route');
    } catch (error) {
      console.error('Failed to clear cookies:', error);
    }
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
