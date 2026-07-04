'use client';
import { InviteMembersBlock } from 'modules/new-group/ui/invite-members-block';
import { FillerBlock } from 'modules/settings/ui/all-settings-block/filler-block';
import { JSX } from 'react';
import { useMediaQuery } from 'shared/hooks/use-media-query';

export default function InviteMembersPage(): JSX.Element {
  const isMobile = useMediaQuery('(max-width: 410px)');
  if (isMobile) {
    return <InviteMembersBlock />;
  }
  return <FillerBlock />;
}
