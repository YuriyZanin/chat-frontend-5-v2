'use client';

import { useCallback, useEffect, useRef } from 'react';
import { z } from 'zod';

// ---------- Zod схемы ----------
const ChatTypeEnum = z.enum(['public-group', 'private-group', 'public-channel', 'private-channel']);

const CreateChatObjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(250).optional(),
  avatar_uid: z.string().optional(),
  chat_type: ChatTypeEnum,
  uid_users_list: z.array(z.string().uuid()),
});

const CreateChatRequestSchema = z.object({
  action: z.literal('create_chat'),
  request_uid: z.string().uuid(),
  object: CreateChatObjectSchema,
});

// ---------- Типы ----------
export type CreateGroupParams = {
  name: string;
  chatType: z.infer<typeof ChatTypeEnum>;
  uidUsersList: string[];
  description?: string;
  avatarUid?: string;
};

export type CreateGroupResponse = {
  chatId: string;
  chatKey: string;
  name: string;
  description?: string;
  chatType: string;
  addedUsers: Array<{ uid: string; fullName: string }>;
};

type AddedUser = {
  uid: string;
  full_name: string;
};

type PendingRequest = {
  resolve: (value: CreateGroupResponse) => void;
  reject: (reason?: unknown) => void;
  timeout: NodeJS.Timeout;
};

// ---------- Хук ----------
export function useWebSocketCreateGroup(wsUrl: string): {
  createGroup: (params: CreateGroupParams) => Promise<CreateGroupResponse>;
} {
  const wsRef = useRef<WebSocket | null>(null);
  const connectWSRef = useRef<() => void>(() => {});
  const pendingRequests = useRef<Map<string, PendingRequest>>(new Map());

  // Подключение к WebSocket
  const connectWS = useCallback((): void => {
    if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) {
      return;
    }

    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;

    socket.onopen = (): void => {
      console.log('WebSocket connected for create group');
    };

    socket.onclose = (): void => {
      console.log('WebSocket closed for create group, reconnecting in 2s');
      setTimeout((): void => {
        connectWSRef.current();
      }, 2000);
    };

    socket.onerror = (error: Event): void => {
      console.error('WebSocket error for create group:', error);
      socket.close();
    };

    socket.onmessage = (event: MessageEvent): void => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message (create group):', data);

        if (data.action === 'create_chat') {
          const requestUid = data.request_uid;
          const pending = pendingRequests.current.get(requestUid);

          if (pending) {
            clearTimeout(pending.timeout);
            pendingRequests.current.delete(requestUid);

            if (data.status === 'OK' && data.object) {
              const result: CreateGroupResponse = {
                chatId: data.object.chat_id,
                chatKey: data.object.chat_key,
                name: data.object.name,
                description: data.object.description,
                chatType: data.object.chat_type,
                addedUsers: (data.object.added_users || []).map((u: AddedUser): { uid: string; fullName: string } => ({
                  uid: u.uid,
                  fullName: u.full_name,
                })),
              };
              pending.resolve(result);
            } else {
              pending.reject(new Error(data.error || 'Failed to create chat'));
            }
          }
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };
  }, [wsUrl]);

  // Управление жизненным циклом соединения
  useEffect(() => {
    connectWSRef.current = connectWS;
    connectWS();

    return (): void => {
      // Копируем текущее значение ref, чтобы избежать проблем с изменением ref во время очистки
      const currentPendingRequests = pendingRequests.current;
      if (wsRef.current) {
        wsRef.current.close();
      }
      // Отклоняем все ожидающие запросы при размонтировании
      currentPendingRequests.forEach((pending): void => {
        clearTimeout(pending.timeout);
        pending.reject(new Error('Component unmounted'));
      });
      currentPendingRequests.clear();
    };
  }, [connectWS]);

  // Основная функция создания группы
  const createGroup = useCallback((params: CreateGroupParams): Promise<CreateGroupResponse> => {
    return new Promise((resolve, reject): void => {
      const requestUid = crypto.randomUUID();

      const payload = {
        action: 'create_chat',
        request_uid: requestUid,
        object: {
          name: params.name,
          chat_type: params.chatType,
          uid_users_list: params.uidUsersList,
          ...(params.description && { description: params.description }),
          ...(params.avatarUid && { avatar_uid: params.avatarUid }),
        },
      };

      // Валидация через Zod
      const validation = CreateChatRequestSchema.safeParse(payload);
      if (!validation.success) {
        reject(new Error(`Invalid request payload: ${validation.error.message}`));
        return;
      }

      const socket = wsRef.current;
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(payload));
        console.log('Sent create_chat request:', payload);

        // Таймаут 10 секунд
        const timeout = setTimeout((): void => {
          pendingRequests.current.delete(requestUid);
          reject(new Error('Timeout waiting for create chat response'));
        }, 10000);

        pendingRequests.current.set(requestUid, { resolve, reject, timeout });
      } else {
        reject(new Error('WebSocket is not connected'));
      }
    });
  }, []);

  return { createGroup };
}
