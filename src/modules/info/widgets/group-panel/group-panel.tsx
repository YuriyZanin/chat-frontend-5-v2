import { removeDomain } from 'modules/conversation/chats/utils/utils';
import { useGenerateInviteLinkQuery } from 'modules/info/api/info.query';
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
import type { GroupPanelProps } from './group-panel.props';

const URL_DEFAUIT_Avatar_Croup = '/images/profile/group-default.png';

export const GroupPanel = ({ uid, currentUid, filesList, profile, isLoading }: GroupPanelProps): JSX.Element => {
  const { data: link } = useGenerateInviteLinkQuery(uid, {
    expires_in: 86400,
  });

  const name = profile?.name ?? '';
  const membersCount = profile?.participants.length ?? 0;
  const status = formatParticipants(membersCount);
  const tabs = ['Участники', 'Медиа', 'Файлы', 'Голосовые', 'Сcылки'];
  // создаем url для запроса картинки через наш прокси-сервер который в запрос вставляет токен чтобы пройти автоизацию
  const result = `/api/proxy${removeDomain(profile?.avatar ?? '')}`;
  return (
    <>
      {isLoading ? (
        <div>Загрузка...</div>
      ) : (
        <>
          <InfoAvatar
            avatarHref={result !== '/api/proxy' ? result : URL_DEFAUIT_Avatar_Croup}
            label={name}
            status={status}
          />
          <InfoNotification chatId={profile?.id} />
          <InfoSummary description={profile?.description} />
          <InfoSummary inviteLink={link?.invite_link} chatKey={uid} />
          <InfoUploads tabs={tabs} currentUid={currentUid} chatKey={uid} filesList={filesList} />
          <ClearGroupModal chatKey={uid} />
          <DeleteMemberModal chatKey={uid} />
          <LeaveGroupModal chatKey={uid} name={name} />
          <DeleteGroupModal chatKey={uid} name={name} />
        </>
      )}
    </>
  );
};
