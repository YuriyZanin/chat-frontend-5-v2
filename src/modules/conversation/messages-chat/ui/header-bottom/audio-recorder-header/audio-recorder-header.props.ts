import type { RestMessageApi } from 'modules/conversation/messages-chat/model/messages-list';
import type { Attachment } from '../../context-menu/context-menu-attach-file/context-menu-attach-file.props';

export type AudioRecorderHeaderProps = {
  setIsRecordingMessage: (b: boolean) => void;
  sendMessage: ({
    content,
    repliedMessage,
    forwardMessage,
    file,
  }: {
    content: string;
    repliedMessage?: RestMessageApi | null | undefined;
    forwardMessage?: RestMessageApi | null | undefined;
    file?: Attachment | null | undefined;
  }) => void;
};
