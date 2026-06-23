import { useQueryClient } from '@tanstack/react-query';
import { useWebSocketChatStore } from 'modules/conversation/messages-chat/api/web-socket/use-web-socket-chat-store';
import { useGenerateInviteLinkQuery, useGroupOrChanelQuery } from 'modules/info/api/info.query';
import { ChatType } from 'modules/info/entity/info.entity';
import { useInfoEditGroupStore } from 'modules/info/model/info.edit-group.store';
import { useInfoStore } from 'modules/info/model/info.store';
import { EditChatRequestAPI } from 'modules/info/model/info.web-socket.api.schema';
import { EditChatModal } from 'modules/info/ui/edit-chat-modal';
import { InfoAvatarUploader } from 'modules/info/ui/info-avatar-uploader';
import { InfoGroupInviteLink } from 'modules/info/ui/info-group-invite-link';
import { InfoGroupSettingsSaveButton } from 'modules/info/ui/info-group-settings-save-button';
import { InfoGroupSummaryEdit } from 'modules/info/ui/info-group-summary-edit';
import { InfoGroupTypeSelect } from 'modules/info/ui/info-group-type-select';
import { InfoNotification } from 'modules/info/ui/info-notification';
import { JSX, useEffect } from 'react';

export const SettingsPanel = ({ uid }: { uid: string }): JSX.Element | null => {
  const { data: profile, isLoading } = useGroupOrChanelQuery(uid);
  const { data: link } = useGenerateInviteLinkQuery(uid, {
    expires_in: 86400,
  });
  const { setGroupData, resetGroup, avatarUid, name, description, chatType, hasChanges } = useInfoEditGroupStore();
  const { isGroupSettingsMode } = useInfoStore();
  const webSocketChatSrore = useWebSocketChatStore((s) => s.webSocketChat);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoading) {
      setGroupData({
        name: profile?.name,
        description: profile?.description,
        chatType: profile?.chatType,
        avatarUid: undefined,
      });
    }

    return (): void => {
      resetGroup();
    };
  }, [profile, isLoading]);

  useEffect(() => {
    const hasChanges =
      name !== profile?.name || description !== profile.description || chatType !== profile.chatType || !!avatarUid;
    setGroupData({
      hasChanges: hasChanges,
    });
  }, [name, description, chatType, avatarUid, profile]);

  const handleSave = async (): Promise<void> => {
    if (webSocketChatSrore === null) return;
    const { sendEditGroup } = webSocketChatSrore;
    setGroupData({ isSaving: true });
    try {
      const requestUid = crypto.randomUUID();
      const payload: EditChatRequestAPI = {
        action: 'edit_chat',
        request_uid: requestUid,
        object: {
          chat_key: uid,
          name: name,
          description: description,
          chat_type: chatType,
          avatar_uid: avatarUid,
        },
      };

      await sendEditGroup(payload);
      await queryClient.refetchQueries({ queryKey: ['info', 'group', uid] });
      queryClient.invalidateQueries({ queryKey: ['chats', 'chat-list'] });
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
    } finally {
      setGroupData({ isSaving: false });
    }
  };

  if (!isGroupSettingsMode) return null;

  return (
    <>
      {isLoading ? (
        <div>Загрузка...</div>
      ) : (
        <>
          <InfoAvatarUploader avatarHref={profile?.avatar} />
          <InfoNotification chatId={profile?.id} />
          <InfoGroupSummaryEdit />
          <InfoGroupTypeSelect chatType={profile?.chatType as ChatType} />
          <InfoGroupInviteLink inviteLink={link?.invite_link ?? ''} chatKey={uid} />
          <InfoGroupSettingsSaveButton label={'Сохранить'} onClick={handleSave} disabled={!hasChanges} />
          <EditChatModal chatKey={uid} />
        </>
      )}
    </>
  );
};
