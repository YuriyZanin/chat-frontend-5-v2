import { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from '@tanstack/react-query';
import type { MessagesListApiResponse, RestMessageApi } from '../../model/messages-list';
import type { Msg } from '../../zustand-store/zustand-store';

export type MessageListProps = {
  messagesByUser: Msg[];
  currentUserId: string;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions,
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<MessagesListApiResponse>, unknown>>;
  sendChangeStatusReadMessage: (message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' }) => void;
  sendDeleteMessage: (
    message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' },
    selected?: boolean,
  ) => void;
  userIdStore: string;
};
