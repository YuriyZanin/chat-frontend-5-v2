'use client';

import { avatarUploadApi } from 'modules/conversation/chats/api/avatar-upload.api';
import type { Chat } from 'modules/conversation/chats/entity';
import type { CreateChatRequestApi } from 'modules/conversation/chats/model/chat/chat.api.schema';
import { CreateChatRequestSchema } from 'modules/conversation/chats/model/chat/chat.api.schema';
import { translateMessageIntoChat } from 'modules/conversation/chats/utils/utils';
import { useChatsListStore } from 'modules/conversation/chats/zustand-store-chats-list/zustand-store-chats-list';
import {
  AddOrRemoveMembersRequestAPI,
  ClearGroupRequestAPI,
  DeleteGroupRequestAPI,
  EditChatRequestAPI,
  LeaveGroupRequestAPI,
  serializerRequestApiSchema,
  serializerRequestClearGroupMessages,
  serializerRequestEditChat,
  serializerRequestLeaveGroupApiSchema,
} from 'modules/info/model/info.web-socket.api.schema';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import { refreshWsSession } from 'shared/api/session/wsAuth.api';
import { AnswerCallRequestAPI, useCallsStore } from '../../model/calls';
import {
  CallCompleteRequestAPI,
  CallStateRequestAPI,
  IceCandidateRequestAPI,
  OfferCallRequestAPI,
  serializerAnswerRequestApiSchema,
  serializerCallCompleteRequestApiSchema,
  serializerCallOfferRequestApiSchema,
  serializerCallStateRequestApiSchema,
  serializerIceCandidateRequestApiSchema,
} from '../../model/calls/calls.web-socket.api.schema';
import type {
  ChangeStatusReadMessageAPI,
  CreateTextMessageAPI,
  DeleteMessageApi,
  RestMessageApi,
} from '../../model/messages-list';
import {
  serializerRequestChangeStatusReadMessageApiSchema,
  serializerRequestCreatingMessageApiSchema,
  serializerRequestDeleteMessageApiSchema,
} from '../../model/messages-list';
import type { Attachment } from '../../ui/context-menu/context-menu-attach-file/context-menu-attach-file.props';
import { useMessagesChatStore, useUserIdStore } from '../../zustand-store/zustand-store';
import { filesUploadApi } from '../files-upload.api';
import { voiceUploadApi } from '../voice-upload.api';

