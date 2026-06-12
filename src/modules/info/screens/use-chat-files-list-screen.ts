'use client';
import { useMemo } from 'react';
import { useChatFilesListQuery } from '../api/info.query';
import type { ChatFilesListApi } from '../model/info.api.schema';

type useChatFilesListScreenReturn = {
  filesList: ChatFilesListApi[] | undefined;
};

export const useChatFilesListScreen = ({
  query,
  chatKey,
}: {
  query: string;
  chatKey: string;
}): useChatFilesListScreenReturn => {
  const { data } = useChatFilesListQuery({ query, chatKey });
  const filesList = useMemo(() => data?.pages.flatMap((page) => page.results ?? []), [data]);
  return {
    filesList,
  };
};
