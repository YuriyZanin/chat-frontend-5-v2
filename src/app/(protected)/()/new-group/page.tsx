'use client';
import { CreateNewGroupBlock } from 'modules/new-group';
import { FillerBlock } from 'modules/settings/ui/all-settings-block/filler-block';
import { JSX } from 'react';
import { useMediaQuery } from 'shared/hooks/use-media-query';

export default function SettingsPage(): JSX.Element {
  const isMobile = useMediaQuery('(max-width: 410px)');
  if (isMobile) {
    return <CreateNewGroupBlock />;
  }
  return <FillerBlock />;
}
