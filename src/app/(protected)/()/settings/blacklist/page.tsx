'use client'

import { FillerBlock } from 'modules/settings/ui/all-settings-block/filler-block';
import { BlackListBlock } from 'modules/settings/ui/black-list-block/black-list-block';
import { JSX } from 'react';
import { useMediaQuery } from 'shared/hooks';

export default function BlacklistPage(): JSX.Element {
  const isMobile = useMediaQuery('(max-width: 410px)');

  if(isMobile){
    return <BlackListBlock />;
  }
  return <FillerBlock />;
  
}
