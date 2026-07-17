import type { GroupInfo } from 'modules/info/entity/info.entity';
import type { ChatFilesListApi, MessageLinkApi } from 'modules/info/model/info.api.schema';

export type GroupPanelProps = {
  uid: string;
  currentUid: string;
  profile: GroupInfo | undefined;
  isLoading: boolean;
  chat_id: number;
  filesList: {
    imageFileList: ChatFilesListApi[] | undefined;
    fileFileList: ChatFilesListApi[] | undefined;
    voiceFileList: ChatFilesListApi[] | undefined;
    linksList: MessageLinkApi[] | undefined;
  };
};
