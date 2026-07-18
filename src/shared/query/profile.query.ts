'use client';

import { useMutation, UseMutationResult, useQuery, UseQueryResult } from '@tanstack/react-query';
import { AvatarUploadResponse, getProfile, ProfileResponse, updateProfile, uploadAvatar } from '../api/profile.api';

export type UpdateProfilePayload = {
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

export const useUploadAvatar = (): UseMutationResult<AvatarUploadResponse, unknown, File, unknown> => {
  return useMutation({
    mutationFn: uploadAvatar,
  });
};

export const useUpdateProfile = (): UseMutationResult<ProfileResponse, unknown, UpdateProfilePayload, unknown> => {
  return useMutation({
    mutationFn: updateProfile,
  });
};

export const useGetProfile = (): UseQueryResult<ProfileResponse, unknown> => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });
};
