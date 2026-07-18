import { apiFetch, apiFetchFormData } from './fetcher';

export type ProfileData = {
  nickname: string;
  first_name: string;
  last_name?: string;
  patronymic?: string;
  additional_information?: string;
  birthday?: number;
  email?: string;
  gender?: string;
  country?: string;
  city_id?: number;
  phone?: string;
};

export type ProfileResponse = {
  uid: string;
  username: string;
  nickname: string;
  first_name: string;
  last_name: string;
  patronymic: string;
  additional_information: string;
  birthday: number;
  email: string;
  gender: string;
  gender_label: string;
  country: string;
  country_label: string;
  city_id: number;
  city: string;
  phone: string;
  avatar: string;
  avatar_url: string;
  avatar_webp: string;
  avatar_webp_url: string;
  is_doctor: boolean;
  is_confirmed_doctor: boolean;
  is_filled: boolean;
  is_staff: boolean;
};

export type AvatarUploadResponse = {
  file: string;
  file_url: string;
  file_master_url: string;
  file_web_url: string;
  file_small_url: string;
};

export const getProfile = (): Promise<ProfileResponse> => {
  return apiFetch<ProfileResponse>('/api/proxy/api/v1/auth/messenger/profile/', {
    method: 'POST',
    body: JSON.stringify({}),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const updateProfile = (data: ProfileData): Promise<ProfileResponse> => {
  return apiFetch<ProfileResponse>('/api/proxy/api/v1/auth/messenger/profile/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const uploadAvatar = (file: File): Promise<AvatarUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  return apiFetchFormData<AvatarUploadResponse>('/api/proxy/api/v1/auth/messenger/profile/avatar/', formData);
};

export const deleteProfile = (): Promise<{ messages: string }> => {
  console.log('DELETE URL: /api/proxy/api/v1/auth/messenger/profile/');

  return apiFetch<{ messages: string }>('/api/proxy/api/v1/auth/messenger/profile/', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
