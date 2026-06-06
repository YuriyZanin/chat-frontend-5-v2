import { UserContactApiResponse } from 'modules/conversation/contacts/model/contact';
import { apiFetch } from 'shared/api';
import type { FilesSeachQueryApi, PaginatedGroupChannelFileListApi } from '../model/info.api.schema';
import {
  BlockProfileApiResponse,
  ChatPost,
  ChatPostApiResponse,
  GroupAvatarApiResponse,
  GroupOrChanelApiResponse,
  InfoProfileApiResponse,
  InviteLinkApiResponse,
  InviteSettingsPost,
  NewContact,
  ParticipantApiResponse,
  ParticipantQuery,
  UserForAddApiResponse,
  UserForAddQuery,
} from '../model/info.api.schema';

export const getProfileInfoById = (
  id: string,
  { signal }: { signal?: AbortSignal } = {},
): Promise<InfoProfileApiResponse> => {
  return apiFetch<InfoProfileApiResponse>(`/api/proxy/api/v1/contact/${id}`, {
    method: 'GET',
    signal,
  });
};

export const getGroupOrChannel = (
  chatKey: string,
  { signal }: { signal?: AbortSignal } = {},
): Promise<GroupOrChanelApiResponse> => {
  return apiFetch<GroupOrChanelApiResponse>(`/api/proxy/api/v1/chat/list/groups_or_channels/${chatKey}/`, {
    method: 'GET',
    signal,
  });
};

export const blockUser = (uid: string): Promise<BlockProfileApiResponse> => {
  return apiFetch<BlockProfileApiResponse>(`/api/proxy/api/v1/contact/blacklist/add/${uid}/`, {
    method: 'POST',
    body: undefined,
  });
};

export const unblockUser = async (uid: string): Promise<void> => {
  await apiFetch<void>(`/api/proxy/api/v1/contact/blacklist/delete/${uid}/`, { method: 'DELETE' });
};

export const addToContact = async (
  contact: NewContact,
  { signal }: { signal?: AbortSignal } = {},
): Promise<UserContactApiResponse> => {
  return apiFetch<UserContactApiResponse>(`/api/proxy/api/v1/contact/messenger-add-by-uid/`, {
    method: 'POST',
    body: JSON.stringify(contact),
    signal,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const editChat = async (
  chatPost: ChatPost,
  chatId: number,
  { signal }: { signal?: AbortSignal } = {},
): Promise<ChatPostApiResponse> => {
  return apiFetch<ChatPostApiResponse>(`/api/proxy/api/v1/chat/list/${chatId}/`, {
    method: 'POST',
    body: JSON.stringify(chatPost),
    signal,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const generateInvite = async (
  inviteSettings: InviteSettingsPost,
  chatKey: string,
  { signal }: { signal?: AbortSignal } = {},
): Promise<InviteLinkApiResponse> => {
  return apiFetch<InviteLinkApiResponse>(`/api/proxy/api/v1/chat/list/generate-invite/${chatKey}/`, {
    method: 'POST',
    body: JSON.stringify(inviteSettings),
    signal,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getParticipantList = (params: ParticipantQuery, chatKey: string): Promise<ParticipantApiResponse> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('page', String(params.page));
  if (params.page_size) searchParams.set('page_size', String(params.page_size));
  if (params.search) searchParams.set('search', params.search);

  return apiFetch<ParticipantApiResponse>(
    `/api/proxy/api/v1/chat/list/groups_or_channels/${chatKey}/participants/?${searchParams.toString()}`,
    {
      method: 'GET',
    },
  );
};

export const getUserForAddList = (params: UserForAddQuery): Promise<UserForAddApiResponse> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('page', String(params.page));
  if (params.page_size) searchParams.set('page_size', String(params.page_size));
  if (params.search) searchParams.set('search', params.search);

  return apiFetch<UserForAddApiResponse>(`/api/proxy/api/v1/chat/list/users-for-add/?${searchParams.toString()}`, {
    method: 'GET',
  });
};

export const updateAvatar = (file: File): Promise<GroupAvatarApiResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  return apiFetch<GroupAvatarApiResponse>(`/api/proxy/api/v1/media/upload/group-avatar/`, {
    method: 'POST',
    body: formData,
  });
};

export const getChatFileList = (
  params: FilesSeachQueryApi,
  chatKey: string,
): Promise<PaginatedGroupChannelFileListApi> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('page', String(params.page));
  if (params.page_size) searchParams.set('page_size', String(params.page_size));
  if (params.search) searchParams.set('search', params.search);

  return apiFetch<PaginatedGroupChannelFileListApi>(
    `/api/proxy/api/v1/chat/message/files/${chatKey}/?${searchParams.toString()}`,
    {
      method: 'GET',
    },
  );
};