type UseWebSocketChatReturn = {
  sendMessage: ({
    content,
    repliedMessage,
    forwardMessage,
    file,
    images,
    chatKey,
    toUserUid,
  }: {
    content: string;
    repliedMessage?: RestMessageApi | null | undefined;
    forwardMessage?: RestMessageApi | null | undefined;
    file?: Attachment | null | undefined;
    images?: Attachment[] | null | undefined;
    chatKey?: string;
    toUserUid?: string;
  }) => void;
  sendProfile: (payload: CreateTextMessageAPI) => void;
  sendMembers: (payload: AddOrRemoveMembersRequestAPI) => void;
  sendLeaveGroup: (payload: LeaveGroupRequestAPI) => void;
  sendDeleteGroup: (payload: DeleteGroupRequestAPI) => void;
  sendEditGroup: (payload: EditChatRequestAPI) => void;
  sendClearGroup: (payload: ClearGroupRequestAPI) => void;
  sendAnswerCall: (payload: AnswerCallRequestAPI) => void;
  sendCallCompletion: (payload: CallCompleteRequestAPI) => void;
  sendCallStateUpdate: (payload: CallStateRequestAPI) => void;
  sendIceCandidate: (payload: IceCandidateRequestAPI) => void;
  sendOfferCall: (payload: OfferCallRequestAPI) => void;
  sendChangeStatusReadMessage: (message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' }) => void;
  sendDeleteMessage: (
    message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' },
    selected?: boolean,
  ) => void;
  createGroupOrChannel: ({
    name,
    chatType,
    uidUsersList,
    description,
    avatarPreview,
    file,
  }: {
    name: string;
    chatType: 'public-group' | 'private-group' | 'public-channel' | 'private-channel';
    uidUsersList: string[];
    description?: string;
    avatarPreview?: string;
    file?: File | null;
  }) => void;
};

export function useWebSocketChat(wsUrl: string, currentUserId: string, refreshUrl: string): UseWebSocketChatReturn {
  const router = useRouter();
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastPongRef = useRef<number>(Date.now());
  // прописываем в компоненте актуальный user_uid открытого чата из store
  const userId = useUserIdStore((s) => s.userId);
  const { toUserUid, messageRtcUid, addCandidate, setCallData, setState, resetCall } = useCallsStore();
  //делаем ссылку на актуальный user_uid открытого чата
  const userIdRef = useRef<string>(userId);
  const stopRef = useRef<boolean>(true);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);
  // Ссылка на websocket подключение
  const wsRef = useRef<WebSocket | null>(null);
  //ссылка на uid текущего пользователя мессенджера
  const currentUserIdRef = useRef<string>(currentUserId);

  // блок, чтобы не было гонок
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isUnmountedRef = useRef(false);

  // чтобы игнорировать события от "старого" сокета
  const socketInstanceIdRef = useRef(0);

  // backoff
  const reconnectAttemptRef = useRef(0);
  const maxReconnectDelayMs = 30000;

  // установим начальныe значения сообщений из чатов, если пришёл user_uid с сервера
  const addMessageForUser = useMessagesChatStore.getState().addMessageForUser;
  const updateMessageByUidForUser = useMessagesChatStore.getState().updateMessageByUidForUser;
  const upsertMessageForUser = useMessagesChatStore.getState().upsertMessageForUser;
  const deleteMessageByUidForUser = useMessagesChatStore.getState().deleteMessageByUidForUser;
  const addChatInChatsListStore = useChatsListStore.getState().addChatInChatsList;
  const updateChatByUidStore = useChatsListStore.getInitialState().updateChatByUid;
  const deleteChatByUidStore = useChatsListStore.getInitialState().deleteChatByUid;

  // maccив интервалов [{requestUid:timeout_id},...] на каждое отправленное сообщение с помошью ws
  // нужно отследить через какое время на отправленное клиентом сообщение, ws пришлет ответ-подтверждение,
  // либо его вообще не пришлет
  const pendingTimeouts = useRef<Map<string, number | NodeJS.Timeout>>(new Map()); //
  // массив не отправленных на сервер разных сообщений из-за закрытия (сбоя) ws-соединения
  const messageQueueRef = useRef<
    (
      | ChangeStatusReadMessageAPI
      | CreateTextMessageAPI
      | AddOrRemoveMembersRequestAPI
      | LeaveGroupRequestAPI
      | DeleteGroupRequestAPI
      | EditChatRequestAPI
      | ClearGroupRequestAPI
      | AnswerCallRequestAPI
      | CallCompleteRequestAPI
      | CallStateRequestAPI
      | IceCandidateRequestAPI
      | OfferCallRequestAPI
      | DeleteMessageApi
      | CreateChatRequestApi
    )[]
  >([]);
  // функции пин/понг
  const stopHeartbeat = (): void => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  };
  const startHeartbeat = (socket: WebSocket): void => {
    stopHeartbeat();
    heartbeatIntervalRef.current = setInterval(() => {
      if (socket.readyState !== WebSocket.OPEN) return;
      socket.send(JSON.stringify({ action: 'ping' }));
      console.log('Ping send');
    }, 20000); // каждые 20 секунд
  };

  // Функция для подключаемся к ws-соединению и регистрации ws-обработчиков
  const clearReconnectTimer = (): void => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  };

  const scheduleReconnect = useCallback(() => {
    if (isUnmountedRef.current) return;
    if (!navigator.onLine) return; // нет интернета — не спамим
    if (reconnectTimerRef.current) return; // уже запланировано

    // backoff
    reconnectAttemptRef.current += 1;
    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptRef.current - 1), maxReconnectDelayMs);

    reconnectTimerRef.current = setTimeout(() => {
      reconnectTimerRef.current = null;
      connectWS();
    }, delay);
  }, [wsUrl]); // connectWS объявим ниже (через function declaration или useCallback)

  const connectWS = useCallback(async () => {
    try {
      if (
        wsRef.current &&
        (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)
      ) {
        return;
      }
      clearReconnectTimer();

      // увеличиваем id инстанса
      const myId = ++socketInstanceIdRef.current;
      //перед каждым connect освежаем access
      await refreshWsSession(refreshUrl);

      //подключение к ws-соединению
      const socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = (): void => {
        if (socketInstanceIdRef.current !== myId) return; // устаревший
        console.log('WebSocket open');
        reconnectAttemptRef.current = 0; // сброс backoff
        // отправлем ping
        startHeartbeat(socket);
        // при новом открытии ws-cоединения поворно отправляем все ранее не отправленные сообщения (при наличии),
        messageQueueRef.current.forEach((msg) => {
          socket.send(JSON.stringify(msg));
        });
        messageQueueRef.current = [];
      };

      socket.onclose = async (e): Promise<void> => {
        if (socketInstanceIdRef.current !== myId) return; // устаревший
        stopHeartbeat();
        console.log('WebSocket close', e.code, e.reason);
        // Ошибки 1006 часто при обрыве сети/таймауте
        // Планируем reconnect
        // 1006 чаще всего при 403 handshake
        if (e.code === 1006 || e.code === 4000) {
          try {
            await refreshWsSession(refreshUrl);
            reconnectTimeout.current = setTimeout(scheduleReconnect, 1000);
          } catch {
            console.log('Refresh failed, need relogin');
          }
        }
      };

      socket.onerror = (err): void => {
        // ВАЖНО: не закрываем вручную, пусть onclose сам решит
        console.log('WebSocket Error', err);
      };

      socket.onmessage = (event: MessageEvent): void => {
        if (socketInstanceIdRef.current !== myId) return;
        const data = JSON.parse(event.data);
        console.log(data);
        //Cобытия:
        // 1.Подтверждает отправленние созданного исходящего сообщения в обычный чат по request_uid
        if (
          data.action === 'create_text_message' &&
          data.status === 'OK' &&
          data.object.chat_type === 'chat' &&
          data.object.from_user.uid === currentUserIdRef.current
        ) {
          console.log('Подтверждение сервера об отправке исходящего сообщения в обычный чат) :', data);
          // Если сервер пришлёт подтверждение с request_uid,
          // заменим заклушку стоящую в DOM на присланное сервером сообщение и его статус отметим как sent
          if (data.request_uid) {
            updateMessageByUidForUser(data.object.to_user.uid, data.request_uid, { status: 'sent', ...data.object });
            // Очистим таймаут подтверждения
            pendingTimeouts.current.delete(data.request_uid);
          }
        }
        // Подтверждает отправленние созданного исходящего сообщения в группу по request_uid
        if (
          data.action === 'create_text_message' &&
          data.status === 'OK' &&
          (data.object.chat_type === 'public-group' || data.object.chat_type === 'private-group') &&
          data.object.from_user.uid === currentUserIdRef.current
        ) {
          console.log('Подтверждение сервера об отправке исходящего сообщения в группу) :', data);
          // Если сервер пришлёт подтверждение с request_uid,
          // заменим заклушку стоящую в DOM на присланное сервером сообщение и его статус отметим как sent
          if (data.request_uid) {
            updateMessageByUidForUser(data.object.chat_key, data.request_uid, { status: 'sent', ...data.object });
            // Очистим таймаут подтверждения
            pendingTimeouts.current.delete(data.request_uid);
          }
        }
        // Подтверждает отправленние созданного исходящего сообщения в канал по request_uid
        if (
          data.action === 'create_text_message' &&
          data.status === 'OK' &&
          (data.object.chat_type === 'public-channel' || data.object.chat_type === 'private-channel') &&
          data.object.from_user.uid === currentUserIdRef.current
        ) {
          console.log('Подтверждение сервера об отправке исходящего сообщения в канал) :', data);
          // Если сервер пришлёт подтверждение с request_uid,
          // заменим заклушку стоящую в DOM на присланное сервером сообщение и его статус отметим как sent
          if (data.request_uid) {
            updateMessageByUidForUser(data.object.chat_key, data.request_uid, { status: 'sent', ...data.object });
            // Очистим таймаут подтверждения
            pendingTimeouts.current.delete(data.request_uid);
          }
        }

        // 2. Не подтверждает отправленние созданного исходящего сообщения по request_uid
        if (data.action === 'create_text_message' && data.status === 'error') {
          updateMessageByUidForUser(userIdRef.current, data.request_uid, { status: 'failed' });
          // Очистим таймаут подтверждения
          pendingTimeouts.current.delete(data.request_uid);
          console.error('Ошибка, исходящее сообщение не прошло):', data.error);
        }

        //  3. Поступило входящее c обычного чата сообщение
        if (
          data.action === 'create_text_message' &&
          data.status === 'OK' &&
          data.object.chat_type === 'chat' &&
          data.object.to_user?.uid === currentUserIdRef.current
        ) {
          console.log('Получили входящее сообщение c обычного чата) :', data);
          // добавляем входящее сообщение в {store} в массив с ключом userId===data.object.from_user.uid
          // (это id лица отправивщего входящее сообщение)
          const fromUserUid = data.object.from_user.uid;
          const serverMessage = { ...data.object, status: 'sent' };
          upsertMessageForUser(fromUserUid, serverMessage);
          addChatInChatsListStore(translateMessageIntoChat(serverMessage));
        }
        //  Поступило входящее сообщение c группы
        if (
          data.action === 'create_text_message' &&
          data.status === 'OK' &&
          (data.object.chat_type === 'public-group' || data.object.chat_type === 'private-group') &&
          data.object.from_user?.uid !== currentUserIdRef.current
        ) {
          console.log('Получили входящее сообщение с группы) :', data);
          // добавляем входящее сообщение в {store} в массив с ключом userId===data.object.from_user.uid
          // (это id группы отправившей входящее сообщение)
          const fromUserUid = data.object.chat_key;
          const serverMessage = { ...data.object, status: 'sent' };
          upsertMessageForUser(fromUserUid, serverMessage);
          addChatInChatsListStore(translateMessageIntoChat(serverMessage));
        }

        //4. входящее ws-сообщение read-status поступило отправителю первоначального исходящего текстового сообщения в обычном чате
        if (
          data.action === 'change_status_read_message' &&
          data.status === 'OK' &&
          data.object.from_user.uid === currentUserIdRef.current
        ) {
          console.log('Подтверждение об изменения read-status исходящего сообщения обычного чата :', data);
          // в store находим нужное первоначальное исходящее {текстовое сообщение} в котором свойство new меняем на false
          updateMessageByUidForUser(data.object.to_user.uid, data.object.uid, { status: 'read', new: false });
        }
        //Входящее ws-сообщение read-status поступило отправителю первоначального исходящего текстового сообщения в группе
        if (
          data.action === 'change_status_read_message' &&
          data.status === 'OK' &&
          data.object.from_user.uid === currentUserIdRef.current &&
          data.object.chat_data.chat_key === userIdRef.current
        ) {
          console.log('Подтверждение об изменения read-status исходящего сообщения группы :', data);
          // в store находим нужное первоначальное исходящее {текстовое сообщение} в котором свойство new меняем на false
          updateMessageByUidForUser(data.object.chat_data.chat_key, data.object.uid, { status: 'read', new: false });
        }

        //5. Bходящее ws-сообщение read-status поступило получателю первоначального входящего текстового сообщения в обычтом счате
        if (
          data.action === 'change_status_read_message' &&
          data.status === 'OK' &&
          data.object.to_user.uid === currentUserIdRef.current
        ) {
          console.log('Подтверждение об изменении read-status входящего сообщения обычного чата :', data);
          updateMessageByUidForUser(data.object.from_user.uid, data.object.uid, { status: 'read', new: false });
          pendingTimeouts.current.delete(data.request_uid);
        }
        // Входящее ws-сообщение read-status поступило получателю первоначального входящего текстового сообщения в группе
        if (
          data.action === 'change_status_read_message' &&
          data.status === 'OK' &&
          data.object.to_user.uid === userIdRef.current.replace('group_', '')
        ) {
          console.log('Подтверждение об изменении read-status входящего сообщения группы:', data);
          updateMessageByUidForUser(data.object.chat_data.chat_key, data.object.uid, { status: 'read', new: false });
          pendingTimeouts.current.delete(data.request_uid);
        }

        //6.входящее ws-сообщение delete_message oб удалении входящего либо исходящего сообщения обычного чата
        if (
          data.action === 'delete_message' &&
          data.status === 'OK' &&
          !data.object.to_user.username.includes('group_')
        ) {
          console.log('Cообщение сервера об удалении входящего либо исходящего сообщения чата :', data);
          // локально удаляем сообщение из store и сразу его отсутствие показываем в DOM
          if (data.object.from_user.uid === currentUserIdRef.current) {
            deleteMessageByUidForUser(data.object.to_user.uid, data.object.uid);
          } else {
            deleteMessageByUidForUser(data.object.from_user.uid, data.object.uid);
          }
          pendingTimeouts.current.delete(data.request_uid);
        }

        //входящее ws-сообщение delete_message oб удалении входящего либо исходящего сообщения группы
        if (
          data.action === 'delete_message' &&
          data.status === 'OK' &&
          data.object.to_user.username.includes('group_')
        ) {
          console.log('Cообщение сервера об удалении входящего либо исходящего сообщения группы:', data);
          deleteMessageByUidForUser(data.object.to_user.username, data.object.uid);
          pendingTimeouts.current.delete(data.request_uid);
        }

        //  7. Поступило сообщение принявшему телефонный звонок абоненту о состоявшемся телефонном звонке ('new_call_message')
        if (
          data.action === 'new_call_message' &&
          data.status === 'OK' &&
          data.object.chat_type === 'chat' &&
          data.object.to_user?.uid === currentUserIdRef.current
        ) {
          console.log('Поступило сообщение вызываемому абоненту о состоявшемся телефонном звонке:', data);
          // добавляем входящее сообщение в {store} в массив с ключом userId===data.object.from_user.uid
          // (это id позвонившего лица)
          const fromUserUid = data.object.from_user.uid;
          const serverMessage = { ...data.object, status: 'sent' };
          upsertMessageForUser(fromUserUid, serverMessage);
          addChatInChatsListStore(translateMessageIntoChat(serverMessage));
        }
        //Поступило сообщение позвонившему абоненту о состоявшемся телефонном звонке ('new_call_message')
        if (
          data.action === 'new_call_message' &&
          data.status === 'OK' &&
          data.object.chat_type === 'chat' &&
          data.object.from_user?.uid === currentUserIdRef.current
        ) {
          console.log('Поступило сообщение позвонившему абоненту о состоявшемся телефонном звонке:', data);
          // добавляем входящее сообщение в {store} в массив с ключом userId===data.object.to_user.uid
          // (это id получателя звонка)
          const fromUserUid = data.object.to_user.uid;
          const serverMessage = { ...data.object, status: 'sent' };
          upsertMessageForUser(fromUserUid, serverMessage);
          addChatInChatsListStore(translateMessageIntoChat(serverMessage));
        }
        //8. поступило от сервера событие pong
        if (data.action === 'pong') {
          console.log('Поступило сообщение от сервера "Pong"');
          lastPongRef.current = Date.now();
          return;
        }

        if (data.action === 'offer_call' && data.status === 'OK') {
          console.log('Входящий звонок от ' + data.object.from_user);
          if (currentUserId !== data.object.from_user) {
            const { first_name, last_name, avatar_url } = data.object.message_rtc.from_user;
            setCallData({
              contactFio: `${first_name} ${last_name}`,
              avatarUrl: avatar_url,
              messageRtcUid: data.object.message_rtc.uid,
              offerSdp: data.object.offer_sdp,
              fromUserUid: data.object.from_user,
              isReceivingModalOpen: true,
            });
          }
        }

        if (data.action === 'answer_call' && data.status === 'OK') {
          console.log('Ответ на звонок от ' + data.object.from_user);
          if (currentUserId === data.object.from_user) {
            setCallData({ answerSdp: data.object.answer_sdp });
            const requestUid = crypto.randomUUID();
            sendCallStateUpdate({
              action: 'call_state_update',
              request_uid: requestUid,
              object: {
                from_user_uid: currentUserId,
                to_user_uid: data.object.to_user_uid,
                message_rtc_uid: messageRtcUid,
                state: 'connected',
                reason_code: null,
              },
            });
          }
        }

        if (data.action === 'ice_candidate' && data.status === 'OK') {
          if (data.object.ice_candidate) {
            addCandidate(data.object.ice_candidate);
          }
        }

        if (data.action === 'call_completion' && data.status === 'OK') {
          console.log('Звонок завершен со статусом ' + data.object?.type_complete);
          if (data.object?.type_complete === 'rejected') {
            console.log('Звонок отклонен');
            setState('rejected');
            resetCall();
          }
          if (data.object?.type_complete === 'unreceived') {
            console.log('Не отвечает');
            setState('unreceived');
            resetCall();
          }
          if (data.object?.type_complete === 'completed') {
            console.log('Звонок завершен');
            setState('end');
            resetCall();
          }
          if (data.object?.type_complete === 'failed') {
            setState('error');
            resetCall();
          }
        }
        //входящее ws-сообщение сервера подтверждающее создание группы/канала
        if (data.action === 'create_chat' && data.status === 'OK') {
          console.log('Подтверждение сервера об создании группы/канала:', data);
          // Если сервер пришлёт подтверждение с request_uid,
          if (data.request_uid) {
            const result = {
              peer: {
                uid: data.object.chat_id,
                username: data.object.chat_key,
                nickname: data.object.name,
                firstName: '',
                lastName: '',
                avatarUrl: data.object.avatar_master_url ?? data.object.avatar_webp_url ?? '',
                avatarWebpUrl: data.object.avatar_master_url ?? '',
                isBlocked: false,
                isOnline: false,
                isInContacts: false,
                wasOnlineAt: 0,
              },
              chat: {
                id: data.object.chat_id,
                chatKey: data.object.chat_key,
                chatType: data.object.chat_type,
                name: data.object.name,
                is_favorite: false,
                notifications: true,
                newMessageCount: 0,
                lastActivityAt: 0,
              },
              messages: {},
            };
            if (data.object.created_by === currentUserIdRef.current) {
              let text: string;
              if (data.object.chat_type === 'public-channel' || data.object.chat_type === 'private-channel') {
                text = `@@@ Канал создан`;
              } else {
                text = `@@@ ${data.object.owner_full_name} создал(а) группу "${data.object.name}"`;
              }
              // если владелец группы/канала, то заменим в store заглушку чата стоящую в DOM на присланный сервером чат
              updateChatByUidStore(data.request_uid, result);
              if (!stopRef.current) {
                //после создания группы/канала сразу туда переходим
                router.push(`/chats/${data.object.chat_key}`);
                // после создания группы/канала от имени владельца отправляем сообщение всем подписчикам
                sendMessage({ content: text, chatKey: data.object.chat_key });
                stopRef.current = true;
              }
            } else {
              // если участник группы/канала, то добавим в список чатов в store новый чат
              addChatInChatsListStore(result);
            }
          }
          // Очистим таймаут подтверждения
          pendingTimeouts.current.delete(data.request_uid);
        }
        //входящее ws-сообщение сервера не подтверждающее создание группы/канала из-за возникшей ошибки
        if (data.action === 'create_chat' && data.status === 'error') {
          console.log('Cообщение сервера что при создании группы/канала возникла ошибка :', data);
          // Если сервер прислал ошибку, удалим по request_uid из store заглушку стоящую в DOM на созданную группу/канал
          deleteChatByUidStore(data.request_uid);
          stopRef.current = true;
          // Очистим таймаут подтверждения
          pendingTimeouts.current.delete(data.request_uid);
        }
      };
    } catch (e) {}
  }, [
    wsUrl,
    addMessageForUser,
    updateMessageByUidForUser,
    upsertMessageForUser,
    deleteMessageByUidForUser,
    updateChatByUidStore,
    deleteChatByUidStore,
  ]);

  // чтобы scheduleReconnect мог вызывать connectWS
  useEffect(() => {
    // подписки на offline/online
    const onOnline = (): void => {
      // при появлении сети — попытка подключения
      reconnectAttemptRef.current = 0;
      clearReconnectTimer();
      connectWS();
    };

    const onOffline = (): void => {
      // при offline — закрыть и не спамить reconnect-ом
      clearReconnectTimer();
      wsRef.current?.close();
    };

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    // старт
    connectWS();
    // тихий refresh каждые 15 минут
    const interval = setInterval(
      () => {
        //перед каждым connect освежаем access
        refreshWsSession(refreshUrl).catch(() => {});
      },
      15 * 60 * 1000,
    );
    return (): void => {
      clearInterval(interval);
      isUnmountedRef.current = true;
      //clearReconnectTimer();
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      pendingTimeouts.current.forEach((id) => clearTimeout(id));
      pendingTimeouts.current.clear();
    };
  }, [wsUrl]);

  // Функция отправки сообщения
  const sendMessage = useCallback(
    async ({
      content,
      repliedMessage,
      forwardMessage,
      file,
      images,
      chatKey,
      toUserUid,
    }: {
      content: string;
      repliedMessage?: RestMessageApi | null | undefined;
      forwardMessage?: RestMessageApi | null | undefined;
      file?: Attachment | null | undefined;
      images?: Attachment[] | null | undefined;
      chatKey?: string;
      toUserUid?: string;
    }): Promise<void> => {
      if (
        !content?.trim() &&
        !(
          images?.length ||
          forwardMessage?.files_list.length ||
          forwardMessage?.forwarded_messages[0].files_list.length ||
          file
        )
      )
        return;
      const requestUid = crypto.randomUUID();
      // выясняем это простой чат либо группа (если true, то группа/канал)
      const hasGroup = userIdRef.current.includes('group_');
      const hasChannel = userIdRef.current.includes('channel_');
      //создаем в DOM временное сообщение-заглушку для помещения в список сообщений
      const tempMessage: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' } = {
        id: 0,
        uid: requestUid,
        from_user: {
          uid: currentUserIdRef.current,
          is_deleted: false,
          username: '',
          nickname: '',
          avatar_webp_url: '',
          avatar_small_url: '',
          avatar_master_url: '',
        },
        to_user: {
          uid: hasGroup || hasChannel ? '' : toUserUid ? toUserUid : userIdRef.current,
          is_deleted: false,
          username: '',
          nickname: '',
          avatar_webp_url: '',
          avatar_small_url: '',
          avatar_master_url: '',
        },
        content,
        replied_messages: [],
        forwarded_messages: [],
        files_list: [],
        new: true,
        created_at: Date.now() / 1000,
        updated_at: 0,
        chat_id: 0,
        chat_key: chatKey ? chatKey : hasGroup || hasChannel ? userIdRef.current : '',
        chat_type: 'chat',
        message_rtc: {
          uid: '',
          duration: 0,
          status: '',
          updated_at: 0,
          created_at: 0,
        },
        status: 'pending',
      };

      if (repliedMessage) {
        tempMessage.replied_messages = [
          {
            id: repliedMessage.id,
            uid: repliedMessage.uid,
            is_deleted: false,
            from_user: repliedMessage.from_user.uid,
            first_name: repliedMessage.from_user.first_name ?? '',
            last_name: repliedMessage.from_user.last_name ?? '',
            content: repliedMessage.content,
            files_list: [...repliedMessage.files_list],
          },
        ];
      }
      if (forwardMessage) {
        tempMessage.forwarded_messages = [
          {
            id: forwardMessage.id,
            uid: forwardMessage.uid,
            from_user: forwardMessage.from_user.uid,
            first_name: forwardMessage.from_user.first_name ?? '',
            last_name: forwardMessage.from_user.last_name ?? '',
            content: forwardMessage.content,
            files_list: [...forwardMessage.files_list],
            avatar_webp_url: forwardMessage.from_user.avatar_webp_url,
          },
        ];
      }
      if (file) {
        tempMessage.files_list = [
          {
            id: 0,
            uid: file.id,
            download_name: file.fileData.filename,
            media_kind: '',
            file_protected_url: file.preview,
            file_webp_url: file.preview,
            file_small_url: '',
            file_type: file.type,
            created_at: 0,
            updated_at: 0,
          },
        ];
      }

      if (images?.length) {
        tempMessage.files_list = images.map((image) => ({
          id: 0,
          uid: image.id,
          download_name: image.fileData.filename,
          media_kind: '',
          file_protected_url: image.preview,
          file_webp_url: image.preview,
          file_small_url: '',
          file_type: image.type,
          created_at: 0,
          updated_at: 0,
        }));
      }

      // записываем в store и показываем локально сразу в DOM созданное клиентом сообщение (tempMessage)
      addMessageForUser(chatKey ? chatKey : toUserUid ? toUserUid : userIdRef.current, tempMessage);

      // Отправляем через WS созданное клиентом сообщение (payloadMessage) (если соединение есть)
      const payloadMessage: CreateTextMessageAPI = {
        action: 'create_text_message',
        request_uid: requestUid,
        object: {
          content,
          status: 'publish',
          message_attachment_uids: [],
          replied_messages: [],
          forwarded_messages: [],
        },
      };
      if (chatKey) {
        payloadMessage.object.chat_key = chatKey;
      } else {
        if (hasGroup || hasChannel) {
          payloadMessage.object.chat_key = userIdRef.current;
        } else {
          payloadMessage.object.to_user_uid = toUserUid ? toUserUid : userIdRef.current;
        }
      }
      if (repliedMessage) {
        payloadMessage.object.replied_messages = [repliedMessage.uid];
      }
      if (forwardMessage) {
        payloadMessage.object.forwarded_messages = [forwardMessage.uid];
      }
      if (file) {
        try {
          if (file.type === 'audio/webm') {
            const response = await voiceUploadApi(file.file);
            payloadMessage.object.message_attachment_uids = [response.uid];
          } else {
            const response = await filesUploadApi(file.file);
            payloadMessage.object.message_attachment_uids = [response.results[0].uid];
          }
        } catch (error) {
          console.error('Ошибка при загрузке файла: ', error);
        }
      }
      if (images?.length) {
        try {
          const arrayUid = await Promise.all(
            images.map(async (image) => {
              const response = await filesUploadApi(image.file);
              return response.results[0].uid;
            }),
          );
          payloadMessage.object.message_attachment_uids = arrayUid;
        } catch (error) {
          console.error('Ошибка при загрузке файла: ', error);
        }
      }
      //валидация c помощью zod
      const resultZod = serializerRequestCreatingMessageApiSchema.safeParse(payloadMessage);

      const socket = wsRef.current;
      if (socket && socket.readyState === WebSocket.OPEN && resultZod.success) {
        socket.send(JSON.stringify(payloadMessage));
        console.log('Send of server message: ', payloadMessage);
        //Устанавливаем таймаут ожидания подтверждения (5cek)
        const to = setTimeout(() => {
          // Если за 5 cек не пришло сообщение-подтверждение от ws меняем в сообщении
          //  статус с 'pending' на 'failed' - {status:failed}
          updateMessageByUidForUser(userIdRef.current, requestUid, { status: 'failed' });
          pendingTimeouts.current.delete(requestUid);
        }, 5000);
        pendingTimeouts.current.set(requestUid, to);
      } else {
        // Если socket не готов отправить на сервер созданное клиентом сообщение, тогда в данном сообщении сразу меняем
        //  статус с 'pending' на 'failed' - {status:failed}.
        updateMessageByUidForUser(userIdRef.current, requestUid, { status: 'failed' });
        messageQueueRef.current.push(payloadMessage);
      }
    },
    [addMessageForUser, updateMessageByUidForUser, userIdRef],
  );

  // Пересылка профиля из страницы инфо
  const sendProfile = (payload: CreateTextMessageAPI): void => {
    const resultZod = serializerRequestCreatingMessageApiSchema.safeParse(payload);
    const socket = wsRef.current;
    if (socket && socket.readyState === WebSocket.OPEN && resultZod.success) {
      socket.send(JSON.stringify(payload));
      console.log('Send to server profile: ', payload);
    } else {
      messageQueueRef.current.push(payload);
    }
  };

  // Функция создания группы/канала
  const createGroupOrChannel = useCallback(
    async ({
      name,
      chatType,
      uidUsersList,
      description,
      avatarPreview,
      file,
    }: {
      name: string;
      chatType: 'public-group' | 'private-group' | 'public-channel' | 'private-channel';
      uidUsersList: string[];
      description?: string;
      avatarPreview?: string;
      file?: File | null;
    }): Promise<void> => {
      stopRef.current = false;
      const requestUid = crypto.randomUUID();
      //создаем временную чат-заглушку для помещения в список чатов DOM
      const tempChat: Chat = {
        peer: {
          uid: requestUid,
          username: '',
          nickname: name,
          firstName: '',
          lastName: '',
          avatarUrl: avatarPreview ?? '',
          avatarWebpUrl: avatarPreview ?? '',
          isBlocked: false,
          isOnline: false,
          isInContacts: false,
          wasOnlineAt: 0,
        },
        chat: {
          id: 0,
          chatKey: '',
          chatType: chatType,
          name,
          is_favorite: false,
          notifications: true,
          newMessageCount: 0,
          lastActivityAt: 0,
        },
        messages: {},
      };

      // записываем в store и показываем локально сразу в DOM созданный клиентом чат (tempChat)
      addChatInChatsListStore(tempChat);
      const payload: CreateChatRequestApi = {
        action: 'create_chat',
        request_uid: requestUid,
        object: {
          name,
          chat_type: chatType,
          uid_users_list: uidUsersList,
          ...(description && { description }),
        },
      };
      if (file) {
        try {
          const response = await avatarUploadApi(file);
          payload.object.avatar_uid = response.uid;
        } catch (error) {
          console.error('Ошибка при загрузке аватара: ', error);
        }
      }
      // Валидация через Zod
      const resultZod = CreateChatRequestSchema.safeParse(payload);
      const socket = wsRef.current;
      if (socket && socket.readyState === WebSocket.OPEN && resultZod.success) {
        socket.send(JSON.stringify(payload));
        console.log('Sent create_chat request:', payload);
        //Устанавливаем таймаут ожидания подтверждения (5cek)
        const to = setTimeout(() => {
          // Если за 60 cек не пришло сообщение-подтверждение от ws меняем в сообщении
          console.log('Группа/канал не созданы');
          pendingTimeouts.current.delete(requestUid);
        }, 60000);
        pendingTimeouts.current.set(requestUid, to);
      } else {
        // Если ws-соединение по какой-то причине закрыто, тогда ставим это сообщение (payload) в очередь на отправку
        // когда ws-соединение установиться
        messageQueueRef.current.push(payload);
      }
    },
    [],
  );

  // Добавление / удаление участников в группу / канал
  const sendMembers = (payload: AddOrRemoveMembersRequestAPI): void => {
    const resultZod = serializerRequestApiSchema.safeParse(payload);
    const socket = wsRef.current;
    if (socket && socket.readyState === WebSocket.OPEN && resultZod.success) {
      socket.send(JSON.stringify(payload));
      console.log('Send to server members: ', payload);
    } else {
      messageQueueRef.current.push(payload);
    }
  };

  // Покинуть группу / канал
  const sendLeaveGroup = (payload: LeaveGroupRequestAPI): void => {
    const resultZod = serializerRequestLeaveGroupApiSchema.safeParse(payload);
    const socket = wsRef.current;
    if (socket && socket.readyState === WebSocket.OPEN && resultZod.success) {
      socket.send(JSON.stringify(payload));
      console.log('Send to server leave from group: ', payload);
    } else {
      messageQueueRef.current.push(payload);
    }
  };

  // Удалить группу / канал
  const sendDeleteGroup = (payload: DeleteGroupRequestAPI): void => {
    const resultZod = serializerRequestLeaveGroupApiSchema.safeParse(payload);
    const socket = wsRef.current;
    if (socket && socket.readyState === WebSocket.OPEN && resultZod.success) {
      socket.send(JSON.stringify(payload));
      console.log('Send to server delete group: ', payload);
    } else {
      messageQueueRef.current.push(payload);
    }
  };

  // Редактирование группы / канала
  const sendEditGroup = (payload: EditChatRequestAPI): void => {
    const resultZod = serializerRequestEditChat.safeParse(payload);
    const socket = wsRef.current;
    if (socket && socket.readyState === WebSocket.OPEN && resultZod.success) {
      socket.send(JSON.stringify(payload));
      console.log('Send to server edited group: ', payload);
    } else {
      messageQueueRef.current.push(payload);
    }
  };

  // Очистка сообщений группы / канала
  const sendClearGroup = (payload: ClearGroupRequestAPI): void => {
    const resultZod = serializerRequestClearGroupMessages.safeParse(payload);
    const socket = wsRef.current;
    if (socket && socket.readyState === WebSocket.OPEN && resultZod.success) {
      socket.send(JSON.stringify(payload));
      console.log('Send to server crear group: ', payload);
    } else {
      messageQueueRef.current.push(payload);
    }
  };

  // Отправляет ответ на входящий WebRTC вызов с SDP answer.
  const sendAnswerCall = (payload: AnswerCallRequestAPI): void => {
    const resultZod = serializerAnswerRequestApiSchema.safeParse(payload);
    const socket = wsRef.current;
    if (socket && socket.readyState === WebSocket.OPEN && resultZod.success) {
      socket.send(JSON.stringify(payload));
      console.log('Send answer to call: ', payload);
    } else {
      messageQueueRef.current.push(payload);
    }
  };

  // Для изменения сообщения о статусе звонка.
  const sendCallCompletion = (payload: CallCompleteRequestAPI): void => {
    const resultZod = serializerCallCompleteRequestApiSchema.safeParse(payload);
    const socket = wsRef.current;
    if (socket && socket.readyState === WebSocket.OPEN && resultZod.success) {
      socket.send(JSON.stringify(payload));
      console.log('Send complete call: ', payload);
    } else {
      messageQueueRef.current.push(payload);
    }
  };

  // Для передачи состояния WebRTC соединения.
  const sendCallStateUpdate = (payload: CallStateRequestAPI): void => {
    const resultZod = serializerCallStateRequestApiSchema.safeParse(payload);
    const socket = wsRef.current;
    if (socket && socket.readyState === WebSocket.OPEN && resultZod.success) {
      socket.send(JSON.stringify(payload));
      console.log('Send call state: ', payload);
    } else {
      messageQueueRef.current.push(payload);
    }
  };

  // Пересылает ICE кандидаты для установления WebRTC соединения.
  const sendIceCandidate = (payload: IceCandidateRequestAPI): void => {
    const resultZod = serializerIceCandidateRequestApiSchema.safeParse(payload);

    const socket = wsRef.current;
    if (socket && socket.readyState === WebSocket.OPEN && resultZod.success) {
      socket.send(JSON.stringify(payload));
      console.log('Send ice candidate: ', payload);
    } else {
      messageQueueRef.current.push(payload);
    }
  };

  // Инициирует голосовой или видеовызов между пользователями
  const sendOfferCall = (payload: OfferCallRequestAPI): void => {
    const resultZod = serializerCallOfferRequestApiSchema.safeParse(payload);

    const socket = wsRef.current;
    if (socket && socket.readyState === WebSocket.OPEN && resultZod.success) {
      socket.send(JSON.stringify(payload));
      console.log('Send offer call: ', payload);
    } else {
      messageQueueRef.current.push(payload);
    }
  };

  // Функция отправки сообщения на изменение статуса прочитки входящего сообщения
  const sendChangeStatusReadMessage = useCallback(
    (message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' }): void => {
      if (!message.uid || message.new === false) return;
      const requestUid = crypto.randomUUID();
      // выясняем это простой чат либо группа (если true то группа)
      const has = message.chat_key.includes('group_');
      // Отправляем через WS созданное клиентом сообщение (payloadMessage) (если соединение есть)
      const payloadMessage: ChangeStatusReadMessageAPI = {
        action: 'change_status_read_message',
        request_uid: requestUid,
        object: {
          uid: message.uid,
          reader_uid: currentUserIdRef.current,
          new_read_status: false,
        },
      };
      if (has) {
        payloadMessage.object.chat_key = message.chat_key;
      }
      //валидация c помощью zod
      const resultZod = serializerRequestChangeStatusReadMessageApiSchema.safeParse(payloadMessage);
      const socket = wsRef.current;
      if (socket && socket.readyState === WebSocket.OPEN && resultZod.success) {
        //отправляем запрос
        socket.send(JSON.stringify(payloadMessage));
        console.log('Send of server change-status-read-message: ', payloadMessage);
        const to = setTimeout(() => {
          // Если за 5 cек не пришло сообщение-подтверждение от ws,
          //  направляем повторно send ws-сообщение
          socket.send(JSON.stringify(payloadMessage));
          pendingTimeouts.current.delete(requestUid);
        }, 5000);
        pendingTimeouts.current.set(requestUid, to);
      } else {
        messageQueueRef.current.push(payloadMessage);
      }
    },
    [wsRef, updateMessageByUidForUser],
  );

  // Функция удаления сообщения
  const sendDeleteMessage = useCallback(
    (message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' }, for_all?: boolean | null): void => {
      if (!message.uid) return;
      const requestUid = crypto.randomUUID();
      // выясняем это простой чат либо группа (если true то группа)
      const has = message.chat_key.includes('group_');
      // Отправляем через WS созданное клиентом сообщение (payloadMessage) (если соединение есть)
      const payloadMessage: DeleteMessageApi = {
        action: 'delete_message',
        request_uid: requestUid,
        object: {
          uid: message.uid,
          for_all: for_all ?? false,
        },
      };
      if (has) {
        payloadMessage.object.chat_key = message.chat_key;
      }
      //валидация c помощью zod
      const resultZod = serializerRequestDeleteMessageApiSchema.safeParse(payloadMessage);
      // локально удаляем сообщение из store и сразу его отсутствие показываем в DOM
      deleteMessageByUidForUser(
        has
          ? message.chat_key
          : message.from_user.uid === currentUserIdRef.current
            ? message.to_user.uid
            : message.from_user.uid,
        message.uid,
      );
      const socket = wsRef.current;
      if (socket && socket.readyState === WebSocket.OPEN && resultZod.success) {
        //отправляем запрос
        socket.send(JSON.stringify(payloadMessage));
        console.log('Send of server delete-message: ', payloadMessage);
        const to = setTimeout(() => {
          // Если за 5 cек не пришло сообщение-подтверждение от ws,
          //  направляем повторно send ws-сообщение
          socket.send(JSON.stringify(payloadMessage));
          pendingTimeouts.current.delete(requestUid);
        }, 5000);
        pendingTimeouts.current.set(requestUid, to);
      } else {
        messageQueueRef.current.push(payloadMessage);
      }
    },
    [wsRef, userIdRef, deleteMessageByUidForUser],
  );

  return {
    sendMessage,
    sendProfile,
    sendMembers,
    sendLeaveGroup,
    sendDeleteGroup,
    sendEditGroup,
    sendClearGroup,
    sendAnswerCall,
    sendCallCompletion,
    sendCallStateUpdate,
    sendIceCandidate,
    sendOfferCall,
    sendChangeStatusReadMessage,
    sendDeleteMessage,
    createGroupOrChannel,
  };
}
