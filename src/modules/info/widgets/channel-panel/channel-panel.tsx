import { removeDomain } from 'modules/conversation/chats/utils/utils';
import { useGenerateInviteLinkQuery, useGroupOrChanelQuery } from 'modules/info/api/info.query';
import { formatSubscribers } from 'modules/info/shared/utils/format';
import { ClearChannelModal } from 'modules/info/ui/clear-channel-modal';
import { DeleteGroupModal } from 'modules/info/ui/delete-group-modal';
import { DeleteMemberModal } from 'modules/info/ui/delete-member-modal';
import { InfoAvatar } from 'modules/info/ui/info-avatar';
import { InfoNotification } from 'modules/info/ui/info-notification';
import { InfoSummary } from 'modules/info/ui/info-summary';
import { InfoUploads } from 'modules/info/ui/info-uploads';
import { LeaveChannelModal } from 'modules/info/ui/leave-channel-modal';
import { MakeAdministratorModal } from 'modules/info/ui/make-administrator-modal';
import { JSX } from 'react';
import type { ChannelPanelProps } from './channel-panel.props';
const URL_DEFAUIT_Avatar_Croup = '/images/profile/group-default.png';

export const ChannelPanel = ({ uid, currentUid, filesList }: ChannelPanelProps): JSX.Element | null => {
  const { data: link } = useGenerateInviteLinkQuery(uid, {
    expires_in: 86400,
  });
  const { data: profile, isLoading } = useGroupOrChanelQuery(uid);
  const name = profile?.name ?? '';
  const membersCount = profile?.participants.length ?? 0;
  const status = formatSubscribers(membersCount);
  const tabs = ['Подписчики', 'Медиа', 'Файлы', 'Голосовые', 'Сcылки'];
  if (!profile) return null;
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
          {profile?.description && <InfoSummary description={profile?.description} />}
          <InfoSummary inviteLinkChannel={link?.invite_link} chatKey={uid} />
          <InfoUploads tabs={tabs} currentUid={currentUid} chatKey={uid} filesList={filesList} />
          <ClearChannelModal chatKey={uid} name={name} />
          <DeleteMemberModal chatKey={uid} />
          <LeaveChannelModal chatKey={uid} name={name} />
          <DeleteGroupModal chatKey={uid} name={name} />
          <MakeAdministratorModal chatKey={uid} />
        </>
      )}
    </>
  );
};
