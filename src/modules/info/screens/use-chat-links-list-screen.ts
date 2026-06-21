'use client';
import { useMemo } from 'react';
import { useChatLinksListQuery } from '../api/info.query';
import type { MessageLinkApi } from '../model/info.api.schema';

type useChatFilesListScreenReturn = {
  linksList: MessageLinkApi[] | undefined;
};

export const useChatLinksListScreen = ({
  query,
  chatKey,
}: {
  query: string;
  chatKey: string;
}): useChatFilesListScreenReturn => {
  const { data } = useChatLinksListQuery({ query, chatKey });
  const linksList = useMemo(() => data?.pages.flatMap((page) => page.results ?? []), [data]);
  return {
    linksList,
  };
};
