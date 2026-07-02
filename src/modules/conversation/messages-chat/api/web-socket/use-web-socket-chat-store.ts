import type {
  AddOrRemoveMembersRequestAPI,
  ClearGroupRequestAPI,
  DeleteGroupRequestAPI,
  EditChatRequestAPI,
  LeaveGroupRequestAPI,
} from 'modules/info/model/info.web-socket.api.schema';
import { create } from 'zustand';
import type {
  AnswerCallRequestAPI,
  CallCompleteRequestAPI,
  CallStateRequestAPI,
  IceCandidateRequestAPI,
  OfferCallRequestAPI,
} from '../../model/calls';
import type { CreateTextMessageAPI, RestMessageApi } from '../../model/messages-list';
import type { Attachment } from '../../ui/context-menu/context-menu-attach-file/context-menu-attach-file.props';

type WebSocketChatProps = {
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
    chatType: 'public-group' | 'private-group' | 'public-channel' | 'private-channel' | null;
    uidUsersList: string[];
    description?: string;
    avatarPreview?: string;
    file?: File | null;
  }) => void;
};

type WebSocketChatState = {
  webSocketChat: WebSocketChatProps | null;
  setWebSocketChat: ({
    sendMessage,
    sendProfile,
    sendChangeStatusReadMessage,
    sendDeleteMessage,
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
    createGroupOrChannel,
  }: WebSocketChatProps) => void;
};

export const useWebSocketChatStore = create<WebSocketChatState>((set) => ({
  webSocketChat: null,
  setWebSocketChat: (webSocketChat: WebSocketChatProps): void =>
    set({
      webSocketChat,
    }),
}));
