// // import { FillerBlock } from 'modules/settings/ui/all-settings-block/filler-block';
// // import { JSX } from 'react';

// // export default function SettingsPage(): JSX.Element {
// //   return <FillerBlock />;
// // }
// 'use client';

// import { AllSettingsBlock } from 'modules/settings';
// import { JSX } from 'react';

// export default function SettingsPage(): JSX.Element {
//   return <AllSettingsBlock editProfile={() => {}} blackList={() => {}} support={() => {}} leave={() => {}} />;
// }
'use client';
import { useQueryClient } from '@tanstack/react-query';
import { AllSettingsBlock } from 'modules/settings';
import { FillerBlock } from 'modules/settings/ui/all-settings-block/filler-block';
import { useRouter } from 'next/navigation';
import { JSX } from 'react';
import { useMediaQuery } from 'shared/hooks';
export default function SettingsPage(): JSX.Element {
  const isMobile = useMediaQuery('(max-width: 410px)');
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

  if (isMobile) {
    return (
      <AllSettingsBlock
        editProfile={handleProfileEdit}
        blackList={handleBlacklist}
        support={handleSupport}
        leave={handleLeave}
      />
    );
  }

  return <FillerBlock />;
}
