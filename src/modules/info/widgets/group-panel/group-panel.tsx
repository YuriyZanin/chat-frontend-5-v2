import { useMessagesChatStore } from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import { useGenerateInviteLinkQuery, useGroupOrChanelQuery } from 'modules/info/api/info.query';
import { formatParticipants } from 'modules/info/shared/utils/format';
import { ClearGroupModal } from 'modules/info/ui/clear-group-modal';
import { DeleteGroupModal } from 'modules/info/ui/delete-group-modal';
import { DeleteMemberModal } from 'modules/info/ui/delete-member-modal';
import { InfoAvatar } from 'modules/info/ui/info-avatar';
import { InfoNotification } from 'modules/info/ui/info-notification';
import { InfoSummary } from 'modules/info/ui/info-summary';
import { InfoUploads } from 'modules/info/ui/info-uploads';
import { LeaveGroupModal } from 'modules/info/ui/leave-group-modal';
import { JSX } from 'react';

export const GroupPanel = ({
  uid,
  currentUid,
  wsUrl,
}: {
  uid: string;
  currentUid: string;
  wsUrl: string;
}): JSX.Element => {
  const { data: link } = useGenerateInviteLinkQuery(uid, {
    expires_in: 86400,
  });
  const { data: profile, isLoading } = useGroupOrChanelQuery(uid);

  const name = profile?.name ?? '';
  const membersCount = profile?.participants.length ?? 0;
  const status = formatParticipants(membersCount);
  // все сообщения определенного чата(определеного uid профиля)
  const messagesByUser = useMessagesChatStore((s) => s.messagesByUser[uid]);

  return (
    <>
      {isLoading ? (
        <div>Загрузка...</div>
      ) : (
        <>
          <InfoAvatar
            avatarHref={profile?.avatar ?? '/images/profile/group-default.png'}
            label={name}
            status={status}
          />
          <InfoNotification chatId={profile?.id} />
          <InfoSummary description={profile?.description} />
          <InfoSummary inviteLink={link?.invite_link} chatKey={uid} />
          <InfoUploads messagesByUser={messagesByUser} currentUid={currentUid} wsUrl={wsUrl} />
          <ClearGroupModal wsUrl={wsUrl} currentUid={currentUid} chatKey={uid} />
          <DeleteMemberModal wsUrl={wsUrl} chatKey={uid} currentUid={currentUid} />
          <LeaveGroupModal wsUrl={wsUrl} chatKey={uid} currentUid={currentUid} name={name} />
          <DeleteGroupModal wsUrl={wsUrl} chatKey={uid} currentUid={currentUid} name={name} />
        </>
      )}
    </>
  );
};
