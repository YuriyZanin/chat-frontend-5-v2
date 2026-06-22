import type { ProfileInfo } from 'modules/info/entity/info.entity';
import type { ChatFilesListApi, MessageLinkApi } from 'modules/info/model/info.api.schema';
export type ContactPanelProps = {
  uid: string;
  currentUid: string;
  profile?: ProfileInfo;
  isLoading: boolean;
  filesList: {
    imageFileList: ChatFilesListApi[] | undefined;
    fileFileList: ChatFilesListApi[] | undefined;
    voiceFileList: ChatFilesListApi[] | undefined;
    linksList: MessageLinkApi[] | undefined;
  };
};
