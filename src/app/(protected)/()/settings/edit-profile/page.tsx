'use client';

import { FillerBlock } from 'modules/settings/ui/all-settings-block/filler-block';
import { EditProfileBlock } from 'modules/settings/ui/edit-profile-block';
import { JSX } from 'react';
import { useMediaQuery } from 'shared/hooks';

export default function SettingsPage(): JSX.Element {
  const isMobile = useMediaQuery('(max-width: 410px)');

  if (isMobile) {
    return <EditProfileBlock />;
  }
  return <FillerBlock />;
}
