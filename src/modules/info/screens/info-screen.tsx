'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useWebSocketChat } from 'modules/conversation/messages-chat/api/web-socket/use-web-socket-chat';
import { JSX, useEffect } from 'react';
import { DropdownItem } from 'shared/ui/dropdown/dropdown.props';
import { useInfoProfileQuery } from '../api';
import { useInfoEditGroupStore } from '../model/info.edit-group.store';
import { useInfoSearchStore } from '../model/info.search.store';
import { useInfoStore } from '../model/info.store';
import { AddOrRemoveMembersRequestAPI } from '../model/info.web-socket.api.schema';
import BackIcon from '../shared/icons/back.svg';
import BackArrowIcon from '../shared/icons/backarrow.svg';
import BlockIcon from '../shared/icons/block.svg';
import ClearIcon from '../shared/icons/clear.svg';
import DeleteIcon from '../shared/icons/delete-outline.svg';
import ForwardIcon from '../shared/icons/forward.svg';
import LeaveIconRed from '../shared/icons/leave-red.svg';
import LeaveIcon from '../shared/icons/leave.svg';
import { AddMembersButton } from '../ui/add-members-button';
import { InfoHeader } from '../ui/info-header';
import { InfoLayout } from '../ui/info-layout';
import { AddMemberPanel } from '../widgets/add-member-panel';
import { ChannelPanel } from '../widgets/channel-panel';
import { ContactPanel } from '../widgets/contact-panel';
import { GroupPanel } from '../widgets/group-panel';
import { SettingsPanel } from '../widgets/settings-panel';
import { InfoScreenProps } from './info-screen.props';
import { useChatFilesListScreen } from './use-chat-files-list-screen';
import { useParticipantsScreen } from './use-participant-screen';
export const InfoScreen = ({ uid, wsUrl, currentUid }: InfoScreenProps): JSX.Element => {
  const {
    openClearModal,
    setUid,
    openBlockModal,
    openForwardModal,
    openLeaveGroupModal,
    openDeleteGroupModal,
    openEditChatModal,
    isGroupSettingsMode,
    enterSettingsMode,
    exitSettingsMode,
    isAddMembersMode,
    exitSelectionMode,
    toggleInfoOpen,
    selectedIds,
    clearSelection,
  } = useInfoStore();
  const { clearQuery } = useInfoSearchStore();
  const { hasChanges } = useInfoEditGroupStore();
  const { sendMembers } = useWebSocketChat(wsUrl, currentUid);
  const { data: profile, isLoading } = useInfoProfileQuery(uid);
  const { filesList } = useChatFilesListScreen(uid);

  const { participants } = useParticipantsScreen(uid);
  const queryClient = useQueryClient();

  useEffect(() => {
    setUid(uid);

    return (): void => {
      exitSettingsMode();
      clearSelection();
    };
  }, [uid, setUid]);

  const isGroup = uid.startsWith('group_');
  const isChannel = uid.startsWith('channel_');
  const participant = participants?.find((p) => p.uid === currentUid);

  const groupMenuItems: DropdownItem[] = [
    {
      label: 'Покинуть группу',
      icon: <LeaveIcon />,
      onClick: openLeaveGroupModal,
    },
  ];

  if (isGroup && participant?.isOwner) {
    groupMenuItems.unshift({
      label: 'Очистить чат',
      icon: <ClearIcon />,
      onClick: openClearModal,
    });
    groupMenuItems.push({
      label: 'Удалить группу',
      icon: <DeleteIcon />,
      variant: 'alert',
      onClick: openDeleteGroupModal,
    });
  }

  const channelMenuItems: DropdownItem[] = [];

  if (isChannel && !participant?.isOwner) {
    channelMenuItems.push({
      label: 'Покинуть канал',
      icon: <LeaveIconRed />,
      variant: 'alert',
      onClick: openLeaveGroupModal,
    });
  }

  if (isChannel && participant?.isOwner) {
    channelMenuItems.unshift({
      label: 'Очистить канал',
      icon: <ClearIcon />,
      onClick: openClearModal,
    });
    channelMenuItems.push({
      label: 'Удалить канал',
      icon: <DeleteIcon />,
      variant: 'alert',
      onClick: openDeleteGroupModal,
    });
  }

  const contactMenuItems: DropdownItem[] = [
    {
      label: 'Поделиться профилем',
      icon: <ForwardIcon />,
      onClick: openForwardModal,
    },
    {
      label: 'Очистить чат',
      icon: <ClearIcon />,
      onClick: openClearModal,
    },
  ];

  if (!isGroup && !profile?.isBlocked) {
    contactMenuItems.push({
      label: 'Заблокировать',
      icon: <BlockIcon />,
      variant: 'alert',
      onClick: openBlockModal,
    });
  }

  const handleBack = (): void => {
    clearSelection();
    clearQuery();
    exitSelectionMode();
  };

  const handleSettingBack = (): void => {
    if (hasChanges) {
      openEditChatModal();
    } else {
      exitSettingsMode();
    }
  };

  const handleAddMembers = (): void => {
    if (selectedIds) {
      const requestUid = crypto.randomUUID();
      const payload: AddOrRemoveMembersRequestAPI = {
        action: 'add_members_to_chat',
        request_uid: requestUid,
        object: {
          chat_key: uid,
          uid_users_list: [...selectedIds],
        },
      };
      sendMembers(payload);

      queryClient.refetchQueries({
        queryKey: ['participants', 'participants-list', uid],
      });

      clearSelection();
      clearQuery();
      exitSelectionMode();
    }
  };

  const renderWithLayout = (header: JSX.Element, content: JSX.Element, footer?: JSX.Element): JSX.Element => (
    <>
      <InfoLayout header={header} footer={footer}>
        {content}
      </InfoLayout>
    </>
  );

  if (isGroup) {
    if (isAddMembersMode) {
      return renderWithLayout(
        <InfoHeader title="Пригласить участников" backProps={{ icon: <BackIcon />, onClick: handleBack }} />,
        <AddMemberPanel chatKey={uid} />,
        <AddMembersButton label="Добавить в группу" onClick={handleAddMembers} disabled={selectedIds.size === 0} />,
      );
    }

    if (isGroupSettingsMode) {
      return renderWithLayout(
        <InfoHeader title="Настройки" backProps={{ icon: <BackArrowIcon />, onClick: handleSettingBack }} />,
        <SettingsPanel uid={uid} wsUrl={wsUrl} currentUid={currentUid} />,
      );
    }

    return renderWithLayout(
      <InfoHeader
        menuItems={groupMenuItems}
        title="Информация о группе"
        onClose={toggleInfoOpen}
        onSetting={participant?.isOwner ? enterSettingsMode : undefined}
      />,
      <GroupPanel uid={uid} currentUid={currentUid} wsUrl={wsUrl} filesList={filesList} />,
    );
  }

  if (isChannel) {
    if (isAddMembersMode) {
      return renderWithLayout(
        <InfoHeader title="Пригласить подписчиков" backProps={{ icon: <BackIcon />, onClick: handleBack }} />,
        <AddMemberPanel chatKey={uid} />,
        <AddMembersButton label="Добавить в канал" onClick={handleAddMembers} disabled={selectedIds.size === 0} />,
      );
    }

    if (isGroupSettingsMode) {
      return renderWithLayout(
        <InfoHeader title="Настройки" backProps={{ icon: <BackArrowIcon />, onClick: handleSettingBack }} />,
        <SettingsPanel uid={uid} wsUrl={wsUrl} currentUid={currentUid} />,
      );
    }

    return renderWithLayout(
      <InfoHeader
        menuItems={channelMenuItems}
        title="Информация о канале"
        onClose={toggleInfoOpen}
        onSetting={participant?.isOwner ? enterSettingsMode : undefined}
      />,
      <ChannelPanel uid={uid} currentUid={currentUid} wsUrl={wsUrl} filesList={filesList} />,
    );
  }

  return renderWithLayout(
    <InfoHeader menuItems={contactMenuItems} onClose={toggleInfoOpen} />,
    <ContactPanel
      uid={uid}
      profile={profile}
      isLoading={isLoading}
      currentUid={currentUid}
      wsUrl={wsUrl}
      filesList={filesList}
    />,
  );
};
