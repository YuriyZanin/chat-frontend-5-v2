'use client';
import { FillerBlock } from 'modules/settings/ui/all-settings-block/filler-block';
import { SupportBlock } from 'modules/settings/ui/support-block';
import { JSX } from 'react';
import { useMediaQuery } from 'shared/hooks';

export default function SettingsPage(): JSX.Element {
  const isMobile = useMediaQuery('(max-width: 410px)');

  if (isMobile) {
    return <SupportBlock />;
  }
  return <FillerBlock />;
}
